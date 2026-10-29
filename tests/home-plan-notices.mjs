import assert from 'node:assert/strict';
import {baseNotice,isEquipmentActive,conditionMatches,ruleNotice,buildNotices} from '../src/candidate/home-plan-notices.js';
const state=(entity_id,value,attributes={})=>({entity_id,state:value,attributes});
const smoke=state('binary_sensor.smoke','on',{device_class:'smoke'});
assert.equal(baseNotice(smoke).level,'priority');assert.equal(baseNotice(smoke).critical,true);
assert.equal(baseNotice({...smoke,state:'off'}),null);assert.equal(baseNotice({...smoke,state:'unknown'}),null);
assert.equal(baseNotice({...smoke,state:'unavailable'}).level,'maintenance');
assert.equal(baseNotice(state('binary_sensor.flood','on',{device_class:'moisture'})).kind,'moisture');
assert.equal(baseNotice(state('binary_sensor.window','on'),{opening:true}).kind,'opening');
assert.equal(baseNotice(state('binary_sensor.appliance_door','on')),null,'appliance door is not implicitly a building opening');
assert.equal(baseNotice(state('sensor.battery','20',{device_class:'battery'})).level,'maintenance');
for(const value of ['high','21','unknown','unavailable',''])assert.equal(baseNotice(state('sensor.battery',value,{device_class:'battery'})),null);
assert.equal(baseNotice(state('sensor.battery','low',{device_class:'battery'})).kind,'battery');
assert.equal(baseNotice(state('binary_sensor.battery','on',{device_class:'battery'})).kind,'battery');
assert.equal(baseNotice(state('binary_sensor.fault','on',{device_class:'problem'})).level,'maintenance');
assert.equal(baseNotice(state('sensor.cycle','finished',{device_class:'enum',options:['finished','run']})).level,'ready');
assert.equal(baseNotice(state('sensor.cycle','run',{device_class:'enum',options:['finished','run']})),null);
assert.equal(isEquipmentActive(state('media_player.example','on')),true);
assert.equal(isEquipmentActive(state('media_player.example','on',{art_mode_status:'on'})),false);
assert.equal(isEquipmentActive(state('media_player.example','on',{art_mode_status:'off'})),true);
assert.equal(isEquipmentActive(state('media_player.example','unavailable')),false);
assert.equal(isEquipmentActive(state('device_tracker.pc','home')),false,'network presence does not prove that equipment is in use');
const states={
 'media_player.primary':state('media_player.primary','on'),
 'media_player.frame':state('media_player.frame','on',{art_mode_status:'on'}),
 'sensor.product':state('sensor.product','installed'),
 'sensor.filter':state('sensor.filter','replace'),
 'binary_sensor.smoke':smoke,
 'binary_sensor.low':state('binary_sensor.low','on',{device_class:'battery'}),
 'sensor.low':state('sensor.low','8',{device_class:'battery'}),
 'binary_sensor.remote_flood':state('binary_sensor.remote_flood','on',{device_class:'moisture'}),
 'sensor.phone':state('sensor.phone','1',{device_class:'battery'})
};
const getState=id=>states[id];
assert.equal(ruleNotice({id:'empty',entity:'media_player.primary',level:'info',states:[]},getState),null,'empty state selection stays empty');
const tv={id:'frame',entity:'media_player.primary',state_entity:'media_player.frame',aliases:['media_player.frame'],level:'info',states:['on'],unless:{entity:'media_player.frame',attribute:'art_mode_status',states:['on']}};
assert.equal(ruleNotice(tv,getState),null);states['media_player.frame'].attributes.art_mode_status='off';assert.equal(ruleNotice(tv,getState).level,'info');
assert.equal(conditionMatches({entity:'sensor.missing',states:['on']},getState),null);
assert.equal(ruleNotice({...tv,unless:{entity:'sensor.missing',states:['on']}},getState),null,'unknown Art source is not treated as proof of TV use');
assert.equal(ruleNotice({id:'product',entity:'sensor.product',level:'maintenance',states:['low','empty']},getState),null,'installed is not depleted');
assert.equal(ruleNotice({id:'filter',entity:'sensor.filter',level:'maintenance',states:['replace']},getState).level,'maintenance');
assert.equal(ruleNotice({id:'water',entity:'binary_sensor.low',level:'priority',critical:true,kind:'moisture',states:['on']},getState).critical,true,'explicit verified water signal may override a generic HA problem class');
const verifiedWater=ruleNotice({id:'water',entity:'binary_sensor.misclassified_water',level:'priority',critical:true,kind:'moisture',states:['on']},()=>state('binary_sensor.misclassified_water','on',{device_class:'problem'}));assert.equal(verifiedWater.level,'priority');assert.equal(verifiedWater.critical,true,'explicit verified water signal may override a generic HA problem class');
const registry={entities:Object.fromEntries(Object.keys(states).map(entity_id=>[entity_id,{entity_id,area_id:entity_id==='sensor.phone'?'mobile':entity_id.includes('remote')?'remote':'living',device_id:entity_id.includes('low')?'battery-device':entity_id}])),devices:{'battery-device':{id:'battery-device',name:'Capteur fictif'}},areas:{living:{area_id:'living',name:'Séjour',floor_id:'ground'},remote:{area_id:'remote',name:'Annexe',floor_id:'lower'},mobile:{area_id:'mobile',name:'Mobiles'}},floors:{ground:{floor_id:'ground',name:'Principal'},lower:{floor_id:'lower',name:'Inférieur'}}};
const args={states,registry,rooms:[{id:'living-room',name:'Séjour',area_id:'living',entity_ids:Object.keys(states).filter(id=>!id.includes('remote')&&id!=='sensor.phone')}],rules:[tv],scope:'home',excludedAreas:['mobile']};
let notices=buildNotices(args);
assert.equal(notices.filter(n=>n.kind==='battery').length,1,'same physical battery counted once');
assert.equal(notices.filter(n=>n.kind==='activity'||n.entity==='media_player.primary').length,1,'TV aliases counted once');
assert.equal(notices.find(n=>n.entity==='binary_sensor.remote_flood').location.floor_name,'Inférieur');
assert.ok(!notices.some(n=>n.entity==='sensor.phone'));
states['media_player.frame'].attributes.art_mode_status='on';assert.ok(!buildNotices(args).some(n=>n.level==='info'));
states['binary_sensor.smoke'].state='off';assert.ok(!buildNotices(args).some(n=>n.kind==='smoke'),'signal recovers immediately');
assert.ok(!buildNotices({...args,scope:'plan'}).some(n=>n.entity==='binary_sensor.remote_flood'));
const fallbackStates={'binary_sensor.aggregate':state('binary_sensor.aggregate','on'),'sensor.fluid':state('sensor.fluid','low')};const detailRules=[{id:'fluid',entity:'sensor.fluid',level:'maintenance',states:['low']},{id:'aggregate',entity:'binary_sensor.aggregate',level:'maintenance',states:['on'],fallback_for:['fluid']}];assert.equal(buildNotices({states:fallbackStates,rules:detailRules}).length,1,'aggregated helper does not duplicate a detailed issue');fallbackStates['sensor.fluid'].state='normal';assert.equal(buildNotices({states:fallbackStates,rules:detailRules}).length,1,'aggregate remains a fallback for unmodeled maintenance');
console.log('Home Plan signals: severity, safety unknowns, current recovery, battery dedup, Art mode/alias, consumables, floors and exclusions OK.');

for(const value of ['docked','charging','idle','paused','unavailable','unknown'])assert.equal(isEquipmentActive(state('vacuum.test',value)),false);
assert.equal(isEquipmentActive(state('vacuum.test','cleaning',{docked:true})),false);
assert.equal(isEquipmentActive(state('vacuum.test','returning',{docked:false})),true);
const robotRule={id:'robot',entity:'vacuum.test',state_entity:'sensor.robot_task',level:'info',states:['cleaning','returning','washing','drying']};
for(const task of ['washing','drying','cleaning'])assert.equal(ruleNotice(robotRule,id=>id==='vacuum.test'?state(id,'docked',{docked:true}):state(id,task)),null,'base overrides a station task or stale activity');
assert.equal(ruleNotice(robotRule,id=>id==='vacuum.test'?state(id,'cleaning',{docked:false}):state(id,'cleaning')).level,'info');
const cycleStates={'sensor.washer':state('sensor.washer','finished',{device_class:'enum',options:['run','finished']})};
assert.equal(buildNotices({states:cycleStates,rooms:[{id:'laundry',entity_ids:Object.keys(cycleStates)}]})[0].level,'ready');
cycleStates['sensor.washer'].state='run';assert.equal(buildNotices({states:cycleStates,rooms:[{id:'laundry',entity_ids:Object.keys(cycleStates)}]}).length,0);
console.log('Cycles ready for collection and docked robot exclusion OK.');
