import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import referenceProbe from '../../../skills/reference-reconstruction/scripts/page-probe.js';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {capture,waitReady} from '../../../skills/reference-reconstruction/scripts/capture.mjs';
import {appearancePolicy,appearanceReasons,appearanceSignature} from '../../../skills/reference-reconstruction/scripts/settled-appearance.mjs';

const out=path.dirname(fileURLToPath(import.meta.url));
const skill=path.resolve(out,'../../../skills/reference-reconstruction');
const cp={id:'MENU',phase:'settled',required:['main'],absent:[],stableSelectors:['main'],timeoutMs:1000,fullPage:false,appearance:{scope:'region',selector:'main',assertions:[{selector:'#toggle',attributes:{'aria-expanded':'true'}}]}};
let alpha=.1;
const box={x:0,y:0,width:200,height:100,top:0,left:0,right:200,bottom:100};
function element(tag,parent=null,id='') {
  const el={tagName:tag.toUpperCase(),parentElement:parent,id,hidden:false,textContent:'Fixture',offsetLeft:0,offsetTop:0,offsetWidth:200,offsetHeight:100,getBoundingClientRect:()=>({...box}),getAttribute:name=>name==='aria-expanded'&&id==='toggle'?'true':null,hasAttribute:()=>false,matches:()=>false,closest:()=>null,getAnimations:()=>[],contains(other){for(let n=other;n;n=n.parentElement)if(n===this)return true;return false;}};
  return el;
}
const root=element('html'),wrapper=element('section',root),menu=element('main',wrapper),child=element('div',menu),toggle=element('button',root,'toggle');
root.clientWidth=640;root.scrollWidth=640;root.scrollHeight=480;
wrapper.getAnimations=()=>[{playState:'running',pending:false,effect:{getComputedTiming:()=>({iterations:1}),getKeyframes:()=>[{opacity:0},{opacity:1}]}}];
const all=[root,wrapper,menu,child,toggle];
const styleDefaults={display:'block',visibility:'visible',opacity:'1',transform:'none',filter:'none',clipPath:'none',color:'rgb(0, 0, 0)',backgroundColor:'rgba(0, 0, 0, 0)',fontFamily:'sans-serif',fontSize:'16px',fontWeight:'400',lineHeight:'normal',letterSpacing:'normal',content:'none',direction:'ltr'};
const document={documentElement:root,readyState:'complete',fonts:{status:'loaded'},images:[],activeElement:null,querySelectorAll(selector){return selector==='main'?[menu]:selector==='#toggle'?[toggle]:[];},createTreeWalker(){let index=0;return {currentNode:root,nextNode:()=>all[++index]||null};}};
const context={document,NodeFilter:{SHOW_ELEMENT:1},location:{href:'http://fixture.example/'},innerWidth:640,innerHeight:480,scrollX:0,scrollY:0,devicePixelRatio:1,visualViewport:null,navigator:{userAgent:'Synthetic',platform:'Synthetic',language:'en-US',maxTouchPoints:0},matchMedia:()=>({matches:false}),performance:{now:()=>0,timeOrigin:0},getComputedStyle:(el,pseudo)=>({...styleDefaults,opacity:el===wrapper&&!pseudo?String(alpha):'1'}),URL,Intl,Date,setTimeout,clearTimeout};
// Evaluate only the statically imported self-contained probe in this synthetic DOM.
const probe=vm.runInNewContext('('+referenceProbe.toString()+'\n)',context);
alpha=1;
const finiteParent=await waitReady({evaluate:async(_fn,options)=>probe(options)},cp);
const result={method:'Data-only scheduled finite ancestor animation; stable present opacity and region geometry',status:finiteParent.status,state:finiteParent.appearance.state,convergencePass:finiteParent.appearance.convergence.pass,reasons:finiteParent.reasons,ancestorIncluded:finiteParent.snapshot.appearance.nodes.some(n=>n.tag==='section'),record:finiteParent};
fs.writeFileSync(path.join(out,'finite-ancestor-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,state:result.state,convergencePass:result.convergencePass,reasons:result.reasons,ancestorIncluded:result.ancestorIncluded},null,2));
