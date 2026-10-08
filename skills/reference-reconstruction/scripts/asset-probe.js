async function assetProbe(options={}) {
  const maxNodes=Math.min(10000,Math.max(1,options.maxNodes||3000)),maxReferences=Math.min(10000,Math.max(1,options.maxReferences||3000));
  const references=[],limits=[],surfaces=[];let scanned=0,stopped=false;
  const add=(url,kind,via,detail={})=>{
    if(!url||url.startsWith('#'))return;
    if(references.length>=maxReferences){stopped=true;return;}
    try {references.push({url:new URL(url,document.baseURI).href,baseURL:document.baseURI,kind,via,detail});}catch{limits.push('invalid-reference');}
  };
  const css=(value,via,detail)=>{
    if(!String(value).includes('url(')&&!String(value).includes('image-set('))return;
    if(references.length>=maxReferences||String(value).length>1000000){stopped=true;return;}
    references.push({cssValue:String(value),baseURL:document.baseURI,kind:'unknown',via,detail});
  };
  const walk=root=>{
    for(const node of root.querySelectorAll('*')){
      if(++scanned>maxNodes||stopped){stopped=true;return;}
      const tag=node.tagName.toLowerCase(),detail={tag,id:node.id||null};
      if(tag==='img'){add(node.currentSrc,'image','selected-source',{...detail,width:node.naturalWidth,height:node.naturalHeight});add(node.src,'image','declared-src',detail);}
      if(tag==='video'||tag==='audio'){add(node.currentSrc,tag,'selected-source',detail);add(node.src,tag,'declared-src',detail);add(node.poster,'image','poster',detail);}
      if(tag==='source'){add(node.src,node.parentElement?.tagName==='PICTURE'?'image':'media','declared-source',{...detail,media:node.media,type:node.type});}
      if(node.hasAttribute('srcset')) references.push({srcset:node.getAttribute('srcset'),baseURL:node.baseURI,kind:'image',via:'declared-srcset',detail:{...detail,sizes:node.getAttribute('sizes'),media:node.getAttribute('media')}});
      if(tag==='script')add(node.src,'javascript','script',detail);
      if(tag==='link'&&/stylesheet|preload|modulepreload|icon|manifest/.test(node.rel))add(node.href,node.rel==='stylesheet'?'css':node.as||'unknown','link',{...detail,rel:node.rel});
      if(tag==='image'||tag==='use')add(node.getAttribute('href')||node.getAttribute('xlink:href'),tag==='use'?'svg':'unknown','svg-reference',detail);
      for(const pseudo of [null,'::before','::after']){
        try {const style=getComputedStyle(node,pseudo);for(const name of ['backgroundImage','maskImage','borderImageSource','listStyleImage','content','filter','clipPath'])css(style[name],'computed-style',{...detail,pseudo,property:name});}
        catch{limits.push('computed-style-unavailable');}
      }
      if(tag==='canvas')surfaces.push({...detail,kind:'canvas',width:node.width,height:node.height,disposition:'renderer-assets-unknown'});
      if(tag==='iframe'){
        surfaces.push({...detail,kind:'iframe',source:node.src,disposition:'frame-content-separate'});
        limits.push('iframe-internals-not-walked');
      }
      if(node.shadowRoot)walk(node.shadowRoot);
      if(tag.includes('-')&&!node.shadowRoot)limits.push('closed-or-absent-shadow-unknown');
    }
  };
  walk(document);
  if(stopped)limits.push('node-or-reference-budget');
  let resources=[];
  try {const all=performance.getEntriesByType('resource');resources=all.slice(0,maxReferences).map(r=>({url:r.name,kind:'unknown',via:'resource-timing',detail:{initiatorType:r.initiatorType}}));if(all.length>maxReferences)limits.push('resource-timing-budget');}
  catch{limits.push('resource-timing-unavailable');}
  return {schemaVersion:1,pageURL:location.href,baseURL:document.baseURI,timestampUTC:new Date().toISOString(),environment:{viewport:{width:innerWidth,height:innerHeight},dpr:devicePixelRatio,scroll:{x:scrollX,y:scrollY}},references,referencesTruncated:stopped,resources,surfaces,scanned,limits:[...new Set(limits),'Worker/OffscreenCanvas/WebGPU internals and generated assets require network/source/owner evidence','Font declarations do not identify actual rendered font','No private storage or arbitrary source execution']};
}
