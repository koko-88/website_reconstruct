import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
export const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
export async function connect(port=Number(process.env.REFERENCE_CDP_PORT||9223)){
 const targets=await fetch('http://127.0.0.1:'+port+'/json/list').then(r=>r.json());
 const pages=targets.filter(t=>t.url.startsWith('https://www.hauntedbouldercity.com/'));
 if(!pages.length)throw Error('No authorized reference target');
 const t=pages[0],ws=new WebSocket(t.webSocketDebuggerUrl);let id=0;const pending=new Map();const listeners=new Set();
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method)for(const l of listeners)l(m);const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{pending.delete(n);reject(Error(method+' timed out'))},15000);pending.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params}))});
 const evaluate=async(expression)=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
 const save=(rel,data)=>{const f=path.resolve(root,rel);if(!f.startsWith(root+path.sep))throw Error('Outside evidence root');fs.writeFileSync(f,typeof data==='string'||Buffer.isBuffer(data)?data:JSON.stringify(data,null,2));return rel};
 const shot=async(rel,full=false)=>{const p={format:'jpeg',quality:85,captureBeyondViewport:full};if(full){const m=await call('Page.getLayoutMetrics');p.clip={x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1}}const r=await call('Page.captureScreenshot',p);save(rel,Buffer.from(r.data,'base64'))};
 const env=()=>evaluate(`({timestamp:new Date().toISOString(),url:location.href,ua:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,visualViewport:{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale},scroll:[scrollX,scrollY,document.documentElement.scrollWidth,document.documentElement.scrollHeight],language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,direction:getComputedStyle(document.documentElement).direction,touch:navigator.maxTouchPoints,dark:matchMedia('(prefers-color-scheme:dark)').matches,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,fonts:document.fonts.status,ready:document.readyState})`);
 return {call,evaluate,save,shot,env,onEvent:l=>listeners.add(l),target:{id:t.id,url:t.url},close:()=>ws.close()};
}