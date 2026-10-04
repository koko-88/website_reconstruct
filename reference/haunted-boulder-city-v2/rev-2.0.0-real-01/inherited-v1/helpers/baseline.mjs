import fs from 'node:fs';import {connect,root} from './cdp.mjs';
const c=await connect();const sleep=ms=>new Promise(r=>setTimeout(r,ms));const measure=fs.readFileSync(root+'/helpers/measure-function.js','utf8');let result=[];
try{
 c.save('observations/E-021-cdp-session.json',{timestamp:new Date().toISOString(),target:c.target,initial:await c.env(),method:'Isolated Chrome CDP helper; viewport emulation owner is CDP during probes'});
 for(const [w,h,mobile] of [[1440,900,false],[1024,768,false],[768,1024,false],[390,844,true]]){
 await c.call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile});
 await c.call('Emulation.setTouchEmulationEnabled',{enabled:mobile,maxTouchPoints:1});
 await c.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await c.evaluate("document.querySelector('.menu-toggle')?.getAttribute('aria-expanded')==='true'&&document.querySelector('.menu-toggle').click();document.querySelectorAll('details[open]').forEach(d=>d.open=false);scrollTo({top:0,behavior:'instant'})");
 await sleep(300);const prefix='E-030-'+w+'x'+h;
 c.save('observations/'+prefix+'-geometry.json',{environment:await c.env(),observations:await c.evaluate(measure)});
 await c.shot('captures/'+prefix+'-top.jpg');
 const log=[],height=await c.evaluate('document.documentElement.scrollHeight');
 for(let y=0;y<height;y+=Math.floor(h*.8)){
 await c.evaluate('scrollTo({top:'+y+',behavior:"instant"})');await sleep(150);
 log.push(await c.evaluate("({timestamp:new Date().toISOString(),scrollY,root:document.documentElement.className,headerRect:document.querySelector('.site-header').getBoundingClientRect().toJSON(),storyTrack:getComputedStyle(document.querySelector('.story-track')).transform,count:document.querySelector('.story-count').innerText,video:[...document.querySelectorAll('video')].map(v=>({currentTime:v.currentTime,readyState:v.readyState,duration:v.duration,src:v.currentSrc})),topics:[...document.querySelectorAll('.topic.is-current')].map(t=>t.dataset.topic)})"));
 }
 await c.evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})');await sleep(200);
 await c.shot('captures/'+prefix+'-footer.jpg');await c.shot('captures/'+prefix+'-full.jpg',true);
 for(const sel of ['#about','#stories','.tour-highlights','#zombies','#plan','#local','#tickets','#creator']){
 await c.evaluate('document.querySelector('+JSON.stringify(sel)+').scrollIntoView({behavior:"instant",block:"start"})');await sleep(200);
 if(w===1440||w===390)await c.shot('captures/'+prefix+'-'+sel.replace(/[.#]/g,'')+'.jpg');
 }
 for(let y=height;y>=0;y-=h){await c.evaluate('scrollTo({top:'+y+',behavior:"instant"})');await sleep(70)}
 c.save('observations/'+prefix+'-scroll.json',{environment:await c.env(),forward:log,reverseEnded:await c.evaluate('({scrollY,root:document.documentElement.className})'),images:await c.evaluate("[...document.images].map(i=>({src:i.currentSrc,complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight}))")});
 result.push({w,h,prefix,scrollHeight:height});console.log('captured '+w+'x'+h);
 }
 c.save('observations/E-022-capture-summary.json',result);
}finally{c.close()}
