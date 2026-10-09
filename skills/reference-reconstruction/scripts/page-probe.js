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

  // Optional appearance policy is plain data, usable through any evaluate adapter.
  let appearance;
  if(options.appearance) {
    const policy=options.appearance;
    const properties=['display','visibility','opacity','transform','filter','clipPath','color','backgroundColor','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing'];
    const styleRecord=(node,pseudo)=>{const s=getComputedStyle(node,pseudo);return Object.fromEntries(properties.map(k=>[k,s[k]]));};
    const effectiveOpacity=node=>{let alpha=1;for(let el=node;el;el=el.parentElement){const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||s.visibility==='collapse')return 0;alpha*=Number(s.opacity);}return alpha;};
    const intersects=(a,b)=>a.width>0&&a.height>0&&a.x+a.width>b.x&&a.y+a.height>b.y&&a.x<b.x+b.width&&a.y<b.y+b.height;
    try {
      const viewport={x:0,y:0,width:innerWidth,height:innerHeight};
      const regionNodes=policy.scope==='region'?[...document.querySelectorAll(policy.selector)]:[];
      const regionRect=regionNodes.length===1?rect(regionNodes[0]):null;
      const inViewport=regionRect&&regionRect.x>=0&&regionRect.y>=0&&regionRect.x+regionRect.width<=innerWidth&&regionRect.y+regionRect.height<=innerHeight&&regionRect.width>0&&regionRect.height>0;
      const scopeRect=regionRect||viewport;
      const region=policy.scope==='region'?{count:regionNodes.length,rect:regionRect,inViewport:!!inViewport,clip:inViewport?{...regionRect}:null}:null;
      const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_ELEMENT);
      const nodes=[],frames=[];let scanned=0,truncated=false,node=walker.currentNode;
      while(node) {
        if(++scanned>10000) {truncated=true;break;}
        const r=rect(node),belongs=policy.scope!=='region'||regionNodes.some(root=>root===node||root.contains(node));
        const scopeAncestor=policy.scope==='region'&&regionNodes.some(root=>node!==root&&node.contains(root));
        if(scopeAncestor||(belongs&&(policy.scope==='full-page'||intersects(r,scopeRect)))) {
          if(nodes.length>=policy.maxNodes) {truncated=true;break;}
          const matchesAmbient=policy.ambient.filter(a=>node.matches(a.selector)||!!node.closest(a.selector));
          const ambientProperties=[...new Set(matchesAmbient.flatMap(a=>a.properties))];
          let animations=[];
          if(typeof node.getAnimations==='function') animations=node.getAnimations().map(animation=>{
            const timing=animation.effect?.getComputedTiming();
            const keyframes=animation.effect?.getKeyframes()||[];
            return {active:animation.playState!=='finished'&&animation.playState!=='idle',playState:animation.playState,pending:animation.pending,currentTime:typeof animation.currentTime==='number'?animation.currentTime:null,delay:timing?.delay,duration:timing?.duration,endTime:Number.isFinite(timing?.endTime)?timing.endTime:null,iterations:Number.isFinite(timing?.iterations)?timing.iterations:null,properties:[...new Set(keyframes.flatMap(f=>Object.keys(f).filter(k=>!['offset','computedOffset','easing','composite'].includes(k))))]};
          });
          const key=scanned+':'+node.tagName.toLowerCase();
          const layout=ambientProperties.includes('transform')?{x:node.offsetLeft,y:node.offsetTop,width:node.offsetWidth,height:node.offsetHeight}:Object.fromEntries(Object.entries(r).map(([k,v])=>[k,Math.round(v*2)/2]));
          nodes.push({key,tag:node.tagName.toLowerCase(),rect:r,layout,computed:styleRecord(node),effectiveOpacity:effectiveOpacity(node),pseudo:['::before','::after'].map(pseudo=>({pseudo,...styleRecord(node,pseudo),content:getComputedStyle(node,pseudo).content})),ambientProperties,animations,animationCapability:typeof node.getAnimations==='function'});
          if(node.tagName==='IFRAME') {
            const framePolicy=policy.frames.find(f=>node.matches(f.selector));
            let inspectability;try {inspectability=node.contentDocument?'same-origin document accessible, not sampled':'cross-origin or not loaded';}catch {inspectability='cross-origin inaccessible';}
            frames.push({key,mode:framePolicy?.mode||'content',selector:framePolicy?.selector||null,inspectability,reason:framePolicy?.reason||'No trustworthy content readiness signal supplied'});
          }
        }
        node=walker.nextNode();
      }
      const assertions=policy.assertions.map(assertion=>{
        const matches=[...document.querySelectorAll(assertion.selector)],failures=[],observed=[];
        if(matches.length<assertion.minCount||matches.length>assertion.maxCount) failures.push('count');
        if(matches.length>policy.maxNodes) failures.push('assertion-node-budget');
        for(const el of matches.slice(0,policy.maxNodes)) {
          const computed=styleRecord(el),opacity=effectiveOpacity(el),isVisible=visible(el)&&opacity>0;
          const attributes=Object.fromEntries(Object.keys(assertion.attributes||{}).map(k=>[k,el.getAttribute(k)]));
          observed.push({computed,attributes,effectiveOpacity:opacity,visible:isVisible});
          if(assertion.visible!==undefined&&assertion.visible!==isVisible) failures.push('visible');
          if(assertion.minOpacity!==undefined&&opacity<assertion.minOpacity) failures.push('opacity');
          for(const [k,v] of Object.entries(assertion.styles||{})) if(computed[k]!==v) failures.push('style:'+k);
          for(const [k,v] of Object.entries(assertion.attributes||{})) if(attributes[k]!==v) failures.push('attribute:'+k);
        }
        return {selector:assertion.selector,count:matches.length,pass:!failures.length,failures:[...new Set(failures)],observed};
      });
      appearance={scope:policy.scope,region,nodes,frames,assertions,scanned,scanBudget:10000,truncated,limits:['Light DOM and generated before/after styles only; shadow trees, raster producers and frame internals require an independent signal.']};
    } catch(error) {appearance={scope:policy.scope,error:error.message,nodes:[],frames:[],assertions:[],truncated:false};}
  }

  const root=document.documentElement;
  return {
    schemaVersion:2,appearance,timestampUTC:new Date().toISOString(),performanceMs:performance.now(),timeOrigin:performance.timeOrigin,
    environment:{url:cleanURL(location.href),userAgent:navigator.userAgent,platform:navigator.platform,cssViewport:{width:innerWidth,height:innerHeight},clientWidth:root.clientWidth,scrollbarWidth:innerWidth-root.clientWidth,dpr:devicePixelRatio,visualViewport:visualViewport?{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale}:null,zoom:'unknown; visual scale is not browser zoom',language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,direction:getComputedStyle(root).direction,dark:matchMedia('(prefers-color-scheme:dark)').matches,reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,coarsePointer:matchMedia('(pointer:coarse)').matches,maxTouchPoints:navigator.maxTouchPoints,scroll:{x:scrollX,y:scrollY,width:root.scrollWidth,height:root.scrollHeight}},
    readiness:{documentState:document.readyState,fonts:document.fonts?document.fonts.status:'unsupported',required:selection(options.required),absent:selection(options.absent),geometry:selection(options.stableSelectors),images:imageRecords,imageCount:allImages.length,visibleImageCount:visibleImages.length,truncated:visibleImages.length>limit},
    nonDOM:{status:'observed DOM surfaces only',surfaces:surfaceRecords,truncated:surfaces.length>limit,limits:['No context creation or renderer hook','WebGL/WebGPU/2D use unknown without corroboration','OffscreenCanvas, workers, closed shadow roots and cross-origin internals not inspected','API availability does not prove renderer use']},
    publicArtifacts:{status:'observed references; bodies/maps not inspected by this probe',references:sourceRecords,truncated:sourceNodes.length>limit,inlineScriptCount:document.querySelectorAll('script:not([src])').length,limits:['Query values and fragments omitted; exact public navigation recipe is in the plan','No map endpoint guessing or source execution']}
  };
}
