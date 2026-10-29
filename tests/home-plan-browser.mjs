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
 if(url.pathname==='/bundle.js'){res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(root,'candidates/home-plan/home-plan-card.js')));return;}
 if(privateDir&&url.pathname.startsWith('/local/maison/plans/family-v1/')){const name=path.basename(url.pathname),file=path.join(privateDir,name.startsWith('model-')?'model.json':name);if(fs.existsSync(file)){res.setHeader('Content-Type',name.endsWith('.json')?'application/json':'image/svg+xml');res.end(fs.readFileSync(file));return;}}
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
  window.registry={entities,floors:[],devices:[{id:'example_device',area_id:'west_area'}],areas:[{area_id:'west_area',name:'Pièce ouest'},{area_id:'east_area',name:'Pièce est'}]};
  window.hass={states,themes:{darkMode:false},callService:async(...args)=>{calls.push(args);if(rejectService)throw Error('service indisponible');},callWS:async msg=>{registryRefreshes++;return registry[msg.type.includes('entity')?'entities':msg.type.includes('device')?'devices':msg.type.includes('floor')?'floors':'areas'];},connection:{subscribeEvents:async(fn,type)=>{events[type]=fn;return ()=>{delete events[type];unsubscribed++;};}},formatEntityState:s=>s.state+(s.attributes.unit_of_measurement?' '+s.attributes.unit_of_measurement:'')};
  const card=document.createElement('home-plan-card');window.card=card;card.setConfig(config);card.hass=hass;document.querySelector('main').append(card);
 },{config,states});
 await page.waitForFunction(()=>card.shadowRoot.querySelector('.hpf-map')&&card._registryLoaded);
 const card=page.locator('home-plan-card'),s=card.locator('.hpf-home');
 for(const width of [320,390,736])for(const dark of [false,true]){
  await page.setViewportSize({width,height:1000});await page.evaluate(dark=>{document.body.classList.toggle('dark',dark);hass={...hass,themes:{darkMode:dark}};card.hass=hass;},dark);await page.evaluate(()=>card.updateComplete);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await s.screenshot({path:path.join(out,`fictional-${width}-${dark?'dark':'light'}.png`)});proof.push({width,dark,no_overflow:true});
 }
 await page.setViewportSize({width:390,height:900});
 await s.locator('[data-aperture=window]').click();assert.equal(await s.locator('.hpf-cover output').innerText(),'Fermé');assert.equal(await s.locator('.hpf-cover input').inputValue(),'100','closed shutter fills range');assert.equal(await s.locator('.hpf-cover-preview').count(),1,'preserve shutter illustration');
 await s.getByRole('button',{name:'Ouvrir',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','open_cover',{}, {entity_id:'cover.example'}]);
 assert.equal(await s.locator('.hpf-cover output').innerText(),'Fermé','no optimistic state');
 assert.equal(await s.locator('.hpf-opening strong').innerText(),'Ouverte','contact independent');
 await page.evaluate(()=>{hass={...hass,states:{...hass.states,'cover.example':{...hass.states['cover.example'],state:'open',attributes:{...hass.states['cover.example'].attributes,current_position:68}}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);
 assert.equal(await s.locator('.hpf-cover output').innerText(),'68 % ouvert');assert.equal(await s.locator('.hpf-cover input').inputValue(),'32','range fill is closure while label remains opening');
 const input=s.locator('input[type=range]');await input.fill('43');await input.dispatchEvent('change');assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','set_cover_position',{position:57},{entity_id:'cover.example'}]);
 await s.getByRole('button',{name:'Arrêter',exact:true}).click();assert.equal(await page.evaluate(()=>calls.at(-1)[1]),'stop_cover');
 const identity=await page.evaluate(()=>{window.savedInput=card.shadowRoot.querySelector('input');hass={...hass,states:{...hass.states,'sensor.unrelated':{state:'3',attributes:{}}}};card.hass=hass;return true;});await page.evaluate(()=>card.updateComplete);assert.ok(identity&&await page.evaluate(()=>savedInput===card.shadowRoot.querySelector('input')));
 await page.evaluate(()=>{const old=hass.states['cover.example'];hass={...hass,states:{...hass.states,'cover.example':{...old,state:'unknown',attributes:{...old.attributes,current_position:undefined}}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);assert.equal(await input.isDisabled(),true);assert.equal(await s.locator('.hpf-cover output').innerText(),'Position inconnue');
 await page.evaluate(()=>{const old=hass.states['cover.example'];hass={...hass,states:{...hass.states,'cover.example':{...old,state:'unavailable'}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);assert.ok(await s.getByRole('button',{name:'Ouvrir',exact:true}).isDisabled());
 await s.locator('[data-close]').click();await s.locator('[data-aperture=motor]').click();await s.locator('[data-command]').click();assert.equal(await s.locator('[data-command]').isDisabled(),true);assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['switch','turn_on',{}, {entity_id:'switch.example_motor'}]);assert.match(await s.innerText(),/État physique non suivi/);
 await s.locator('[data-close]').click();await page.evaluate(()=>{hass={...hass,states:{...hass.states,'binary_sensor.example_smoke':{...hass.states['binary_sensor.example_smoke'],state:'on'}}};card.hass=hass;});await page.evaluate(()=>card.updateComplete);assert.equal(await s.locator('.hpf-room-marker.is-alert').count(),1);assert.match(await s.locator('[data-notice-summary=priority]').innerText(),/2/);
 assert.ok(await page.evaluate(()=>card._entities(card._rooms()[0]).includes('sensor.example_inherited')),'device area inherited');
 await page.evaluate(()=>{registry.entities.push({entity_id:'sensor.example_added',area_id:'west_area'});hass.states['sensor.example_added']={state:'40',attributes:{device_class:'humidity'}};events.entity_registry_updated();});await page.waitForFunction(()=>card._registry.entities['sensor.example_added']);assert.ok(await page.evaluate(()=>card._entities(card._rooms()[0]).includes('sensor.example_added')));
 const lifecycle=await page.evaluate(async()=>{card.remove();const detached={listeners:Object.keys(events).length,busy:card._busy.size};document.querySelector('main').append(card);await card.updateComplete;return detached;});assert.deepEqual(lifecycle,{listeners:0,busy:0});await page.waitForFunction(()=>Object.keys(events).length===4);
 await page.evaluate(()=>{const editor=customElements.get('home-plan-card').getConfigElement();window.editor=editor;editor.hass=hass;editor.setConfig(card._config);editor.addEventListener('config-changed',e=>window.savedConfig=e.detail.config);document.querySelector('main').append(editor);});await page.evaluate(()=>editor.updateComplete);
 await page.evaluate(()=>{const form=editor.shadowRoot.querySelector('ha-form');form.dispatchEvent(new CustomEvent('value-changed',{detail:{value:{...editor._config.rooms[0],entities:['light.example','sensor.example_added']}},bubbles:true}));});assert.equal(await page.evaluate(()=>savedConfig.rooms[0].entities.includes('sensor.example_added')),true);assert.equal(await page.evaluate(()=>savedConfig.rooms[1].id),'east');
 await page.evaluate(()=>{Object.defineProperty(crypto,'randomUUID',{value:undefined,configurable:true});});await page.locator('home-plan-card-editor').getByRole('button',{name:'Ajouter un repère',exact:true}).click();assert.equal(await page.evaluate(()=>savedConfig.markers.length),2);assert.ok(await page.evaluate(()=>savedConfig.markers.at(-1).id.startsWith('marker-')));
 await page.evaluate(()=>{editor.remove();});
 await s.locator('[data-aperture=window]').click();await page.evaluate(()=>{const old=hass.states['cover.example'];hass={...hass,states:{...hass.states,'cover.example':{...old,state:'closed',attributes:{...old.attributes,current_position:0}}}};card.hass=hass;rejectService=true;});await page.evaluate(()=>card.updateComplete);await s.getByRole('button',{name:'Ouvrir',exact:true}).click();assert.match(await s.locator('[role=status]').innerText(),/Échec/);await s.locator('[data-close]').click();
 await page.evaluate(()=>{const bad=document.createElement('home-plan-card');bad.setConfig({model_url:'/local/broken.json'});bad.hass=hass;document.querySelector('main').append(bad);window.bad=bad;});await page.waitForFunction(()=>bad.shadowRoot.textContent.includes('HTTP 404'));await page.evaluate(()=>bad.remove());
 const sanitized=await page.evaluate(()=>{const badModel=structuredClone(card._config.model);badModel.artwork='<foreignObject><img src="x" onerror="window.injected=true"/></foreignObject><path d="M0 0H2" onclick="alert(1)"/>';const c=document.createElement('home-plan-card');c.setConfig({model:badModel});c.hass=hass;document.querySelector('main').append(c);window.sanitizedCard=c;return true;});assert.ok(sanitized);await page.evaluate(()=>sanitizedCard.updateComplete);assert.equal(await page.evaluate(()=>sanitizedCard._model.artwork.includes('onclick')||sanitizedCard._model.artwork.includes('foreignObject')),false);await page.evaluate(()=>sanitizedCard.remove());
 proof.push({commands_targeted:true,no_optimistic_state:true,contact_independent:true,unknown_position:true,unavailable_disabled:true,pulse_lock:true,smoke_alert:true,registry_area_inheritance:true,registry_refresh:true,listener_cleanup:true,stable_input:true,visual_editor:true,marker_without_secure_context:true,service_error:true,asset_error:true,sanitized_svg:true});
 // Room/device selection, screen limits and group targets use the real frozen bundle.
 await page.evaluate(async({config})=>{
  const cfg=structuredClone(config);delete cfg.rooms[0].temperature_entity;
  const additions={
   'cover.extra':{state:'open',attributes:{friendly_name:'Autre volet',current_position:25,supported_features:15}},
   'cover.screen':{state:'open',attributes:{friendly_name:'Écran de démonstration',current_position:100,supported_features:15}},
   'cover.absent':{state:'unavailable',attributes:{friendly_name:'Volet indisponible',supported_features:15}},
   'light.other':{state:'off',attributes:{friendly_name:'Autre lampe',icon:'mdi:lamp'}},
   'light.group_a':{state:'off',attributes:{friendly_name:'Groupe commun',entity_id:['light.example','light.other']}},
   'light.group_b':{state:'off',attributes:{friendly_name:'Groupe commun',entity_id:['light.other']}},
   'sensor.oven':{state:'60',attributes:{friendly_name:'Four température',device_class:'temperature',unit_of_measurement:'°C'}},
   'sensor.oven_door':{state:'closed',attributes:{friendly_name:'Four porte',device_class:'enum',options:['closed','open','locked']}}
  };
  for(const [id,s]of Object.entries(additions)){s.entity_id=id;registry.entities.push({entity_id:id,area_id:'west_area'});}
  cfg.rooms[0].entities.push(...Object.keys(additions));cfg.cover_options=[{entity:'cover.screen',kind:'screen',max_position:90}];cfg.cover_groups=[{id:'upper',name:'Niveau supérieur',entities:['cover.extra','cover.screen']}];
  cfg.markers.push({id:'lightmark',room:'west',entity:'light.other',point:[240,230]});
  hass={...hass,states:{...hass.states,...additions}};rejectService=false;window.extra=document.createElement('home-plan-card');extra.setConfig(cfg);extra.hass=hass;document.querySelector('main').append(extra);
 },{config});
 await page.waitForFunction(()=>extra._model&&extra._registryLoaded);const ex=page.locator('home-plan-card').last();
 assert.equal(await page.evaluate(()=>extra._temperature(extra._rooms()[0])),undefined,'oven must never become ambient temperature implicitly');
 assert.ok(await page.evaluate(()=>extra._entities(extra._rooms()[0]).includes('sensor.oven_door')),'enum appliance doors included');
 assert.deepEqual(await page.evaluate(()=>extra._lights(extra._rooms()[0]).sort()),['light.example','light.other'],'overlapping light groups flattened and deduplicated');
 await ex.locator('.hpf-zone').first().click();
 const screen=ex.locator('[data-entity="cover.screen"]');assert.equal(await screen.locator('output').innerText(),'100 % déployé');assert.equal(await screen.locator('input').getAttribute('max'),'90');
 await screen.getByRole('button',{name:'Déployer',exact:true}).click();assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','set_cover_position',{position:90},{entity_id:'cover.screen'}]);
 await screen.getByRole('button',{name:'Rentrer',exact:true}).click();assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','close_cover',{}, {entity_id:'cover.screen'}]);
 await page.evaluate(()=>extra._send('cover.screen','cover.set_cover_position',{position:100}));assert.equal(await page.evaluate(()=>calls.at(-1)[2].position),90);
 assert.equal(await screen.locator('output').innerText(),'100 % déployé','screen state remains reported, no optimistic update');
 await page.evaluate(()=>{extra._config.cover_options.push({entity:'cover.extra',invert_position:true});extra.requestUpdate();});await page.evaluate(()=>extra.updateComplete);assert.equal(await page.evaluate(()=>extra._coverValue('cover.extra')),75);assert.equal(await page.evaluate(()=>extra._coverLabel('cover.extra')),'75 % ouvert');await page.evaluate(()=>extra._send('cover.extra','cover.set_cover_position',{position:30}));assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','set_cover_position',{position:70},{entity_id:'cover.extra'}]);await page.evaluate(()=>{extra._config.cover_options=extra._config.cover_options.filter(p=>p.entity!=='cover.extra');extra.requestUpdate();});
 const grouped=await page.evaluate(async()=>{const start=calls.length;await extra._batch(extra._windowCovers(extra._rooms()),'close_cover');return {calls:calls.slice(start),feedback:extra._feedback};});
 assert.deepEqual(grouped.calls.map(c=>c[3].entity_id).sort(),['cover.example','cover.extra']);assert.match(grouped.feedback,/2\/3/);assert.ok(!grouped.calls.some(c=>c[3].entity_id==='cover.screen'));
 assert.equal(await ex.locator('[data-light]').count(),2);
 assert.equal(await ex.locator('ha-state-icon').first().evaluate(e=>typeof e.stateObj),'object');
 await ex.getByRole('button',{name:/Équipements$/}).click();assert.equal(await ex.locator('[data-equipment="sensor.oven_door"]').count(),1);await ex.locator('[data-close]').click();
 // Placement: all original model markers have their positions, and drag/keyboard emit config only.
 await page.evaluate(()=>{const ed=document.createElement('home-plan-card-editor');ed.setConfig(extra._config);ed.hass=hass;window.dragEditor=ed;ed.addEventListener('config-changed',e=>window.dragConfig=e.detail.config);document.querySelector('main').append(ed);});
 const ed=page.locator('home-plan-card-editor');await page.waitForFunction(()=>dragEditor._baseModel);const preview=ed.locator('home-plan-card');
 assert.equal(await preview.locator('[data-marker]').count(),2,'existing markers rendered in placement mode');
 assert.ok(await page.evaluate(()=>dragEditor._allMarkers().find(m=>m.id==='smoke').point[0]===650),'base marker position inherited');
 const mark=preview.locator('[data-marker=lightmark]');await mark.scrollIntoViewIfNeeded();const box=await mark.boundingBox();const beforeCalls=await page.evaluate(()=>calls.length);
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+25,box.y+box.height/2+20,{steps:5});await page.mouse.up();
 assert.ok(await page.evaluate(()=>dragConfig.markers.find(m=>m.id==='lightmark').point[0]>240),'drag persists a changed coordinate');assert.equal(await page.evaluate(()=>calls.length),beforeCalls,'placement never sends services');
 const beforeKey=await page.evaluate(()=>dragConfig.markers.find(m=>m.id==='lightmark').point[0]);await mark.focus();await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>dragConfig.markers.find(m=>m.id==='lightmark').point[0]),beforeKey+5);
 const ap=preview.locator('[data-aperture=window]');await ap.focus();await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>dragConfig.apertures.find(m=>m.id==='window').control[1]),265);
 assert.deepEqual(await page.evaluate(()=>dragConfig.apertures.find(m=>m.id==='window').segment),[70,200,70,320],'dragging command preserves architectural opening');
 const cancelBefore=await page.evaluate(()=>JSON.stringify(dragConfig));await mark.scrollIntoViewIfNeeded();const cancelBox=await mark.boundingBox();await page.mouse.move(cancelBox.x+22,cancelBox.y+22);await page.mouse.down();await page.mouse.move(cancelBox.x+42,cancelBox.y+42);await page.evaluate(()=>{const c=dragEditor.shadowRoot.querySelector('home-plan-card');c._dragEnd({pointerId:c._drag.pointerId},true);});await page.mouse.up();assert.equal(await page.evaluate(()=>JSON.stringify(dragConfig)),cancelBefore,'cancelled drag does not persist');
 await page.evaluate(()=>{dragEditor.remove();});await ex.locator('[data-mode=covers]').click();await ex.locator('[data-floor-covers]').click();await ex.getByLabel('Niveau des volets').selectOption('upper');assert.equal(await ex.locator('.hpf-sheet [data-entity]').count(),1);assert.equal(await ex.locator('.hpf-sheet [data-entity]').getAttribute('data-entity'),'cover.extra','selected level expands group and excludes screen');
 await page.evaluate(()=>extra.remove());
 proof.push({explicit_ambient_temperature:true,enum_appliance_door:true,native_entity_icons:true,overlapping_lights_deduplicated:true,screen_deploy_retract:true,screen_90_limit:true,floor_batch_excludes_screen:true,batch_partial_unavailable:true,existing_marker_positions:true,drag_and_keyboard_persist_config:true,placement_never_actuates:true,aperture_geometry_preserved:true});

 // Live tiered signals: location, recovery, Art mode and inventory/placement remain separate.
 await page.evaluate(async({config,states})=>{
  const cfg=structuredClone(config);cfg.notification_scope='home';cfg.notification_excluded_areas=['mobile'];
  cfg.notification_rules=[{id:'frame',entity:'media_player.primary',state_entity:'media_player.frame',aliases:['media_player.frame'],level:'info',states:['on'],unless:{entity:'media_player.frame',attribute:'art_mode_status',states:['on']},idle_label:'Mode Art'}, {id:'product',entity:'sensor.product',level:'maintenance',states:['low_detergent'],label:'Produit robot'}];
  const more={
   'media_player.primary':{state:'on',attributes:{friendly_name:'TV de démonstration',device_class:'tv'}},
   'media_player.frame':{state:'on',attributes:{friendly_name:'État TV de démonstration',art_mode_status:'on'}},
   'sensor.product':{state:'installed',attributes:{friendly_name:'Produit du robot'}},
   'binary_sensor.remote_leak':{state:'off',attributes:{friendly_name:'Fuite annexe',device_class:'moisture'}},
   'binary_sensor.low_battery':{state:'on',attributes:{friendly_name:'Pile faible',device_class:'battery'}},
   'sensor.low_battery':{state:'8',attributes:{friendly_name:'Niveau de pile',device_class:'battery',unit_of_measurement:'%'}},
   'sensor.mobile_battery':{state:'1',attributes:{friendly_name:'Mobile de démonstration',device_class:'battery'}}
  };
  window.signalStates={...structuredClone(states),...more};Object.entries(signalStates).forEach(([id,s])=>s.entity_id=id);
  registry={entities:Object.keys(signalStates).map(entity_id=>({entity_id,area_id:entity_id.includes('remote')?'annex':entity_id.includes('mobile')?'mobile':entity_id.includes('smoke')||entity_id.includes('motor')?'east_area':'west_area',device_id:entity_id.includes('low_battery')?'same_battery':entity_id})),devices:[{id:'same_battery',name:'Capteur de démonstration',area_id:'west_area'}],areas:[{area_id:'west_area',name:'Ouest',floor_id:'main'},{area_id:'east_area',name:'Est',floor_id:'main'},{area_id:'annex',name:'Annexe',floor_id:'lower'},{area_id:'mobile',name:'Mobiles'}],floors:[{floor_id:'main',name:'Principal'},{floor_id:'lower',name:'Inférieur'}]};
  cfg.rooms[0].entities.push('media_player.primary','sensor.product');window.signals=document.createElement('home-plan-card');signals.setConfig(cfg);signals.hass={...hass,states:signalStates};document.querySelector('main').append(signals);
 },{config,states});await page.waitForFunction(()=>signals._model&&signals._registryLoaded);
 const sig=page.locator('home-plan-card').last();
 assert.equal(await sig.locator('[data-marker=smoke]').count(),0,'healthy detector hidden on normal plan');
 assert.equal(await sig.locator('[data-notice-summary=info]').count(),0,'Art mode is not equipment in service');
 assert.equal(await page.evaluate(()=>signals._format('media_player.primary')),'Mode Art');
 assert.match(await sig.locator('[data-notice-summary=maintenance]').innerText(),/1/,'same physical battery counted once, mobile excluded, installed product healthy');
 const callCount=await page.evaluate(()=>calls.length);
 await page.evaluate(()=>{signalStates={...signalStates,'binary_sensor.example_smoke':{...signalStates['binary_sensor.example_smoke'],state:'on'},'binary_sensor.remote_leak':{...signalStates['binary_sensor.remote_leak'],state:'on'},'media_player.frame':{...signalStates['media_player.frame'],attributes:{art_mode_status:'off'}}};signals.hass={...hass,states:signalStates};});await page.evaluate(()=>signals.updateComplete);
 assert.equal(await sig.locator('[data-marker=smoke].is-alert').count(),1);assert.match(await sig.locator('[data-notice-summary=priority]').innerText(),/3/);assert.match(await sig.locator('[data-notice-summary=info]').innerText(),/1/);assert.equal(await sig.locator('.hpf-room-activity ha-state-icon').count(),1);
 await sig.locator('[data-notice-summary=priority]').click();assert.equal(await sig.locator('[data-notice-level=priority]').getAttribute('aria-pressed'),'true');assert.equal(await sig.locator('[data-notice]').count(),3);
 await sig.getByLabel('Niveau de la maison').selectOption('lower');assert.equal(await sig.locator('[data-notice]').count(),1);assert.match(await sig.locator('.hpf-notice-row').innerText(),/Annexe/);
 await sig.getByLabel('Niveau de la maison').selectOption('');await sig.locator('[data-notice-level=maintenance]').click();assert.equal(await sig.locator('[data-notice]').count(),1);
 await page.evaluate(()=>{signalStates={...signalStates,'binary_sensor.low_battery':{...signalStates['binary_sensor.low_battery'],state:'off'},'sensor.low_battery':{...signalStates['sensor.low_battery'],state:'80'}};signals.hass={...hass,states:signalStates};});await page.evaluate(()=>signals.updateComplete);assert.equal(await sig.locator('[data-notice]').count(),0,'recovery clears current signal');assert.match(await sig.locator('.hpf-empty').innerText(),/Aucun signalement/);
 await sig.locator('[data-close]').click();await page.evaluate(()=>{signalStates={...signalStates,'media_player.frame':{...signalStates['media_player.frame'],attributes:{art_mode_status:'on'}}};signals.hass={...hass,states:signalStates};});await page.evaluate(()=>signals.updateComplete);assert.equal(await sig.locator('[data-notice-summary=info]').count(),0);assert.equal(await page.evaluate(()=>calls.length),callCount,'signal filtering sends no equipment service');
 await page.evaluate(()=>signals.remove());proof.push({healthy_detectors_hidden:true,priority_vs_maintenance_vs_info:true,floors_and_rooms:true,active_counts_and_recovery:true,art_mode_and_aliases:true,consumable_installed_not_empty:true,notification_filters_read_only:true});

 if(privateDir){
  const cfg=JSON.parse(fs.readFileSync(path.join(privateDir,'card-config.json'),'utf8')),live=JSON.parse(fs.readFileSync(path.join(privateDir,'states.json'),'utf8')),reg=fs.existsSync(path.join(privateDir,'registry.json'))?JSON.parse(fs.readFileSync(path.join(privateDir,'registry.json'),'utf8')):null;await page.evaluate(({cfg,live,reg})=>{card.setConfig(cfg);if(reg){window.registry=reg;card._registryLoaded=false;card._startRegistry();}hass={...hass,states:live};card.hass=hass;rejectService=false;}, {cfg,live,reg});await page.waitForFunction(()=>card._model?.markers?.length>=2&&card.shadowRoot.querySelectorAll('[data-aperture]').length===8);
  for(const width of [320,390,736])for(const dark of [false,true]){await page.setViewportSize({width,height:1100});await page.evaluate(dark=>{document.body.classList.toggle('dark',dark);card.hass={...hass,themes:{darkMode:dark}};},dark);await page.evaluate(()=>card.updateComplete);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));fs.writeFileSync(path.join(out,`style-${width}-${dark}.json`),JSON.stringify(await page.evaluate(()=>({hostDark:card.hasAttribute('dark'),theme:card.hass.themes.darkMode,scheme:getComputedStyle(card).colorScheme,mode:card._mode,fill:getComputedStyle(card.shadowRoot.querySelector('.hpf-room-floor')).fill,buttonBg:getComputedStyle(card.shadowRoot.querySelector('.hpf-zone')).backgroundColor,buttonOpacity:getComputedStyle(card.shadowRoot.querySelector('.hpf-zone')).opacity})),null,2));await s.screenshot({path:path.join(out,`private-${width}-${dark?'dark':'light'}.png`)});}
  await s.locator('[data-mode=covers]').click();await s.screenshot({path:path.join(out,'private-covers.png')});
  fs.writeFileSync(path.join(out,'private-style-debug.json'),JSON.stringify(await page.evaluate(()=>({mode:card._mode,floor:[...card.shadowRoot.querySelectorAll('.hpf-room-floor')].slice(0,3).map(e=>({cl:e.getAttribute('class'),fill:getComputedStyle(e).fill,opacity:getComputedStyle(e).opacity,variable:getComputedStyle(e).getPropertyValue('--hp-floor')})),errors:card._error,feedback:card._feedback})),null,2));
  await s.locator('[data-mode=""]').click();
  for(const width of [320,390,736]){await page.setViewportSize({width,height:1100});for(const roomId of ['salon','cuisine']){await page.evaluate(id=>card._select(card._rooms().find(r=>r.id===id)),roomId);await page.evaluate(()=>card.updateComplete);await s.screenshot({path:path.join(out,`private-${roomId}-${width}.png`)});await s.locator('[data-close]').click();}}
  proof.push({private_geometry_and_images_loaded:true,private_actual_services_called:false});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify({proof,errors,real_services_called:false,native_ha:false},null,2));console.log(JSON.stringify({checks:proof.length,errors}));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
