from pathlib import Path
p=Path('skills/reference-reconstruction/scripts/page-probe.js')
s=p.read_text(encoding='utf-8-sig')
marker='  const root=document.documentElement;'
addition=r'''
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
      const region=policy.scope==='region'?{count:regionNodes.length,rect:regionRect,inViewport:!!inViewport,clip:inViewport?{...regionRect,x:regionRect.x+scrollX,y:regionRect.y+scrollY}:null}:null;
      const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_ELEMENT);
      const nodes=[],frames=[];let scanned=0,truncated=false,node=walker.currentNode;
      while(node) {
        if(++scanned>10000) {truncated=true;break;}
        const r=rect(node),belongs=policy.scope!=='region'||regionNodes.some(root=>root===node||root.contains(node));
        if(belongs&&(policy.scope==='full-page'||intersects(r,scopeRect))) {
          if(nodes.length>=policy.maxNodes) {truncated=true;break;}
          const matchesAmbient=policy.ambient.filter(a=>node.matches(a.selector)||!!node.closest(a.selector));
          const ambientProperties=[...new Set(matchesAmbient.flatMap(a=>a.properties))];
          let animations=[];
          if(typeof node.getAnimations==='function') animations=node.getAnimations().map(animation=>{
            const timing=animation.effect?.getComputedTiming();
            const keyframes=animation.effect?.getKeyframes()||[];
            return {active:animation.playState!=='finished'&&animation.playState!=='idle',playState:animation.playState,pending:animation.pending,iterations:Number.isFinite(timing?.iterations)?timing.iterations:null,properties:[...new Set(keyframes.flatMap(f=>Object.keys(f).filter(k=>!['offset','computedOffset','easing','composite'].includes(k))))]};
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
      appearance={scope:policy.scope,region,nodes,frames,assertions,scanned,truncated,limits:['Light DOM and generated before/after styles only; shadow trees, raster producers and frame internals require an independent signal.']};
    } catch(error) {appearance={scope:policy.scope,error:error.message,nodes:[],frames:[],assertions:[],truncated:false};}
  }
'''
s=s.replace(marker,addition+'\n'+marker)
s=s.replace('schemaVersion:2,timestampUTC:', 'schemaVersion:2,appearance,timestampUTC:')
p.write_text(s,encoding='utf-8')
p=Path('skills/reference-reconstruction/scripts/capture.mjs');s=p.read_text(encoding='utf-8-sig')
s=s.replace("import {seal,sha256} from './package.mjs';", "import {seal,sha256} from './package.mjs';\nimport {appearancePolicy,probeOptions,waitAppearance,postAppearanceReasons} from './settled-appearance.mjs';")
s=s.replace("'fullPage','actions'],'checkpoint'", "'fullPage','actions','appearance'],'checkpoint'")
s=s.replace('      cp.actions??=[]; actions(cp.actions);','      appearancePolicy(cp);\n      cp.actions??=[]; actions(cp.actions);')
start=s.index('  const started=Date.now(),deadline=started+cp.timeoutMs;',s.index('export async function waitReady'))
end=s.index('\n}\nasync function perform',start)
s=s[:start]+'  return waitAppearance(page,cp,probe,readyReasons,geometrySignature);'+s[end:]
s=s.replace("probeSHA256:sha256(probeSource)","probeSHA256:sha256(probeSource),appearancePolicySHA256:sha256(fs.readFileSync(path.join(here,'settled-appearance.mjs')))")
s=s.replace("{required:cp.required,absent:cp.absent,stableSelectors:cp.stableSelectors,limit:200}","probeOptions(cp)")
s=s.replace("reasons:[],elapsedMs:Date.now()-navigationStarted};", "reasons:[],appearance:{state:'transient',why:'Requested temporal checkpoint; no convergence claim',policy:appearancePolicy(cp),limits:['No settled appearance claim']},elapsedMs:Date.now()-navigationStarted};")
s=s.replace("{required:cp.required,absent:cp.absent,stableSelectors:cp.stableSelectors,decodeMs:500,limit:200}","{...probeOptions(cp),decodeMs:500}")
needle="            if(cp.phase==='settled'&&record.captureChanged)"
s=s.replace(needle,"            const appearanceChanged=cp.phase==='settled'?postAppearanceReasons(before,record.after,cp):[];\n            if(appearanceChanged.length) {record.phase='unsettled';record.readiness.reasons.push(...appearanceChanged.map(r=>'post-capture:'+r));}\n"+needle)
needle="          if(cp.phase==='settled'&&record.phase!=='settled') errors.push"
s=s.replace(needle,"          if(cp.phase==='settled'&&record.phase!=='settled') { record.readiness.appearance.state='unresolved';record.readiness.appearance.convergence.pass=false;record.readiness.appearance.why='Readiness or capture verification unresolved'; }\n"+needle)
p.write_text(s,encoding='utf-8')
