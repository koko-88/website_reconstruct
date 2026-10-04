async function referenceProbe(options = {}) {
  if (typeof options === 'string') options = JSON.parse(options);
  const limit = Math.min(200, Math.max(1, options.limit || 100));
  const cleanURL = value => {
    try { const u = new URL(value,location.href); return {origin:u.origin,path:u.pathname,queryKeys:[...u.searchParams.keys()],fragmentPresent:!!u.hash}; }
    catch { return {invalid:true}; }
  };
  const rect = el => {
    const r = el.getBoundingClientRect();
    return {x:r.x,y:r.y,width:r.width,height:r.height};
  };
  const visible = el => {
    const r=el.getBoundingClientRect(),s=getComputedStyle(el);
    return r.width>0 && r.height>0 && r.bottom>0 && r.right>0 && r.top<innerHeight && r.left<innerWidth && s.display!=='none' && s.visibility!=='hidden';
  };
  const allImages=[...document.images];
  const visibleImages=allImages.filter(visible);
  const sample=visibleImages.slice(0,limit);
  const decodeMs=Math.min(2000,Math.max(0,options.decodeMs||0));
  const imageRecords = await Promise.all(sample.map(async image => {
    let decode='not-attempted',timer;
    if (decodeMs) {
      try { decode=await Promise.race([image.decode().then(()=>'ok',()=> 'failed'), new Promise(resolve=>{timer=setTimeout(()=>resolve('timeout'),decodeMs);})]); }
      finally { clearTimeout(timer); }
    }
    const style=getComputedStyle(image);
    return {source:cleanURL(image.currentSrc||image.src),rect:rect(image),complete:image.complete,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,loading:image.loading,objectFit:style.objectFit,objectPosition:style.objectPosition,decode};
  }));
  const selection = list => (list||[]).slice(0,100).map(selector => {
    const nodes=[...document.querySelectorAll(selector)];
    const properties=['display','position','boxSizing','width','height','maxWidth','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','gap','gridTemplateColumns','flexDirection','overflowX','overflowY','zIndex','color','backgroundColor','fontFamily','fontSize','fontWeight','fontStyle','fontStretch','lineHeight','letterSpacing','textTransform','textAlign','borderRadius','opacity','transform'];
    const samples=nodes.slice(0,10).map(node=>{const style=getComputedStyle(node);return {tag:node.tagName.toLowerCase(),id:node.id,role:node.getAttribute('role'),expanded:node.getAttribute('aria-expanded'),selected:node.getAttribute('aria-selected'),open:node.hasAttribute('open'),hidden:node.hidden,focused:node===document.activeElement,textLength:node.textContent.length,computed:Object.fromEntries(properties.map(name=>[name,style[name]]))};});
    return {selector,count:nodes.length,visible:nodes.some(visible),rects:nodes.slice(0,10).map(rect),samples,measurementType:'computed CSS and observed DOM state; declared font stack is not actual rendered font proof',truncated:nodes.length>10};
  });
  const surfaces=[...document.querySelectorAll('canvas,svg,video,audio,iframe,object,embed')];
  const surfaceRecords=surfaces.slice(0,limit).map(el=>{
    const tag=el.tagName.toLowerCase();
    const value={tag,rect:rect(el),visible:visible(el),source:el.getAttribute('src')?cleanURL(el.getAttribute('src')):null};
    if(tag==='canvas') Object.assign(value,{width:el.width,height:el.height,renderer:'unknown; context not requested to avoid changing it'});
    if(tag==='iframe') {
      try { value.inspectability=el.contentDocument?'same-origin document available':'cross-origin or not loaded'; }
      catch { value.inspectability='cross-origin inaccessible'; }
    }
    if(tag==='video'||tag==='audio') Object.assign(value,{readyState:el.readyState,currentTime:el.currentTime,duration:Number.isFinite(el.duration)?el.duration:null,paused:el.paused,source:cleanURL(el.currentSrc||el.src)});
    return value;
  });
  const sourceNodes=[...document.querySelectorAll('script[src],link[rel~="stylesheet"],link[rel="manifest"]')];
  const sourceRecords=sourceNodes.slice(0,limit).map(el=>({tag:el.tagName.toLowerCase(),rel:el.getAttribute('rel'),source:cleanURL(el.src||el.href)}));
  const root=document.documentElement;
  return {
    schemaVersion:2,timestampUTC:new Date().toISOString(),performanceMs:performance.now(),timeOrigin:performance.timeOrigin,
    environment:{url:cleanURL(location.href),userAgent:navigator.userAgent,platform:navigator.platform,cssViewport:{width:innerWidth,height:innerHeight},clientWidth:root.clientWidth,scrollbarWidth:innerWidth-root.clientWidth,dpr:devicePixelRatio,visualViewport:visualViewport?{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale}:null,zoom:'unknown; visual scale is not browser zoom',language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,direction:getComputedStyle(root).direction,dark:matchMedia('(prefers-color-scheme:dark)').matches,reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,coarsePointer:matchMedia('(pointer:coarse)').matches,maxTouchPoints:navigator.maxTouchPoints,scroll:{x:scrollX,y:scrollY,width:root.scrollWidth,height:root.scrollHeight}},
    readiness:{documentState:document.readyState,fonts:document.fonts?document.fonts.status:'unsupported',required:selection(options.required),absent:selection(options.absent),geometry:selection(options.stableSelectors),images:imageRecords,imageCount:allImages.length,visibleImageCount:visibleImages.length,truncated:visibleImages.length>limit},
    nonDOM:{status:'observed DOM surfaces only',surfaces:surfaceRecords,truncated:surfaces.length>limit,limits:['No context creation or renderer hook','WebGL/WebGPU/2D use unknown without corroboration','OffscreenCanvas, workers, closed shadow roots and cross-origin internals not inspected','API availability does not prove renderer use']},
    publicArtifacts:{status:'observed references; bodies/maps not inspected by this probe',references:sourceRecords,truncated:sourceNodes.length>limit,inlineScriptCount:document.querySelectorAll('script:not([src])').length,limits:['Query values and fragments omitted; exact public navigation recipe is in the plan','No map endpoint guessing or source execution']}
  };
}
