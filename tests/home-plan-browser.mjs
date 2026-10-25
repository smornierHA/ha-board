import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=path.resolve(import.meta.dirname,'..'),out=process.env.HOME_PLAN_QA_OUTPUT||path.join(root,'artifacts/home-plan');fs.mkdirSync(out,{recursive:true});
const privateDir=process.env.HOME_PLAN_PRIVATE_DIR;
const fixture={bounds:[0,0,900,680],floor:'Niveau de démonstration',artwork:'<path class="wall" d="M70 80H830V580H70Z M450 80V580"/>',rooms:[{id:'west',name:'Pièce ouest',short:'Ouest',icon:'sofa',x:70,y:80,w:380,h:500,path:'M70 80H450V580H70Z',label:[260,300]},{id:'east',name:'Pièce est',short:'Est',icon:'bed-double',x:450,y:80,w:380,h:500,path:'M450 80H830V580H450Z',label:[640,300]}],apertures:[{id:'window',room:'west',name:'Fenêtre ouest',segment:[70,200,70,320],control:[90,260]},{id:'motor',room:'east',name:'Porte motorisée',segment:[600,580,720,580],control:[650,610]}],markers:[{id:'smoke',room:'east',point:[650,420],icon:'smoke'}]};
const config={type:'custom:home-plan-card',name:'Plan de démonstration',model:fixture,rooms:[{id:'west',name:'Pièce ouest',area_id:'west_area',auto_area:true,entities:['light.example','cover.example','binary_sensor.example_window','sensor.example_temperature'],temperature_entity:'sensor.example_temperature'},{id:'east',name:'Pièce est',area_id:'east_area',auto_area:true,entities:['binary_sensor.example_smoke','switch.example_motor']}],apertures:[{id:'window',room:'west',cover_entity:'cover.example',opening_entity:'binary_sensor.example_window'},{id:'motor',room:'east',command_entity:'switch.example_motor'}],markers:[{id:'smoke',room:'east',entity:'binary_sensor.example_smoke'}]};
const states={
 'light.example':{state:'off',attributes:{friendly_name:'Lampe de démonstration'}},
 'cover.example':{state:'closed',attributes:{friendly_name:'Volet de démonstration',current_position:0,supported_features:15,device_class:'shutter'}},
 'binary_sensor.example_window':{state:'on',attributes:{friendly_name:'Fenêtre de démonstration',device_class:'window'}},
 'sensor.example_temperature':{state:'21.3',attributes:{friendly_name:'Température de démonstration',device_class:'temperature',unit_of_measurement:'°C'}},
 'binary_sensor.example_smoke':{state:'off',attributes:{friendly_name:'Fumée de démonstration',device_class:'smoke'}},
 'switch.example_motor':{state:'unknown',attributes:{friendly_name:'Commande de démonstration'}},
 'sensor.example_inherited':{state:'65',attributes:{friendly_name:'Pile héritée',device_class:'battery',unit_of_measurement:'%'}}
};
Object.entries(states).forEach(([id,s])=>s.entity_id=id);
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/bundle.js'){res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(root,'dist/home-plan-card.js')));return;}
 if(privateDir&&url.pathname.startsWith('/local/maison/plans/family-v1/')){const name=path.basename(url.pathname),file=path.join(privateDir,name);if(fs.existsSync(file)){res.setHeader('Content-Type',name.endsWith('.json')?'application/json':'image/svg+xml');res.end(fs.readFileSync(file));return;}}
 if(url.pathname==='/local/broken.json'){res.statusCode=404;res.end();return;}
 res.setHeader('Content-Type','text/html');res.end('<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:12px;color-scheme:light dark;--card-background-color:#fbfbfc;--primary-text-color:#20242b;--secondary-text-color:#626b76}body.dark{--card-background-color:#1d2026;--primary-text-color:#f4f5f8;--secondary-text-color:#aab2bf}ha-card{display:block}</style><script type="module" src="/bundle.js"></script><main></main>');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;const errors=[],proof=[];
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/workspace/scratch/ae631a9abbec/mockup-render-deps/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote','--single-process']});
 const page=await browser.newPage({viewport:{width:390,height:900},hasTouch:true,isMobile:true});await page.emulateMedia({reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>customElements.get('home-plan-card'));
 await page.evaluate(({config,states})=>{
  if(!customElements.get('ha-form'))customElements.define('ha-form',class extends HTMLElement{});window.calls=[];window.events={};window.unsubscribed=0;window.rejectService=false;window.registryRefreshes=0;
  const entities=Object.keys(states).map(entity_id=>({entity_id,area_id:entity_id==='sensor.example_inherited'?null:entity_id.includes('smoke')||entity_id.includes('motor')?'east_area':'west_area',device_id:entity_id==='sensor.example_inherited'?'example_device':undefined}));
  window.registry={entities,devices:[{id:'example_device',area_id:'west_area'}],areas:[{area_id:'west_area',name:'Pièce ouest'},{area_id:'east_area',name:'Pièce est'}]};
  window.hass={states,themes:{darkMode:false},callService:async(...args)=>{calls.push(args);if(rejectService)throw Error('service indisponible');},callWS:async msg=>{registryRefreshes++;return registry[msg.type.includes('entity')?'entities':msg.type.includes('device')?'devices':'areas'];},connection:{subscribeEvents:async(fn,type)=>{events[type]=fn;return ()=>{delete events[type];unsubscribed++;};}},formatEntityState:s=>s.state+(s.attributes.unit_of_measurement?' '+s.attributes.unit_of_measurement:'')};
  const card=document.createElement('home-plan-card');window.card=card;card.setConfig(config);card.hass=hass;document.querySelector('main').append(card);
 },{config,states});
 await page.waitForFunction(()=>card.shadowRoot.querySelector('.hpf-map')&&card._registryLoaded);
 const card=page.locator('home-plan-card'),s=card.locator('.hpf-home');
 for(const width of [320,390,736])for(const dark of [false,true]){
  await page.setViewportSize({width,height:1000});await page.evaluate(dark=>{document.body.classList.toggle('dark',dark);hass={...hass,themes:{darkMode:dark}};card.hass=hass;},dark);await page.evaluate(()=>card.updateComplete);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await s.screenshot({path:path.join(out,`fictional-${width}-${dark?'dark':'light'}.png`)});proof.push({width,dark,no_overflow:true});
 }
 await page.setViewportSize({width:390,height:900});
 await s.locator('[data-aperture=window]').click();assert.equal(await s.locator('.hpf-cover output').innerText(),'Fermé');
 await s.getByRole('button',{name:'Ouvrir',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','open_cover',{}, {entity_id:'cover.example'}]);
 assert.equal(await s.locator('.hpf-cover output').innerText(),'Fermé','no optimistic state');
 assert.equal(await s.locator('.hpf-opening strong').innerText(),'Ouverte','contact independent');
 await page.evaluate(()=>{hass={...hass,states:{...hass.states,'cover.example':{...hass.states['cover.example'],state:'open',attributes:{...hass.states['cover.example'].attributes,current_position:68}}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);
 assert.equal(await s.locator('.hpf-cover output').innerText(),'68 % ouvert');
 const input=s.locator('input[type=range]');await input.fill('43');await input.dispatchEvent('change');assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','set_cover_position',{position:43},{entity_id:'cover.example'}]);
 await s.getByRole('button',{name:'Arrêter',exact:true}).click();assert.equal(await page.evaluate(()=>calls.at(-1)[1]),'stop_cover');
 const identity=await page.evaluate(()=>{window.savedInput=card.shadowRoot.querySelector('input');hass={...hass,states:{...hass.states,'sensor.unrelated':{state:'3',attributes:{}}}};card.hass=hass;return true;});await page.evaluate(()=>card.updateComplete);assert.ok(identity&&await page.evaluate(()=>savedInput===card.shadowRoot.querySelector('input')));
 await page.evaluate(()=>{const old=hass.states['cover.example'];hass={...hass,states:{...hass.states,'cover.example':{...old,state:'unknown',attributes:{...old.attributes,current_position:undefined}}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);assert.equal(await input.isDisabled(),true);assert.equal(await s.locator('.hpf-cover output').innerText(),'Position inconnue');
 await page.evaluate(()=>{const old=hass.states['cover.example'];hass={...hass,states:{...hass.states,'cover.example':{...old,state:'unavailable'}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);assert.ok(await s.getByRole('button',{name:'Ouvrir',exact:true}).isDisabled());
 await s.locator('[data-close]').click();await s.locator('[data-aperture=motor]').click();await s.locator('[data-command]').click();assert.equal(await s.locator('[data-command]').isDisabled(),true);assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['switch','turn_on',{}, {entity_id:'switch.example_motor'}]);assert.match(await s.innerText(),/État physique non suivi/);
 await s.locator('[data-close]').click();await page.evaluate(()=>{hass={...hass,states:{...hass.states,'binary_sensor.example_smoke':{...hass.states['binary_sensor.example_smoke'],state:'on'}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);assert.equal(await s.locator('.hpf-room-marker.is-alert').count(),1);assert.match(await s.locator('.hpf-footer-copy').innerText(),/1 alerte/);
 assert.ok(await page.evaluate(()=>card._entities(card._rooms()[0]).includes('sensor.example_inherited')),'device area inherited');
 await page.evaluate(()=>{registry.entities.push({entity_id:'sensor.example_added',area_id:'west_area'});hass.states['sensor.example_added']={state:'40',attributes:{device_class:'humidity'}};events.entity_registry_updated();});await page.waitForFunction(()=>card._registry.entities['sensor.example_added']);assert.ok(await page.evaluate(()=>card._entities(card._rooms()[0]).includes('sensor.example_added')));
 const lifecycle=await page.evaluate(async()=>{card.remove();const detached={listeners:Object.keys(events).length,busy:card._busy.size};document.querySelector('main').append(card);await card.updateComplete;return detached;});assert.deepEqual(lifecycle,{listeners:0,busy:0});await page.waitForFunction(()=>Object.keys(events).length===3);
 await page.evaluate(()=>{const editor=customElements.get('home-plan-card').getConfigElement();window.editor=editor;editor.hass=hass;editor.setConfig(card._config);editor.addEventListener('config-changed',e=>window.savedConfig=e.detail.config);document.querySelector('main').append(editor);});await page.evaluate(()=>editor.updateComplete);
 await page.evaluate(()=>{const form=editor.shadowRoot.querySelector('ha-form');form.dispatchEvent(new CustomEvent('value-changed',{detail:{value:{...editor._config.rooms[0],entities:['light.example','sensor.example_added']}},bubbles:true}));});assert.equal(await page.evaluate(()=>savedConfig.rooms[0].entities.includes('sensor.example_added')),true);assert.equal(await page.evaluate(()=>savedConfig.rooms[1].id),'east');
 await page.evaluate(()=>{Object.defineProperty(crypto,'randomUUID',{value:undefined,configurable:true});});await page.locator('home-plan-card-editor').getByRole('button',{name:'Ajouter un repère',exact:true}).click();assert.equal(await page.evaluate(()=>savedConfig.markers.length),2);assert.ok(await page.evaluate(()=>savedConfig.markers.at(-1).id.startsWith('marker-')));
 await page.evaluate(()=>{editor.remove();});
 await s.locator('[data-aperture=window]').click();await page.evaluate(()=>{const old=hass.states['cover.example'];hass={...hass,states:{...hass.states,'cover.example':{...old,state:'closed',attributes:{...old.attributes,current_position:0}}}};card.hass=hass;rejectService=true;});await page.evaluate(()=>card.updateComplete);await s.getByRole('button',{name:'Ouvrir',exact:true}).click();assert.match(await s.locator('[role=status]').innerText(),/Échec/);await s.locator('[data-close]').click();
 await page.evaluate(()=>{const bad=document.createElement('home-plan-card');bad.setConfig({model_url:'/local/broken.json'});bad.hass=hass;document.querySelector('main').append(bad);window.bad=bad;});await page.waitForFunction(()=>bad.shadowRoot.textContent.includes('HTTP 404'));await page.evaluate(()=>bad.remove());
 const sanitized=await page.evaluate(()=>{const badModel=structuredClone(card._config.model);badModel.artwork='<foreignObject><img src="x" onerror="window.injected=true"/></foreignObject><path d="M0 0H2" onclick="alert(1)"/>';const c=document.createElement('home-plan-card');c.setConfig({model:badModel});c.hass=hass;document.querySelector('main').append(c);window.sanitizedCard=c;return true;});assert.ok(sanitized);await page.evaluate(()=>sanitizedCard.updateComplete);assert.equal(await page.evaluate(()=>sanitizedCard._model.artwork.includes('onclick')||sanitizedCard._model.artwork.includes('foreignObject')),false);await page.evaluate(()=>sanitizedCard.remove());
 proof.push({commands_targeted:true,no_optimistic_state:true,contact_independent:true,unknown_position:true,unavailable_disabled:true,pulse_lock:true,smoke_alert:true,registry_area_inheritance:true,registry_refresh:true,listener_cleanup:true,stable_input:true,visual_editor:true,marker_without_secure_context:true,service_error:true,asset_error:true,sanitized_svg:true});
 if(privateDir){
  const cfg=JSON.parse(fs.readFileSync(path.join(privateDir,'card-config.json'),'utf8')),live=JSON.parse(fs.readFileSync(path.join(privateDir,'states.json'),'utf8'));await page.evaluate(({cfg,live})=>{card.setConfig(cfg);hass={...hass,states:live};card.hass=hass;rejectService=false;}, {cfg,live});await page.waitForFunction(()=>card._model?.markers?.length===2&&card.shadowRoot.querySelectorAll('[data-aperture]').length===8);
  for(const width of [320,390,736])for(const dark of [false,true]){await page.setViewportSize({width,height:1100});await page.evaluate(dark=>{document.body.classList.toggle('dark',dark);card.hass={...hass,themes:{darkMode:dark}};},dark);await page.evaluate(()=>card.updateComplete);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));fs.writeFileSync(path.join(out,`style-${width}-${dark}.json`),JSON.stringify(await page.evaluate(()=>({hostDark:card.hasAttribute('dark'),theme:card.hass.themes.darkMode,scheme:getComputedStyle(card).colorScheme,mode:card._mode,fill:getComputedStyle(card.shadowRoot.querySelector('.hpf-room-floor')).fill,buttonBg:getComputedStyle(card.shadowRoot.querySelector('.hpf-zone')).backgroundColor,buttonOpacity:getComputedStyle(card.shadowRoot.querySelector('.hpf-zone')).opacity})),null,2));await s.screenshot({path:path.join(out,`private-${width}-${dark?'dark':'light'}.png`)});}
  await s.locator('[data-mode=covers]').click();await s.screenshot({path:path.join(out,'private-covers.png')});
  fs.writeFileSync(path.join(out,'private-style-debug.json'),JSON.stringify(await page.evaluate(()=>({mode:card._mode,floor:[...card.shadowRoot.querySelectorAll('.hpf-room-floor')].slice(0,3).map(e=>({cl:e.getAttribute('class'),fill:getComputedStyle(e).fill,opacity:getComputedStyle(e).opacity,variable:getComputedStyle(e).getPropertyValue('--hp-floor')})),errors:card._error,feedback:card._feedback})),null,2));
  proof.push({private_geometry_and_images_loaded:true,private_actual_services_called:false});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify({proof,errors,real_services_called:false,native_ha:false},null,2));console.log(JSON.stringify({checks:proof.length,errors}));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
