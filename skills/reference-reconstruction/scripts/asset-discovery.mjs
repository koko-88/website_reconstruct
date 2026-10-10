import {parse as parseHTML} from 'parse5';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import parseSrcset from 'parse-srcset';
import {parse as parseJS} from 'acorn';
import m3u8 from 'm3u8-parser';
import {DOMParser} from '@xmldom/xmldom';

export {assetKinds as kinds} from './asset-policy.mjs';
export function kindFor(url,mime='') {
  const type=mime.split(';')[0].toLowerCase();
  const pathname=(()=>{try{return new URL(url).pathname;}catch{return url;}})();
  if(type==='text/html'||/\.html?$/i.test(pathname)){ return 'html'; }
  if(type==='text/css'||/\.css$/i.test(pathname)){ return 'css'; }
  if(/javascript/.test(type)||/\.[cm]?js$/i.test(pathname)){ return 'javascript'; }
  if(type==='image/svg+xml'||/\.svg$/i.test(pathname)){ return 'svg'; }
  if(type.startsWith('image/')||/\.(png|jpe?g|webp|gif|avif|apng|ico|bmp|tiff?|ktx2?|dds|hdr|exr)$/i.test(pathname)){ return 'image'; }
  if(['application/font-woff','application/font-sfnt','application/vnd.ms-opentype','application/x-font-ttf','application/x-font-opentype'].includes(type)||type.startsWith('font/')||/\.(woff2?|[ot]tf|ttc|otc)$/i.test(pathname)){ return 'font'; }
  if(/\.(m3u8|mpd)$/i.test(pathname)||/mpegurl|dash\+xml/.test(type)){ return 'media'; }
  if(/\.m4s$/i.test(pathname)){ return 'media-segment'; }
  if(type.startsWith('video/')||/\.(mp4|webm|mov|m4v|ogv)$/i.test(pathname)){ return 'video'; }
  if(type.startsWith('audio/')||/\.(mp3|wav|ogg|m4a|flac|opus)$/i.test(pathname)){ return 'audio'; }
  if(/\.(m3u8|mpd)$/i.test(pathname)){ return 'media'; }
  if(/model\/gltf/.test(type)||/\.gl(?:tf|b)$/i.test(pathname)){ return 'gltf'; }
  if(type==='application/wasm'||/\.wasm$/i.test(pathname)){ return 'wasm'; }
  if(/\.(glsl|vert|frag|wgsl)$/i.test(pathname)){ return 'shader'; }
  if(type==='application/json'||/\.(json|webmanifest)$/i.test(pathname)){ return 'json'; }
  return 'unknown';
}
const unescapeCSS=value=>value.replace(/\\([0-9a-f]{1,6})\s?|\\([^\r\n])/gi,(_,hex,char)=>hex?String.fromCodePoint(Math.min(Number.parseInt(hex,16)||65533,1114111)):char);
export function xmlDocument(text) {
  if(/<!DOCTYPE|<!ENTITY/i.test(text)){ throw new Error('XML entities/DTD unsupported'); }
  const errors=[];
  const doc=new DOMParser({onError:(level,message)=>errors.push(level+': '+message)}).parseFromString(text,'application/xml');
  if(errors.length||!doc.documentElement){ throw new Error('Malformed XML'); }
  return doc;
}
function discoverCSS(source,context,via='css',extra={}) {
  const {add,limits}=context;
    const root=postcss.parse(source,{from:undefined});
    const conditions=node=>{const result=[];for(let p=node.parent;p;p=p.parent){ if(p.type==='atrule'){ result.push('@'+p.name+' '+p.params); } }return result.reverse();};
    const urls=(value,fn)=>{
      valueParser(value).walk(node=>{
        if(node.type==='function'&&node.value.toLowerCase()==='url'){const raw=valueParser.stringify(node.nodes).trim().replace(/^(['"])(.*)\1$/s,'$2');fn(unescapeCSS(raw));return false;}
        if(node.type==='function'&&/image-set$/i.test(node.value)){ for(const part of node.nodes){ if(part.type==='string'){ fn(unescapeCSS(part.value)); } } }
      });
    };
    root.walkAtRules('import',rule=>{
      const nodes=valueParser(rule.params).nodes;
      if(nodes[0]?.type==='string'){ add(unescapeCSS(nodes[0].value),'css','css-import',{...extra,conditions:conditions(rule),params:rule.params}); }
      else { urls(rule.params,v=>add(v,'css','css-import',{...extra,conditions:conditions(rule)})); }
    });
    root.walkDecls(decl=>{
      const font=decl.parent.type==='atrule'&&decl.parent.name.toLowerCase()==='font-face';
      const descriptors=font?Object.fromEntries(decl.parent.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value])):{};
      urls(decl.value,v=>add(v,font?'font':undefined,via,{...extra,property:decl.prop,selector:decl.parent.selector||null,conditions:conditions(decl),...(font?{font:descriptors}:{})}));
      if(font&&/local\(/.test(decl.value)){ limits.push('local-font-alternative; rendered font needs separate evidence'); }
    });

}

function discoverHTML(context) {
  const {text,maxBytes,add,css,references,limits}=context;
      const document=parseHTML(text,{sourceCodeLocationInfo:true});
      const stack=[document],nodes=[];let count=0;
      while(stack.length){const node=stack.pop();if(++count>100000){limits.push('html-node-budget');break;}nodes.push(node);stack.push(...(node.childNodes||[]));if(node.content){ stack.push(node.content); }}
      const base=nodes.find(n=>n.tagName==='base'&&n.attrs.some(a=>a.name==='href'));
      if(base) {try{context.baseURL=new URL(base.attrs.find(a=>a.name==='href').value,context.baseURL).href;}catch{limits.push('invalid-base-url');}}
      function imageVariants(a,detail) {
        if(a.poster){ add(a.poster,'image','html-poster',detail); }
        if(a.srcset){ for(const variant of parseSrcset(a.srcset)){ add(variant.url,'image','html-srcset',{...detail,variant,sizes:a.sizes,media:a.media}); } }
      }
      function elementReferences(node,tag,a,detail) {
        if(['img','source','video','audio','script','iframe','embed','object','input','image','use'].includes(tag)) {
          const value=a.src||a.data||a.href||a['xlink:href'];
          if(tag!=='iframe'){
            let hint;
            if(tag==='script'){hint='javascript';}
            else if(tag==='video'||tag==='audio'){hint=tag;}
            add(value,hint,'html-attribute',detail);
          }
          else { limits.push('frame-content requires separate scoped observation'); }
        }
        imageVariants(a,detail);
        if(tag==='link'&&/stylesheet|preload|modulepreload|icon|manifest/.test(a.rel||'')){ add(a.href,a.rel==='stylesheet'?'css':undefined,'html-link',{...detail,rel:a.rel,as:a.as}); }
        if(a.style){ css('x{'+a.style+'}','inline-style',detail); }
        if(tag==='style'){ css((node.childNodes||[]).map(n=>n.value||'').join(''),'inline-stylesheet',detail); }
      }
      function inspectElement(node) {
        const tag=node.tagName;if(!tag){ return; }
        const a=Object.fromEntries(node.attrs.map(a=>[a.name,a.value])),detail={tag,line:node.sourceCodeLocation?.startLine};
        elementReferences(node,tag,a,detail);
        if(tag==='svg'&&node.sourceCodeLocation?.endOffset) {
          const original=text.slice(node.sourceCodeLocation.startOffset,node.sourceCodeLocation.endOffset);
          add('data:image/svg+xml;base64,'+Buffer.from(original).toString('base64'),'svg','inline-svg',{...detail,origin:'original source substring'});
        }
        if(tag==='script'&&!a.src&&(!a.type||/javascript|module/.test(a.type))) {
          const inline=(node.childNodes||[]).map(n=>n.value||'').join('');
          const nested=discover(Buffer.from(inline),'javascript',context.baseURL,maxBytes);
          for(const ref of nested.references){ if(references.length<10000){ references.push({...ref,via:'inline-'+ref.via,detail:{...ref.detail,...detail}}); } }
          limits.push(...nested.limits);
        }
      }
      for(const node of nodes) {
        inspectElement(node);
      }

}

function discoverJavaScript(context) {
  const {text,add,limits}=context;
      let ast;try{ast=parseJS(text,{ecmaVersion:'latest',sourceType:'module'});}catch{ast=parseJS(text,{ecmaVersion:'latest',sourceType:'script'});}
      function moduleReferences(node) {
        if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration'].includes(node.type)&&node.source?.value){const value=node.source.value;if(/^(?:[./]|https?:|data:)/.test(value)){ add(value,kindFor(value)==='unknown'?'javascript':kindFor(value),'module-declaration',{offset:node.start}); }else { limits.push('bare module specifier needs import-map/bundler resolution; no guessed URL'); }}
        if(node.type==='ImportExpression'&&typeof node.source?.value==='string'){if(/^(?:[./]|https?:|data:)/.test(node.source.value)){ add(node.source.value,'javascript','dynamic-import-literal',{offset:node.start}); }else { limits.push('bare dynamic import needs explicit resolution'); }}
      }
      function literalReferences(node) {
        if(node.type==='NewExpression'&&['URL','Worker','SharedWorker'].includes(node.callee?.name)&&typeof node.arguments[0]?.value==='string')
          { add(node.arguments[0].value,undefined,'constructor-declaration',{constructor:node.callee.name,offset:node.start},node.callee.name!=='URL'||kindFor(node.arguments[0].value)!=='unknown'); }
        if(node.type==='CallExpression'&&node.callee?.name==='importScripts'){ for(const argument of node.arguments){ if(typeof argument.value==='string'){ add(argument.value,'javascript','worker-import-declaration',{offset:node.start}); } } }
        if(node.type==='Literal'&&typeof node.value==='string'&&kindFor(node.value)!=='unknown'&&!node.value.includes('\n'))
          { add(node.value,undefined,'inferred-string',{offset:node.start,claim:'candidate text, not runtime use'},false); }
      }
      const stack=[ast];let count=0;
      while(stack.length){
        const node=stack.pop();if(!node||typeof node!=='object'){ continue; }
        if(++count>100000){limits.push('javascript-node-budget');break;}
        moduleReferences(node);literalReferences(node);
        for(const value of Object.values(node)){ if(Array.isArray(value)){ stack.push(...value); }else if(value&&typeof value==='object'){ stack.push(value); } }
      }
      limits.push('computed URLs, dynamic chunks and worker/renderer internals require runtime/owner evidence');

}

function discoverSVG(context) {
  const {text,add,css}=context;
      const doc=xmlDocument(text),all=[doc.documentElement,...doc.getElementsByTagName('*')];
      function inspectElement(el) {
        const sourceBase=context.baseURL,chain=[];for(let ancestor=el;ancestor?.nodeType===1;ancestor=ancestor.parentNode){ chain.unshift(ancestor); }
        for(const ancestor of chain){ if(ancestor.hasAttribute('xml:base')){ context.baseURL=new URL(ancestor.getAttribute('xml:base'),context.baseURL).href; } }
        for(const name of ['href','xlink:href']){ if(el.hasAttribute(name)){ add(el.getAttribute(name),undefined,'svg-reference',{tag:el.tagName}); } }
        if(el.hasAttribute('style')){ css('x{'+el.getAttribute('style')+'}','svg-style'); }
        for(let i=0;i<el.attributes.length;i++){const a=el.attributes.item(i);if(a.value.includes('url(')){ css('x{a:'+a.value+'}','svg-attribute',{attribute:a.name}); }}
        if(el.localName==='style'){ css(el.textContent,'svg-stylesheet'); }
        context.baseURL=sourceBase;
      }
      for(const el of all) {
        inspectElement(el);
      }

}

function discoverJSON(context) {
  const {bytes,text,kind,add,limits}=context;
      let document;
      if(kind==='gltf'&&bytes.subarray(0,4).toString()==='glTF') {
        // The maintained loader reads/validates binary layout; it performs no network here.
        return {references:[],limits:['binary-gltf dependencies require binaryToJSON inspection']};
      } else { document=JSON.parse(text); }
      if(document.asset?.version) {
        for(const item of document.buffers||[]){ add(item.uri,'binary','gltf-buffer',{byteLength:item.byteLength}); }
        for(const item of document.images||[]){ add(item.uri,undefined,'gltf-image',{mimeType:item.mimeType}); }
        if(document.extensionsRequired?.length){ limits.push('glTF required extensions: '+document.extensionsRequired.join(',')); }
      } else {
        for(const icon of [...(document.icons||[]),...(document.screenshots||[])]){ add(icon.src,'image','manifest-image',{sizes:icon.sizes,type:icon.type}); }
      }

}

function discoverMedia(context) {
  const {text,add,limits}=context;
      function renditions(manifest) {
        for(const [type,groups] of Object.entries(manifest.mediaGroups||{})){ for(const [group,labels] of Object.entries(groups)){ for(const [label,rendition] of Object.entries(labels)){ if(rendition.uri){ add(rendition.uri,'media','hls-rendition',{type,group,label,language:rendition.language}); } } } }
      }
      function discoverHLS() {
        const parser=new m3u8.Parser();parser.on('warn',()=>limits.push('HLS parser warning; inspect original manifest'));parser.on('error',()=>limits.push('HLS parser error; inspect original manifest'));parser.push(text);parser.end();
        const manifest=parser.manifest;
        if(!manifest.segments?.length&&!manifest.playlists?.length){ limits.push('HLS manifest has no segments/playlists'); }
        for(const playlist of [...(manifest.playlists||[]),...(manifest.iFramePlaylists||[])]){ add(playlist.uri,'media','hls-playlist',{attributes:playlist.attributes}); }
        renditions(manifest);
        for(const segment of manifest.segments||[]) {
          add(segment.uri,'media-segment','hls-segment',{duration:segment.duration,byterange:segment.byterange||null});
          if(segment.map?.uri){ add(segment.map.uri,'media-segment','hls-initialization',{byterange:segment.map.byterange||null}); }
          for(const part of segment.parts||[]){ add(part.uri,'media-segment','hls-part'); }
          if(segment.key?.method&&segment.key.method!=='NONE'){ limits.push('Encrypted HLS: keys are not acquired; owner/DRM decision required'); }
        }
        if(!manifest.endList){ limits.push('Live HLS: future segments unknown'); }
      }
      function discoverDASH() {
        const doc=xmlDocument(text);
        if(doc.documentElement.localName!=='MPD'){ throw new Error('Not an MPD manifest'); }
        const visit=(child,local)=>{
            if(child.localName==='SegmentURL'&&child.hasAttribute('media')){ add(new URL(child.getAttribute('media'),local).href,'media-segment','dash-segment'); }
            if(child.localName==='Initialization'&&child.hasAttribute('sourceURL')){ add(new URL(child.getAttribute('sourceURL'),local).href,'media-segment','dash-initialization'); }
            if(child.localName==='SegmentTemplate'){ limits.push('DASH SegmentTemplate needs observed/explicit segments; no speculative expansion'); }
            if(child.localName==='ContentProtection'){ limits.push('Protected DASH needs owner/DRM decision'); }
            walk(child,local);
        };
        const walk=(node,base)=>{
          let local=base;
          const children=Array.from({length:node.childNodes.length},(_,i)=>node.childNodes.item(i));
          for(const child of children){ if(child.nodeType===1&&child.localName==='BaseURL'){ local=new URL(child.textContent.trim(),local).href; } }
          for(const child of children) { if(child.nodeType===1) { visit(child,local); } }
        };walk(doc.documentElement,context.baseURL);
        if(doc.documentElement.getAttribute('type')==='dynamic'){ limits.push('Dynamic DASH: future segments unknown'); }
      }
      if(text.trimStart().startsWith('#EXTM3U')) { discoverHLS(); }
      else { discoverDASH(); }

}

const parsers=new Map([['html',discoverHTML],['javascript',discoverJavaScript],['svg',discoverSVG],['gltf',discoverJSON],['json',discoverJSON],['media',discoverMedia]]);
export function discover(bytes,kind,baseURL,maxBytes=5000000) {
  if(bytes.length>maxBytes)return {references:[],limits:['source-byte-budget; dependencies unknown']};
  const text=bytes.toString('utf8');
  if(['html','css','javascript','svg','json','media','shader'].includes(kind)&&!Buffer.from(text).equals(bytes))return {references:[],limits:['Non-UTF8 source needs explicit encoding/decoded derivative evidence; original bytes retained']};
  const context={bytes,text,kind,maxBytes,baseURL,references:[],limits:[]};
  context.add=(value,hint,via,detail={},acquire=true)=>{
    if(!value||value.startsWith('#'))return;
    if(context.references.length>=10000){
      if(!context.limits.includes('reference-budget'))context.limits.push('reference-budget');
      return;
    }
    try {context.references.push({url:new URL(value,context.baseURL).href,baseURL:context.baseURL,kind:hint||kindFor(value),via,detail,acquire});}
    catch{context.limits.push('invalid-reference');}
  };
  context.css=(source,via,extra)=>discoverCSS(source,context,via,extra);
  try {
    if(kind==='css')context.css(text);
    else {
      const result=parsers.get(kind)?.(context);
      if(result)return result;
    }
  } catch(error) {context.limits.push('parse-failed: '+error.message.replace(/https?:\/\/\S+/g,'[URL omitted]').slice(0,200));}
  return {references:context.references,limits:[...new Set(context.limits)]};
}
