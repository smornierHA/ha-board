import assert from 'node:assert/strict';
import {collectionAutomation,COLLECTION_OPTIONS} from '../src/candidate/home-plan-collection.js';
// Exercise the generated native choose branches; no separate production state machine.
function harness(binaryDoor){
 const config=collectionAutomation({name:'Appareil fictif',stateEntity:'sensor.program',doorEntity:binaryDoor?'binary_sensor.door':'sensor.door',helperEntity:'input_select.collection',runningStates:['run'],finishedStates:['finished'],binaryDoor});
 let option=COLLECTION_OPTIONS[0],program='idle',door=binaryDoor?'off':'closed';
 const matches=(c,id)=>{if(c.condition==='trigger')return c.id===id;if(c.condition!=='state')return false;const value=c.entity_id==='sensor.program'?program:option;return Array.isArray(c.state)?c.state.includes(value):value===c.state;};
 const dispatch=id=>{const branch=config.actions[0].choose.find(b=>b.conditions.every(c=>matches(c,id)));if(branch)option=branch.sequence[0].data.option;return option;};
 const event=(source,next)=>{
  const from=source==='program'?program:door,entity=source==='program'?'sensor.program':binaryDoor?'binary_sensor.door':'sensor.door';
  if(from===next)return option;
  if(source==='program')program=next;else door=next;
  for(const t of config.triggers){
   const fires=t.trigger==='door.opened'?entity===t.target.entity_id&&from==='off'&&next==='on':entity===t.entity_id&&t.to===next&&(t.from===undefined||t.from===from);
   if(!fires)continue;
   dispatch(t.id);
  }
  return option;
 };
 return {config,event,get option(){return option;},restore:value=>option=value,start:()=>dispatch('recover'),offlineProgram:value=>program=value};
}
for(const binary of [false,true]){
 const h=harness(binary),open=binary?'on':'open',closed=binary?'off':'closed';
 assert.equal(h.event('door',open),'Au repos');
 assert.equal(h.event('program','run'),'En cours');
 assert.equal(h.event('door',closed),'En cours');assert.equal(h.event('door',open),'En cours','opening before finish is not collection');
 assert.equal(h.event('program','finished'),'À récupérer','already-open door does not acknowledge a later finish');
 assert.equal(h.event('door',closed),'À récupérer');assert.equal(h.event('door',open),'Récupéré');
 h.event('program','unavailable');assert.equal(h.event('program','finished'),'Récupéré','finished recovery must not recreate a collected task');
 h.restore('À récupérer');h.event('door','unavailable');assert.equal(h.event('door',open),'À récupérer','recovery is not a new door opening');
 h.event('door',closed);assert.equal(h.event('door',open),'Récupéré');
 assert.equal(h.event('program','run'),'En cours');assert.equal(h.event('program','finished'),'À récupérer','new program rearms task');
 h.restore('En cours');h.offlineProgram('finished');assert.equal(h.start(),'À récupérer','startup reconciles a cycle finished while HA was down');h.restore('Récupéré');assert.equal(h.start(),'Récupéré','startup never recreates collected tasks');h.restore('À récupérer');h.offlineProgram('run');assert.equal(h.start(),'En cours','startup follows a genuinely new running program');
 assert.equal(h.config.mode,'queued');assert.ok(h.config.actions[0].choose.flatMap(b=>b.sequence).every(a=>a.action==='input_select.select_option'));
}
console.log('Collection automation contracts: before/after door, restart recovery, rearm and helpers-only actions OK.');
