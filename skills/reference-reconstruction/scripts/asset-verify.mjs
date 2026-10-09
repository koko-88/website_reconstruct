import fs from 'node:fs';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {sha256} from './package.mjs';
import {xmlDocument,discover} from './asset-discovery.mjs';

export async function inspectFormat(file,kind,mime,limits,resources={}) {
  const bytes=fs.readFileSync(file);
  if(!bytes.length)return {status:'failed',reason:'Empty asset'};
  if(bytes.length>limits.maxAssetBytes)return {status:'failed',reason:'Asset byte budget'};
  const text=bytes.toString('utf8'),type=mime.split(';')[0].toLowerCase();
  if(kind!=='html'&&(type==='text/html'||/^\s*<!doctype\s+html|^\s*<html[\s>]/i.test(text)))return {status:'failed',reason:'HTML response masquerades as asset'};
  const result={status:'verified',verifier:kind,sha256:sha256(bytes),level:'format structure'};
  try {
    if(kind==='image') {
      if(bytes.length>=4&&(bytes.subarray(1,4).toString()==='KTX'||bytes.subarray(0,4).toString()==='DDS '||bytes.readUInt32LE(0)===20000630||text.startsWith('#?RADIANCE')))return {status:'unverified',reason:'GPU/HDR texture needs installed decoder and pinned external verification'};
      const {default:sharp}=await import('sharp');
      const image=sharp(bytes,{failOn:'warning',limitInputPixels:limits.maxPixels,animated:true});
      const meta=await image.metadata();
      if((meta.width||0)*(meta.height||0)>limits.maxPixels)throw Error('Decoded pixel budget');
      await image.raw().toBuffer();
      Object.assign(result,{verifier:'sharp',level:'full raster decode',metadata:{format:meta.format,width:meta.width,height:meta.height,pages:meta.pages||1,space:meta.space,hasAlpha:meta.hasAlpha}});
      const subtype=type.replace('image/','').replace('jpg','jpeg');
      if(type.startsWith('image/')&&!['x-icon','vnd.microsoft.icon'].includes(subtype)&&subtype!==meta.format)throw Error('MIME/payload mismatch');
    } else if(kind==='svg') {
      const doc=xmlDocument(text);
      if(doc.documentElement.localName!=='svg')throw Error('Not an SVG root');
      Object.assign(result,{verifier:'xmldom',metadata:{viewBox:doc.documentElement.getAttribute('viewBox'),width:doc.documentElement.getAttribute('width'),height:doc.documentElement.getAttribute('height')},level:'XML structure; dependencies and visual rendering separate'});
    } else if(kind==='font') {
      const fontkit=await import('fontkit'),font=fontkit.create(bytes);
      const fonts=font.fonts||[font];
      const metadata=fonts.map(f=>{
        if(!f.numGlyphs||!f.unitsPerEm)throw Error('Invalid font metrics');
        f.getGlyph(0).path.commands;f.getGlyph(f.numGlyphs-1).path.commands;
        return {family:f.familyName,subfamily:f.subfamilyName,postscriptName:f.postscriptName,numGlyphs:f.numGlyphs,unitsPerEm:f.unitsPerEm,characterSet:f.characterSet,variationAxes:f.variationAxes||{}};
      });
      Object.assign(result,{verifier:'fontkit',metadata,level:'font parsing/metrics and boundary glyph outlines; rendered glyph/font parity separate'});
    } else if(kind==='video'||kind==='audio'||kind==='media-segment') {
      if(text.startsWith('#EXTM3U')||/^\s*<\?xml/.test(text))return {status:'unverified',reason:'Streaming manifest needs segment/DRM inventory'};
      const run=spawnSync('ffprobe',['-v','error','-protocol_whitelist','file,pipe','-show_format','-show_streams','-of','json',file],{encoding:'utf8',timeout:limits.requestTimeoutMs,maxBuffer:2000000,windowsHide:true});
      if(run.error?.code==='ENOENT')return {status:'unverified',reason:'FFprobe unavailable'};
      if(run.error||run.status!==0)throw Error('FFprobe failed');
      const meta=JSON.parse(run.stdout);
      if(!meta.streams?.some(s=>kind==='media-segment'?['video','audio','subtitle'].includes(s.codec_type):kind==='video'?s.codec_type==='video':s.codec_type==='audio'))throw Error('Required media stream missing');
      Object.assign(result,{verifier:'ffprobe',level:'container/stream metadata; full decode/playback separate',metadata:{format:meta.format?.format_name,duration:meta.format?.duration,streams:meta.streams.map(s=>({codec:s.codec_name,type:s.codec_type,width:s.width,height:s.height,sampleRate:s.sample_rate,channels:s.channels}))}});
    } else if(kind==='wasm') {if(!WebAssembly.validate(bytes))throw Error('Invalid WASM module');result.verifier='WebAssembly.validate; no execution';}
    else if(kind==='gltf') {
      const {NodeIO}=await import('@gltf-transform/core'),io=new NodeIO();
      const document=bytes.subarray(0,4).toString()==='glTF'?await io.binaryToJSON(new Uint8Array(bytes)):{json:JSON.parse(text),resources:{}};
      for(const [uri,filePath] of Object.entries(resources))document.resources[uri]=new Uint8Array(fs.readFileSync(filePath));
      for(const buffer of document.json.buffers||[])if(buffer.uri&&!document.resources[buffer.uri])throw Error('Missing glTF buffer dependency');
      for(const image of document.json.images||[])if(image.uri&&!document.resources[image.uri])throw Error('Missing glTF image dependency');
      if(document.json.extensionsRequired?.length)return {status:'unverified',reason:'Required glTF extensions need registered decoder validation: '+document.json.extensionsRequired.join(',')};
      const loaded=await io.readJSON(document);
      Object.assign(result,{verifier:'glTF Transform NodeIO (no network)',metadata:{meshes:loaded.getRoot().listMeshes().length,textures:loaded.getRoot().listTextures().length},level:'scene structure and supplied dependency loading; GPU fidelity separate'});
    } else if(['css','javascript','json','html','media'].includes(kind)) {
      const parsed=discover(bytes,kind,'https://verification.invalid/',limits.maxSourceBytes);
      if(parsed.limits.some(l=>l.startsWith('Non-UTF8')))return {status:'unverified',reason:'Source encoding needs explicit decoding evidence'};
      if(parsed.limits.some(l=>l.startsWith('parse-failed')||l.includes('budget')))throw Error('Source parser did not complete');
      if(kind==='html'&&!/<[a-z!]/i.test(text))throw Error('Not an HTML document');
      result.verifier={css:'PostCSS',javascript:'Acorn',json:'JSON.parse',html:'parse5',media:'m3u8-parser/xmldom (manifest structure; playback separate)'}[kind];
    } else return {status:'unverified',reason:'No format decoder selected for '+kind+'; hash is not format verification'};
    return result;
  }catch(error){return {status:'failed',reason:error.message.slice(0,300)};}
}
// Native decoders run in a disposable process with an enforced timeout. No source is executed.
export function verifyAsset(file,kind,mime,limits,resources={}) {
  return new Promise(resolve=>{
    const child=spawn(process.execPath,[fileURLToPath(import.meta.url),'--worker'],{stdio:['pipe','pipe','pipe'],windowsHide:true});
    let output='',size=0,finished=false;
    const finish=result=>{if(finished)return;finished=true;clearTimeout(timer);resolve(result);};
    const timer=setTimeout(()=>{child.kill();finish({status:'unverified',reason:'Format verifier deadline'});},limits.requestTimeoutMs);
    child.on('error',()=>finish({status:'unverified',reason:'Format verifier unavailable'}));
    child.stdout.on('data',bytes=>{size+=bytes.length;if(size>2000000){child.kill();finish({status:'unverified',reason:'Verifier result budget'});}else output+=bytes;});
    child.stderr.resume();
    child.on('close',code=>{try {finish(code===0?JSON.parse(output):{status:'unverified',reason:'Format verifier process failed'});}catch{finish({status:'unverified',reason:'Invalid verifier result'});}});
    child.stdin.on('error',()=>{});
    child.stdin.end(JSON.stringify({file,kind,mime,limits,resources}));
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href&&process.argv[2]==='--worker'){
  let input='';for await(const chunk of process.stdin){input+=chunk;if(input.length>2000000)throw Error('Verifier input budget');}
  const data=JSON.parse(input);
  console.log(JSON.stringify(await inspectFormat(data.file,data.kind,data.mime,data.limits,data.resources)));
}
