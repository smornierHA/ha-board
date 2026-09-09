// No npm dependencies: use Chrome DevTools Protocol and Node's built-in WebSocket.
import {spawn,execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
const root=process.cwd(),out=path.resolve(process.env.WEATHER_BROWSER_OUTPUT||'artifacts/weather-browser');fs.mkdirSync(out,{recursive:true});
let chrome=process.env.CHROME_BIN;
if(!chrome){for(const name of ['google-chrome','chromium','chromium-browser'])try{chrome=execFileSync('which',[name],{encoding:'utf8'}).trim();break;}catch{}}
if(!chrome)throw Error('No Chrome/Chromium executable available; browser verification not performed.');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'weather-chrome-'));
const server=createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const p=path.resolve(root,'.'+pathname);if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',p.endsWith('.html')?'text/html; charset=utf-8':p.endsWith('.js')?'text/javascript; charset=utf-8':'text/plain');res.end(fs.readFileSync(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const processChrome=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe'],detached:process.platform!=='win32'});
let ws;
try{
 const endpoint=await new Promise((resolve,reject)=>{let buffer='';const timer=setTimeout(()=>reject(Error('Chrome startup timeout')),20000);processChrome.on('error',reject);processChrome.stderr.on('data',data=>{buffer+=data;const match=buffer.match(/DevTools listening on (ws:\/\/\S+)/);if(match){clearTimeout(timer);resolve(match[1]);}});});
 ws=new WebSocket(endpoint);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});let serial=0;const pending=new Map(),errors=[];
 ws.onmessage=event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
 const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});const call=(method,params)=>send(method,params,sessionId);await call('Runtime.enable');await call('Page.enable');
 const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
 const waitFor=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,50));}throw Error('Timeout: '+expression);};
 const proof=[];
 for(const source of ['candidate','bundle']){
  await call('Emulation.setDeviceMetricsOverride',{width:1000,height:780,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/examples/weather-demo.html?source=${source}`});await waitFor('window.demoReady === true');await waitFor('Boolean(window.demo.card.shadowRoot.querySelector(".combined-scroll"))');
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true);
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector("ha-card").getBoundingClientRect().width > 250'),true);
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector("ha-card").getBoundingClientRect().height > 180'),true);
  assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll(".time-cell").length >= 12'),true);
  assert.equal(await evaluate('demo.card.shadowRoot.textContent.includes("NaN")'),false);
  assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll(".risk-tile").length >= 2'),true);
  await evaluate('demo.card.shadowRoot.querySelector("[data-main-header-action]").click()');assert.equal(await evaluate('location.hash'),'#example-weather');
  await evaluate('demo.editor._form.querySelector("input").value="Édition fictive";demo.editor._form.querySelector("input").dispatchEvent(new Event("change"))');assert.equal(await evaluate('savedConfig.title'),'Édition fictive');assert.equal(await evaluate('savedConfig.unknown_option.keep'),true);assert.equal(await evaluate('savedConfig.risk_entities[0].tap_action.action'),'more-info');
  const before=await evaluate('demo.subscriptions');await evaluate('document.querySelector("#navigation").click()');await waitFor(`demo.subscriptions === ${before+1}`);assert.equal(await evaluate('demo.releases'),1);
  await evaluate('demo.card.setConfig({...demo.card.config,title:"Station exemple"})');
  for(const [mode,width,height] of [['desktop-dark',1000,780],['mobile-light',390,844]]){
   await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<500});await evaluate(`document.body.classList.toggle('light',${width<500})`);await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
   assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true);
   const {data}=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,source+'-'+mode+'.png'),Buffer.from(data,'base64'));
  }
  await evaluate('document.querySelector("#mode").click()');assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll(".risk-sub-button").length >= 2'),true);
  proof.push({source,render:true,editor:'mock ha-form round-trip',navigation:true,reconnection:true,viewports:['desktop-dark','mobile-light']});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({chrome:execFileSync(chrome,['--version'],{encoding:'utf8'}).trim(),checks:proof,errors,ha_acceptance:false},null,2)+'\n');console.log(JSON.stringify(proof));
}finally{
 try{ws?.send(JSON.stringify({id:2147483647,method:'Browser.close'}));}catch{}
 await new Promise(resolve=>{
  if(processChrome.exitCode!==null){resolve();return;}
  const forceTimer=setTimeout(()=>{try{if(process.platform!=='win32')process.kill(-processChrome.pid,'SIGKILL');else processChrome.kill('SIGKILL');}catch{}},4000);
  const giveUpTimer=setTimeout(resolve,6000);
  processChrome.once('exit',()=>{clearTimeout(forceTimer);clearTimeout(giveUpTimer);resolve();});
 });
 ws?.close();
 server.close();
 fs.rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:100});
}
