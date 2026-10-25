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
 ws.onmessage=event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(!p)return;if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
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
  const atmosphere=[];
  for(const [condition,night] of [['rainy',false],['pouring',true],['cloudy',false],['clear-night',true],['snowy',false],['fog',false],['sunny',false]]){
   await evaluate(`(()=>{const h=demo.card._hass;demo.card.hass={...h,states:{...h.states,'weather.example':{...h.states['weather.example'],state:${JSON.stringify(condition)}},'sun.sun':{...h.states['sun.sun'],state:${JSON.stringify(night?'below_horizon':'above_horizon')}}}}})()`);
   await waitFor('Boolean(demo.card.shadowRoot.querySelector("canvas.weather-atmosphere"))');
   assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll("canvas.weather-atmosphere").length'),1);
   assert.equal(await evaluate('getComputedStyle(demo.card.shadowRoot.querySelector("canvas")).pointerEvents'),'none');
   assert.equal(await evaluate('demo.card._atmosphere.options.night'),night);
   assert.equal(await evaluate('demo.card._atmosphere._particles.length <= 160'),true);
   if(condition==='rainy'){
    await waitFor('demo.card._atmosphere._impacts.length > 0');
    const first=await evaluate('demo.card.shadowRoot.querySelector("canvas").toDataURL()');
    await evaluate('new Promise(r=>setTimeout(r,100))');
    assert.notEqual(await evaluate('demo.card.shadowRoot.querySelector("canvas").toDataURL()'),first);
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await waitFor('demo.card._atmosphere._frame === null');
    const still=await evaluate('demo.card.shadowRoot.querySelector("canvas").toDataURL()');
    await evaluate('new Promise(r=>setTimeout(r,100))');
    assert.equal(await evaluate('demo.card.shadowRoot.querySelector("canvas").toDataURL()'),still);
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await waitFor('demo.card._atmosphere._frame !== null');
   }
   atmosphere.push({condition,night,particles:await evaluate('demo.card._atmosphere._particles.length')});
  }
  await evaluate('window.oldAtmosphere=demo.card._atmosphere;demo.card.remove()');
  assert.equal(await evaluate('oldAtmosphere._frame'),null);
  assert.equal(await evaluate('oldAtmosphere.host'),null);
  await evaluate('document.querySelector("#cards").append(demo.card)');
  await waitFor('demo.card._atmosphere && demo.card._atmosphere !== oldAtmosphere');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll("canvas.weather-atmosphere").length'),1);
  await evaluate('window.spacer=document.createElement("div");spacer.style.height="3000px";document.body.prepend(spacer);window.scrollTo(0,0)');
  await waitFor('demo.card._atmosphere._frame === null');
  await evaluate('demo.card.scrollIntoView()');
  await waitFor('demo.card._atmosphere._frame !== null');
  await evaluate('spacer.remove();window.scrollTo(0,0)');
  // Updating HA without replacing foreground DOM keeps the renderer and its phase.
  const beforeScene=await evaluate('demo.card._atmosphere._time');
  assert.equal(await evaluate('(()=>{const a=demo.card._atmosphere;demo.card.hass={...demo.card._hass};return a===demo.card._atmosphere})()'),true);
  assert.equal(await evaluate(`demo.card._atmosphere._time >= ${beforeScene}`),true);
  await evaluate('window.twin=document.createElement("weather-combined-forecast-card");twin.setConfig({...demo.card.config});twin.hass=demo.card._hass;document.querySelector("#cards").append(twin)');
  await waitFor('Boolean(twin._atmosphere?.host)');
  assert.equal(await evaluate('twin._atmosphere !== demo.card._atmosphere && twin._atmosphere.canvas !== demo.card._atmosphere.canvas'),true);
  await evaluate('twin.remove()');
  assert.equal(await evaluate('twin._atmosphere'),null);
  assert.equal(await evaluate('Boolean(demo.card._atmosphere.host?.isConnected)'),true);
  // Real trusted touch input, rather than synthetic DOM events: a horizontal
  // forecast must not trap the vertical page gesture, in either direction.
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  await evaluate(`(()=>{demo.card.setConfig({...demo.card.config,risk_display_mode:'footer'});const top=document.createElement('div');top.id='gesture-top';top.style.height='650px';document.body.prepend(top);const bottom=document.createElement('div');bottom.id='gesture-bottom';bottom.style.height='1800px';document.body.append(bottom);document.documentElement.style.scrollBehavior='auto';})()`);
  const resetViewport=async()=>{await evaluate('window.scrollTo(0,document.querySelector("#gesture-top").getBoundingClientRect().height+100)');await evaluate('new Promise(r=>setTimeout(r,120))');};
  const rect=selector=>evaluate(`(()=>{const r=demo.card.shadowRoot.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.left+Math.min(r.width*.5,180),y:r.top+r.height*.5}})()`);
  const swipe=async(point,dx,dy)=>{
   await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:point.x,y:point.y}]});
   for(let n=1;n<=10;n++){await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:point.x+dx*n/10,y:point.y+dy*n/10}]});await new Promise(r=>setTimeout(r,25));}
   await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await new Promise(r=>setTimeout(r,350));
  };
  const gestures=[];
  for(const selector of ['.combined-scroll','.risk-pills-slider']){
   for(const dy of [-100,100]){await resetViewport();const point=await rect(selector);const before=await evaluate('window.scrollY');await swipe(point,0,dy);const after=await evaluate('window.scrollY');assert.ok((before-after)*dy>30,`${source} ${selector} vertical ${dy} trapped: ${before} -> ${after}`);gestures.push({selector,dy,vertical_page_scroll:true});}
  }
  await resetViewport();await evaluate('demo.card.shadowRoot.querySelector(".combined-scroll").scrollLeft=0');const p=await rect('.combined-scroll'),beforeY=await evaluate('window.scrollY');await swipe(p,-130,0);assert.ok(await evaluate('demo.card.shadowRoot.querySelector(".combined-scroll").scrollLeft > 50'),'native horizontal forecast swipe');assert.ok(Math.abs((await evaluate('window.scrollY'))-beforeY)<4,'horizontal swipe must leave page still');
  // Wheel is a desktop input; leave mobile touch emulation before this assertion.
  await call('Emulation.setTouchEmulationEnabled',{enabled:false});
  await call('Emulation.setDeviceMetricsOverride',{width:1000,height:780,deviceScaleFactor:1,mobile:false});
  await resetViewport();await evaluate('demo.card.shadowRoot.querySelector(".combined-scroll").scrollLeft=0');const wp=await rect('.combined-scroll'),wy=await evaluate('window.scrollY');await call('Input.synthesizeScrollGesture',{x:wp.x,y:wp.y,yDistance:-120,gestureSourceType:'mouse',speed:500,preventFling:true});await new Promise(r=>setTimeout(r,300));assert.ok((await evaluate('window.scrollY'))>wy+40,'vertical wheel must scroll page: '+JSON.stringify({source,point:wp,before:wy,after:await evaluate('window.scrollY'),height:await evaluate('innerHeight')}));assert.equal(await evaluate('demo.card.shadowRoot.querySelector(".combined-scroll").scrollLeft'),0,'vertical wheel must not move forecast');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  await evaluate('demo.card.setConfig({...demo.card.config,risk_display_mode:"header_sub_buttons"})');await resetViewport();const hp=await rect('.header-risk-subbuttons'),hy=await evaluate('window.scrollY');await swipe(hp,0,100);assert.ok((await evaluate('window.scrollY'))<hy-30,'header risk buttons must allow vertical page scroll');
  await resetViewport();const cp=await rect('.combined-scroll');await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:cp.x,y:cp.y}]});await call('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await waitFor('demo.card._isInteracting === false');
  // Accepted iOS presentation uses the same normalized sources and actions.
  await evaluate(`(()=>{const c=demo.card,h=c._hass;c.hass={...h,themes:{darkMode:true},states:{...h.states,
    'sensor.example_leak':{state:'off',attributes:{is_active:false}},
    'sensor.example_rain':{state:'faible',attributes:{}},
    'sensor.example_shutters':{state:'ok',attributes:{}}}};
    c.setConfig({...c.config,layout:'ios',risk_display_mode:'footer',risk_entities:[...c.config.risk_entities,
    {entity:'sensor.example_leak',label:'Inondation',active_attribute:'is_active',level_when_active:'critique'},
    {entity:'sensor.example_rain',label:'Pluie',level_source:'state'},
    {entity:'sensor.example_shutters',label:'Volets',level_source:'state'}]});})()`);
  await waitFor('Boolean(demo.card.shadowRoot.querySelector(".wr-hour"))');
  const iosHeight=await evaluate('demo.card.shadowRoot.querySelector("ha-card").getBoundingClientRect().height');
  const slots=await evaluate('demo.card._enrichEntries(demo.card._forecastEntries()).length');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll(".wr-hour").length'),slots);
  for(const mode of ['weather','rain','wind']){
   await evaluate(`demo.card.shadowRoot.querySelector('[data-mode="${mode}"]').click()`);
   assert.equal(await evaluate('demo.card.shadowRoot.querySelector("ha-card").getBoundingClientRect().height'),iosHeight);
   await evaluate('demo.card.shadowRoot.querySelector(".wr-hour").click()');
   assert.equal(await evaluate('demo.card.shadowRoot.querySelector("dialog").open'),true);
   assert.equal(await evaluate('Boolean(demo.card.shadowRoot.querySelector(".wr-graph"))'),true);
   await evaluate('demo.card.shadowRoot.querySelector("dialog").close()');
  }
  assert.ok(await evaluate('demo.card.shadowRoot.querySelectorAll(".wr-wind-plot [data-series]").length')>1);
  await evaluate('demo.card.shadowRoot.querySelector(".wr-alert-row").click()');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll("[data-risk-id]").length'),3);
  await evaluate('demo.card.shadowRoot.querySelector("[data-all-risks=true]").click()');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll("[data-risk-id]").length'),6);
  await evaluate(`(()=>{const c=demo.card,h=c._hass;c.hass={...h,states:{...h.states,'sensor.example_alert':{state:'vert',attributes:{}},'sensor.example_risk':{state:'ok',attributes:{}}}};})()`);
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector(".wr-alert-count").textContent'),'0');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector("dialog").open'),true);
  await evaluate('demo.card.shadowRoot.querySelector("dialog").close();demo.card.shadowRoot.querySelector(".wr-alert-row").click()');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelectorAll("[data-risk-id]").length'),0);
  await evaluate(`(()=>{const c=demo.card,h=c._hass;c.hass={...h,states:{...h.states,'sensor.example_leak':{state:'on',attributes:{is_active:true}}}};})()`);
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector(".wr-alert-row").dataset.level'),'critical');
  await evaluate(`(()=>{const c=demo.card,h=c._hass;c.hass={...h,states:{...h.states,'sensor.example_leak':{state:'unavailable',attributes:{is_active:true}}}};})()`);
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector(".wr-alert-count").textContent'),'0');
  await evaluate('demo.card.shadowRoot.querySelector("dialog").close();demo.card.shadowRoot.querySelector(".wr-hero").click()');assert.equal(await evaluate('location.hash'),'#example-weather');
  await evaluate('demo.card.shadowRoot.querySelector(".wr-rail").scrollLeft=130;demo.card.shadowRoot.querySelector("[data-mode=rain]").click()');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector(".wr-rail").scrollLeft'),130);
  for(const selector of ['.wr-rail','.wr-alert-row'])for(const dy of [-100,100]){
   await resetViewport();const before=await evaluate('scrollY');await swipe(await rect(selector),0,dy);assert.ok((before-(await evaluate('scrollY')))*dy>30,`${source} iOS ${selector} gesture trapped`);
  }
  await evaluate('demo.card.remove();document.querySelector("#cards").append(demo.card);demo.card.shadowRoot.querySelector("[data-mode=weather]").click()');
  assert.equal(await evaluate('demo.card.shadowRoot.querySelector(".wr-panel").dataset.view'),'weather');
  const iosViewports=[];
  for(const width of [320,390,736])for(const dark of [true,false]){
   await call('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
   await evaluate(`demo.card.hass={...demo.card._hass,themes:{darkMode:${dark}}};document.body.classList.toggle('light',${!dark});window.scrollTo(0,document.querySelector('#gesture-top').getBoundingClientRect().height+100)`);
   await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
   assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
   const {data}=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,`${source}-ios-${width}-${dark?'dark':'light'}.png`),Buffer.from(data,'base64'));iosViewports.push({width,dark});
  }
  await evaluate('demo.card.setConfig({...demo.card.config,layout:"classic"})');assert.equal(await evaluate('demo.card.shadowRoot.querySelector(".wr-weather")'),null);
  proof.push({source,ios:{views:3,slots,stable_height:true,active_risks:true,all_states:true,live_updates:true,unavailable_not_problem:true,header_action:true,native_vertical_rail_and_footer:true,reconnection:true,classic_fallback:true,viewports:iosViewports}});
  await evaluate('document.querySelector("#gesture-top").remove();document.querySelector("#gesture-bottom").remove();window.scrollTo(0,0)');
  await call('Emulation.setTouchEmulationEnabled',{enabled:false});
  proof.push({source,render:true,editor:'mock ha-form round-trip',navigation:true,reconnection:true,viewports:['desktop-dark','mobile-light'],atmosphere,reduced_motion:true,offscreen_pause:true,canvas_cleanup:true,separate_instances:true,gestures,native_horizontal_swipe:true,vertical_wheel:true,header_risk_vertical_swipe:true,touch_cancel_recovers:true});
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
