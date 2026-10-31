import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {groupLeaves,exactGroup,roomGroupSummary} from '../src/candidate/home-plan-room-groups.js';
const state=(id,state,attributes={})=>({entity_id:id,state,attributes});
const states={
 'light.a':state('light.a','on',{friendly_name:'Lampe A'}),'light.b':state('light.b','off',{friendly_name:'Lampe B'}),
 'light.room':state('light.room','on',{entity_id:['light.a','light.b']}),
 'cover.a':state('cover.a','open',{current_position:100,supported_features:15}),
 'cover.b':state('cover.b','closed',{current_position:0,supported_features:15}),
 'cover.room':state('cover.room','open',{entity_id:['cover.a','cover.b'],current_position:50,supported_features:15}),
 'binary_sensor.a':state('binary_sensor.a','off',{device_class:'window'}),
 'binary_sensor.b':state('binary_sensor.b','on',{device_class:'window'}),
 'binary_sensor.room':state('binary_sensor.room','on',{entity_id:['binary_sensor.a','binary_sensor.b']})
};
const get=id=>states[id];
assert.deepEqual(groupLeaves('light.room',get),['light.a','light.b']);
assert.equal(exactGroup('light.room',['light.a'],get),false,'a group may not command excluded members');
assert.equal(exactGroup('light.room',['light.b','light.a'],get),true);
assert.equal(roomGroupSummary('lights',['light.a','light.b'],get).text,'1/2 allumées');
assert.equal(roomGroupSummary('openings',['binary_sensor.a','binary_sensor.b'],get).text,'1/2 ouvertes');
assert.equal(roomGroupSummary('covers',['cover.a','cover.b'],get,id=>get(id).attributes.current_position).count,1);
assert.equal(roomGroupSummary('lights',['light.missing'],get).text,'État inconnu');
assert.equal(roomGroupSummary('covers',['cover.a','cover.missing'],get,id=>get(id)?.attributes.current_position).unknown,1);
const cyclic={'light.root':state('light.root','off',{entity_id:['light.child','light.a']}),'light.child':state('light.child','off',{entity_id:['light.root','light.a']}),...states};
assert.deepEqual(groupLeaves('light.root',id=>cyclic[id]),['light.a']);
assert.equal(exactGroup('light.root',['light.a'],id=>cyclic[id]),false,'cyclic groups cannot be used as a native command target');
const oversized={...states,'light.large':state('light.large','off',{entity_id:Array.from({length:210},(_,i)=>'light.member_'+i)})};
assert.equal(exactGroup('light.large',groupLeaves('light.large',id=>oversized[id]),id=>oversized[id]),false,'a truncated expansion never authorizes all members of a larger group');
const root=path.resolve(import.meta.dirname,'..'),config={type:'custom:home-plan-card',room_only:true,start_room:'room',model:{bounds:[0,0,100,100],artwork:'',rooms:[{id:'room',name:'Pièce test',x:0,y:0,w:100,h:100,path:'M0 0H100V100H0Z'}]},rooms:[{id:'room',name:'Pièce test',entities:['light.a','light.b','cover.a','cover.b'],light_group:'light.room',cover_group:'cover.room',opening_group:'binary_sensor.room'}]};
const server=http.createServer((req,res)=>{if(req.url==='/bundle.js'){res.setHeader('content-type','text/javascript');res.end(fs.readFileSync(path.join(root,'candidates/home-plan/home-plan-card.js')));return;}res.setHeader('content-type','text/html');res.end('<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;font-family:system-ui}home-plan-card{display:block;max-width:1100px;margin:auto}ha-card{display:block}</style><script type="module" src="/bundle.js"></script><main></main>');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']}),page=await browser.newPage({viewport:{width:1100,height:950}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>customElements.get('home-plan-card'));
 await page.evaluate(({config,states})=>{window.calls=[];window.details=[];window.hass={states,callWS:async()=>[],callService:async(...args)=>calls.push(args)};window.card=document.createElement('home-plan-card');card.hass=hass;card.setConfig(config);card.addEventListener('hass-more-info',e=>details.push(e.detail.entityId));document.querySelector('main').append(card);},{config,states});
 await page.waitForFunction(()=>card._selected==='room');const c=page.locator('home-plan-card');
 assert.equal(await c.locator('[data-room-summary]').count(),3);
 assert.match(await c.locator('[data-room-summary=lights]').textContent(),/1\/2 allumées/);
 assert.match(await c.locator('[data-room-summary=covers]').textContent(),/1\/2 ouverts/);
 assert.match(await c.locator('[data-room-summary=openings]').textContent(),/1\/2 ouvertes/);
 for(const kind of ['lights','covers','openings'])await c.locator(`[data-room-summary=${kind}]`).click();
 assert.deepEqual(await page.evaluate(()=>details),['light.room','cover.room','binary_sensor.room']);
 assert.equal(await page.evaluate(()=>calls.length),0,'summary selection never actuates devices');
 await c.locator('[data-group=light]').getByRole('button',{name:'Tout éteindre',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['light','turn_off',{}, {entity_id:'light.room'}]);
 await c.locator('[data-group=cover] [data-cover-preset="50"]').click();
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','set_cover_position',{position:50},{entity_id:'cover.room'}]);
 for(const domain of ['light','cover'])await c.locator(`[data-group-info=${domain}]`).click();
 assert.deepEqual(await page.evaluate(()=>details.slice(-2)),['light.room','cover.room']);
 await page.evaluate(()=>{hass.states={...hass.states,'light.a':{...hass.states['light.a'],state:'off'},'binary_sensor.b':{...hass.states['binary_sensor.b'],state:'unavailable'}};card.hass={...hass};});
 await page.waitForFunction(()=>card.shadowRoot.querySelector('[data-room-summary=lights]').textContent.includes('0/2'));
 assert.match(await c.locator('[data-room-summary=openings]').textContent(),/0\/2 ouvertes · 1 \?/);
 await page.evaluate(()=>{const next=structuredClone(card._rootConfig);next.rooms[0].excluded_entities=['light.b'];card.setConfig(next);});await page.waitForFunction(()=>card._selected==='room');
 await c.locator('[data-group=light]').getByRole('button',{name:'Tout allumer',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['light','turn_on',{}, {entity_id:'light.a'}]);
 await page.evaluate(()=>{card._config.cover_options=[{entity:'cover.a',invert_position:true,max_position:90,kind:'screen'}];});
 await c.locator('.hpf-cover[data-entity="cover.a"] [data-cover-preset="25"]').click();
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),['cover','set_cover_position',{position:75},{entity_id:'cover.a'}]);
 for(const width of [320,390,736,1100]){await page.setViewportSize({width,height:1050});await page.evaluate(()=>card.updateComplete);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const sizes=await c.locator('[data-room-summary]').evaluateAll(es=>es.map(e=>({w:e.offsetWidth,h:e.offsetHeight})));assert.ok(sizes.every(s=>s.w>60&&s.h>=44));}
 assert.deepEqual(errors,[]);console.log('Room groups: exact native targets, counters, unknown states, excluded member safety, cogs, opening presets, screen inversion and four responsive widths passed.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
