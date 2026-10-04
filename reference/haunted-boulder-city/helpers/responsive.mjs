import {connect} from './cdp.mjs';const c=await connect();const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{const out=[];
for(const w of [759,760,761,1099,1100,1101,1799,1800,1801]){
await c.call('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:false});await c.call('Emulation.setTouchEmulationEnabled',{enabled:false,maxTouchPoints:1});
await c.evaluate('scrollTo({top:0,behavior:"instant"})');await sleep(150);
const d=await c.evaluate("(()=>{const sels=['.hero','.haunted-word','.city-word','.stories-scroll','.stories-pin','.story-track','.story-controls','.tour-facts','.plan','.creator-credit'];return {queries:[759,760,761,1100,1800].map(w=>({w,max:matchMedia('(max-width: '+w+'px)').matches})),elements:sels.map(selector=>{const e=document.querySelector(selector),s=getComputedStyle(e);return {selector,rect:e.getBoundingClientRect().toJSON(),display:s.display,position:s.position,padding:s.padding,fontSize:s.fontSize,columns:s.gridTemplateColumns}}),scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}})()");
const env=await c.env();out.push({env,data:d});await c.shot('captures/E-040-boundary-'+w+'.jpg');
}c.save('observations/E-040-boundaries.json',out);
const variants=[];
for(const v of [{w:844,h:390,mobile:true,reduced:false},{w:1440,h:400,mobile:false,reduced:false},{w:1440,h:900,mobile:false,reduced:true},{w:390,h:844,mobile:true,reduced:true}]){
await c.call('Emulation.setDeviceMetricsOverride',{width:v.w,height:v.h,deviceScaleFactor:1,mobile:v.mobile});await c.call('Emulation.setTouchEmulationEnabled',{enabled:v.mobile,maxTouchPoints:1});await c.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:v.reduced?'reduce':'no-preference'}]});
await c.evaluate("scrollTo({top:0,behavior:'instant'})");await sleep(250);
const label=v.w+'x'+v.h+'-'+(v.reduced?'reduced':'normal');await c.shot('captures/E-041-'+label+'-top.jpg');
await c.evaluate("document.querySelector('#stories').scrollIntoView({behavior:'instant'})");await sleep(200);await c.shot('captures/E-041-'+label+'-stories.jpg');
variants.push({variant:v,environment:await c.env(),observations:await c.evaluate("({root:document.documentElement.className,trackDisplay:getComputedStyle(document.querySelector('.story-track')).display,pinPosition:getComputedStyle(document.querySelector('.stories-pin')).position,controls:getComputedStyle(document.querySelector('.story-controls')).display,animations:document.getAnimations().map(a=>({name:a.animationName,playState:a.playState,duration:a.effect.getComputedTiming().duration})),videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,currentTime:v.currentTime,readyState:v.readyState}))})")});
}c.save('observations/E-041-preferences-height.json',variants);console.log('boundaries and variants saved');
}finally{c.close()}