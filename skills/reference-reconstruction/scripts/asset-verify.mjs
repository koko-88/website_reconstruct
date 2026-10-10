import fs from 'node:fs';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {sha256} from './package.mjs';
import {mediaExecutable} from './native-media.mjs';
import {xmlDocument,discover} from './asset-discovery.mjs';

async function inspectImage({bytes,text,type,limits,result}) {
  const specialized=bytes.length>=4&&(bytes.subarray(1,4).toString()==='KTX'||bytes.subarray(0,4).toString()==='DDS '||bytes.readUInt32LE(0)===20000630||text.startsWith('#?RADIANCE'));
  if(specialized)return {status:'unverified',reason:'GPU/HDR texture needs installed decoder and pinned external verification'};
  const {default:sharp}=await import('sharp');
  const image=sharp(bytes,{failOn:'warning',limitInputPixels:limits.maxPixels,animated:true});
  const meta=await image.metadata();
  if((meta.width||0)*(meta.height||0)>limits.maxPixels)throw new Error('Decoded pixel budget');
  await image.raw().toBuffer();
  const subtype=type.replace('image/','').replace('jpg','jpeg');
  if(type.startsWith('image/')&&!['x-icon','vnd.microsoft.icon'].includes(subtype)&&subtype!==meta.format)throw new Error('MIME/payload mismatch');
  return {...result,verifier:'sharp',level:'full raster decode',metadata:{format:meta.format,width:meta.width,height:meta.height,pages:meta.pages||1,space:meta.space,hasAlpha:meta.hasAlpha}};
}
function inspectSVG({text,result}) {
  const doc=xmlDocument(text);
  if(doc.documentElement.localName!=='svg')throw new Error('Not an SVG root');
  return {...result,verifier:'xmldom',metadata:{viewBox:doc.documentElement.getAttribute('viewBox'),width:doc.documentElement.getAttribute('width'),height:doc.documentElement.getAttribute('height')},level:'XML structure; dependencies and visual rendering separate'};
}
function fontMetadata(font) {
  if(!font.numGlyphs||!font.unitsPerEm)throw new Error('Invalid font metrics');
  if(!Array.isArray(font.getGlyph(0).path.commands)||!Array.isArray(font.getGlyph(font.numGlyphs-1).path.commands))throw new Error('Invalid glyph outlines');
  return {family:font.familyName,subfamily:font.subfamilyName,postscriptName:font.postscriptName,numGlyphs:font.numGlyphs,unitsPerEm:font.unitsPerEm,characterSet:font.characterSet,variationAxes:font.variationAxes||{}};
}
async function inspectFont({bytes,result}) {
  const fontkit=await import('fontkit'),font=fontkit.create(bytes);
  return {...result,verifier:'fontkit',metadata:(font.fonts||[font]).map(fontMetadata),level:'font parsing/metrics and boundary glyph outlines; rendered glyph/font parity separate'};
}
function inspectMedia({file,kind,text,limits,result}) {
  if(text.startsWith('#EXTM3U')||/^\s*<\?xml/.test(text))return {status:'unverified',reason:'Streaming manifest needs segment/DRM inventory'};
  const executable=mediaExecutable('ffprobe');
  if(!executable)return {status:'unverified',reason:'FFprobe unavailable; configure REFERENCE_FFPROBE_PATH'};
  const run=spawnSync(executable,['-v','error','-protocol_whitelist','file,pipe','-show_format','-show_streams','-of','json',file],{encoding:'utf8',timeout:limits.requestTimeoutMs,maxBuffer:2000000,windowsHide:true});
  if(run.error?.code==='ENOENT')return {status:'unverified',reason:'FFprobe unavailable'};
  if(run.error||run.status!==0)throw new Error('FFprobe failed');
  const meta=JSON.parse(run.stdout),streamTypes=kind==='media-segment'?['video','audio','subtitle']:[kind];
  if(!meta.streams?.some(stream=>streamTypes.includes(stream.codec_type)))throw new Error('Required media stream missing');
  return {...result,verifier:'ffprobe',level:'container/stream metadata; full decode/playback separate',metadata:{format:meta.format?.format_name,duration:meta.format?.duration,streams:meta.streams.map(stream=>({codec:stream.codec_name,type:stream.codec_type,width:stream.width,height:stream.height,sampleRate:stream.sample_rate,channels:stream.channels}))}};
}
function inspectWasm({bytes,result}) {
  if(!WebAssembly.validate(bytes))throw new Error('Invalid WASM module');
  return {...result,verifier:'WebAssembly.validate; no execution'};
}
function requireGLTFResources(document) {
  for(const buffer of document.json.buffers||[]) {
    if(buffer.uri&&!document.resources[buffer.uri])throw new Error('Missing glTF buffer dependency');
  }
  for(const image of document.json.images||[]) {
    if(image.uri&&!document.resources[image.uri])throw new Error('Missing glTF image dependency');
  }
}
async function inspectGLTF({bytes,text,resources,result}) {
  const {NodeIO}=await import('@gltf-transform/core'),io=new NodeIO();
  const document=bytes.subarray(0,4).toString()==='glTF'?await io.binaryToJSON(new Uint8Array(bytes)):{json:JSON.parse(text),resources:{}};
  for(const [uri,filePath] of Object.entries(resources))document.resources[uri]=new Uint8Array(fs.readFileSync(filePath));
  requireGLTFResources(document);
  if(document.json.extensionsRequired?.length)return {status:'unverified',reason:'Required glTF extensions need registered decoder validation: '+document.json.extensionsRequired.join(',')};
  const loaded=await io.readJSON(document);
  return {...result,verifier:'glTF Transform NodeIO (no network)',metadata:{meshes:loaded.getRoot().listMeshes().length,textures:loaded.getRoot().listTextures().length},level:'scene structure and supplied dependency loading; GPU fidelity separate'};
}
function inspectText({bytes,text,kind,limits,result}) {
  const parsed=discover(bytes,kind,'https://verification.invalid/',limits.maxSourceBytes);
  if(parsed.limits.some(limit=>limit.startsWith('Non-UTF8')))return {status:'unverified',reason:'Source encoding needs explicit decoding evidence'};
  if(parsed.limits.some(limit=>limit.startsWith('parse-failed')||limit.includes('budget')))throw new Error('Source parser did not complete');
  if(kind==='html'&&!/<[a-z!]/i.test(text))throw new Error('Not an HTML document');
  return {...result,verifier:{css:'PostCSS',javascript:'Acorn',json:'JSON.parse',html:'parse5',media:'m3u8-parser/xmldom (manifest structure; playback separate)'}[kind]};
}
const inspectors=new Map([
  ['image',inspectImage],['svg',inspectSVG],['font',inspectFont],
  ['video',inspectMedia],['audio',inspectMedia],['media-segment',inspectMedia],
  ['wasm',inspectWasm],['gltf',inspectGLTF],
  ...['css','javascript','json','html','media'].map(kind=>[kind,inspectText]),
]);
export async function inspectFormat(file,kind,mime,limits,resources={}) {
  const bytes=fs.readFileSync(file);
  if(!bytes.length)return {status:'failed',reason:'Empty asset'};
  if(bytes.length>limits.maxAssetBytes)return {status:'failed',reason:'Asset byte budget'};
  const text=bytes.toString('utf8'),type=mime.split(';')[0].toLowerCase();
  if(kind!=='html'&&(type==='text/html'||/^\s*<!doctype\s+html|^\s*<html[\s>]/i.test(text)))return {status:'failed',reason:'HTML response masquerades as asset'};
  const result={status:'verified',verifier:kind,sha256:sha256(bytes),level:'format structure'};
  const inspect=inspectors.get(kind);
  if(!inspect)return {status:'unverified',reason:'No format decoder selected for '+kind+'; hash is not format verification'};
  try {
    return await inspect({file,kind,bytes,text,type,limits,resources,result});
  } catch(error) {
    return {status:'failed',reason:error.message.slice(0,300)};
  }
}
// Native decoders run in a disposable process with an enforced timeout. No source is executed.
export function verifyAsset(file,kind,mime,limits,resources={}) {
  return new Promise(resolve=>{
    const child=spawn(process.execPath,[fileURLToPath(import.meta.url),'--worker'],{stdio:['pipe','pipe','pipe'],windowsHide:true});
    let output='',size=0,finished=false;
    const finish=result=>{if(finished){ return; }finished=true;clearTimeout(timer);resolve(result);};
    const timer=setTimeout(()=>{child.kill();finish({status:'unverified',reason:'Format verifier deadline'});},limits.requestTimeoutMs);
    child.on('error',()=>finish({status:'unverified',reason:'Format verifier unavailable'}));
    child.stdout.on('data',bytes=>{size+=bytes.length;if(size>2000000){child.kill();finish({status:'unverified',reason:'Verifier result budget'});}else { output+=bytes; }});
    child.stderr.resume();
    child.on('close',code=>{try {finish(code===0?JSON.parse(output):{status:'unverified',reason:'Format verifier process failed'});}catch{finish({status:'unverified',reason:'Invalid verifier result'});}});
    child.stdin.on('error',()=>{});
    child.stdin.end(JSON.stringify({file,kind,mime,limits,resources}));
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href&&process.argv[2]==='--worker'){
  let input='';for await(const chunk of process.stdin){input+=chunk;if(input.length>2000000){ throw new Error('Verifier input budget'); }}
  const data=JSON.parse(input);
  console.log(JSON.stringify(await inspectFormat(data.file,data.kind,data.mime,data.limits,data.resources)));
}
