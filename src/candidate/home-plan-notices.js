/* Live presentation signals only; no recorder, notification delivery or device commands. */
export const NOTICE_LEVELS = ['priority','ready','battery','maintenance','info'];
const RANK={priority:0,battery:1,maintenance:2,ready:3,info:4};
export const noticeOrder=(a,b)=>(RANK[a.level]??5)-(RANK[b.level]??5)||Number(!!b.critical)-Number(!!a.critical)||a.label.localeCompare(b.label);
const CRITICAL = new Set(['smoke','gas','moisture','carbon_monoxide']);
const BAD = new Set(['unknown','unavailable']);
const ACTIVE = new Set(['on','playing','paused','buffering','cleaning','returning']);
const POSITIVE = new Set(['on','true','low','empty','replace','required','error','fault','problem']);
const text = value => String(value ?? '').toLowerCase();
const known = s => !!s && s.state !== '' && !BAD.has(s.state);
const number = value => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null;
export function conditionMatches(condition,getState){
  const s=getState(condition.entity);if(!known(s))return null;
  const value=condition.attribute?s.attributes?.[condition.attribute]:s.state;
  if(value===undefined||value===null||BAD.has(text(value)))return null;
  if(Array.isArray(condition.states))return condition.states.some(v=>text(v)===text(value));
  const n=number(value);if(condition.below!==undefined||condition.above!==undefined)return n!==null&&(condition.below===undefined||n<=condition.below)&&(condition.above===undefined||n>=condition.above);
  return POSITIVE.has(text(value));
}
export function isEquipmentActive(s){
  if(!known(s))return false;
  const domain=s.entity_id?.split('.')[0];
  if(domain==='media_player'){
    const art=s.attributes?.art_mode_status;
    if(art===true||text(art)==='on')return false;
    if(art===undefined&&text(s.attributes?.app_id)==='art')return false;
    return ['on','playing','paused','buffering'].includes(s.state);
  }
  if(domain==='fan')return s.state==='on';
  if(domain==='vacuum')return s.attributes?.docked!==true&&text(s.attributes?.docked)!=='true'&&['cleaning','returning'].includes(s.state);
  return false;
}
export function baseNotice(s,{opening=false,batteryThreshold=20}={}){
  if(!s)return null;const cls=s.attributes?.device_class,domain=s.entity_id?.split('.')[0];
  if(s.state==='unavailable'&&(CRITICAL.has(cls)||opening))return {level:'maintenance',kind:'unavailable',detail:'Capteur indisponible',icon:'mdi:connection'};
  if(!known(s))return null;
  if(domain==='binary_sensor'&&CRITICAL.has(cls)&&s.state==='on')return {level:'priority',kind:cls,critical:true,detail:({smoke:'Fumée détectée',moisture:'Fuite d’eau détectée',gas:'Gaz détecté',carbon_monoxide:'Monoxyde de carbone détecté'})[cls],icon:({smoke:'mdi:smoke-detector-alert',moisture:'mdi:water-alert',gas:'mdi:gas-cylinder',carbon_monoxide:'mdi:molecule-co'})[cls]};
  if(opening&&s.state==='on')return {level:'priority',kind:'opening',detail:'Ouvrant ouvert',icon:'mdi:door-open'};
  if(cls==='battery'){
    const n=number(s.state),low=domain==='binary_sensor'?s.state==='on':n!==null?n<=batteryThreshold:['low','very_low','critical','empty','replace'].includes(text(s.state));
    if(low)return {level:'battery',kind:'battery',detail:n!==null?`Pile faible · ${n} %`:'Pile faible',icon:'mdi:battery-alert-variant-outline'};
  }
  if(domain==='binary_sensor'&&['problem','tamper','safety'].includes(cls)&&s.state==='on')return {level:'maintenance',kind:cls==='tamper'?'tamper':'fault',detail:cls==='tamper'?'Autoprotection à vérifier':'Défaut à vérifier',icon:'mdi:wrench-outline'};
  if(domain==='sensor'&&cls==='enum'&&s.state==='finished'&&s.attributes.options?.includes('finished'))return {level:'ready',kind:'finished',detail:'Cycle terminé · à récupérer',icon:'mdi:check-circle-outline'};
  if(isEquipmentActive(s))return {level:'info',kind:'activity',detail:domain==='vacuum'?'Nettoyage en cours':domain==='fan'?'En fonctionnement':'En service',icon:domain==='vacuum'?'mdi:robot-vacuum':domain==='fan'?'mdi:fan':'mdi:television'};
  return null;
}
export function ruleNotice(rule,getState){
  if(rule.level==='ignore')return null;
  // A station task can report washing/drying while the vacuum is docked.
  const equipment=getState(rule.entity);
  if(rule.level==='info'&&rule.entity?.startsWith('vacuum.')&&(!known(equipment)||['docked','charging'].includes(equipment.state)||equipment.attributes?.docked===true||text(equipment.attributes?.docked)==='true'))return null;
  const source=rule.state_entity||rule.entity;
  const condition={...rule,entity:source};
  if(rule.states===undefined&&rule.below===undefined&&rule.above===undefined)condition.states=rule.level==='info'?[...ACTIVE]:[...POSITIVE];
  if(conditionMatches(condition,getState)!==true)return null;
  if(rule.unless&&conditionMatches(rule.unless,getState)!==false)return null;
  const sourceState=getState(source),value=rule.attribute?sourceState?.attributes?.[rule.attribute]:sourceState?.state;const numericDetail=(rule.below!==undefined||rule.above!==undefined)?` · ${value}${sourceState?.attributes?.unit_of_measurement?' '+sourceState.attributes.unit_of_measurement:''}`:'';
  return {level:rule.level||'maintenance',kind:rule.kind||rule.id,detail:(rule.message||rule.label||'À vérifier')+numericDetail,icon:rule.icon||(rule.level==='info'?'mdi:power':rule.level==='priority'?'mdi:alert-circle-outline':'mdi:wrench-outline'),critical:rule.critical===true||rule.level==='priority'&&CRITICAL.has(sourceState?.attributes?.device_class)};
}
export function buildNotices({states={},registry={},rooms=[],apertures=[],rules=[],scope='plan',excludedAreas=[],excludedEntities=[],openingEntities=[],planFloor='',getState=id=>states[id]}){
  const entities=registry.entities||{},devices=registry.devices||{},areas=registry.areas||{},floors=registry.floors||{};
  const areaOf=id=>{const e=entities[id];return e?.area_id||devices[e?.device_id]?.area_id||'';};
  const directRooms=new Map();for(const r of rooms)for(const id of r.entity_ids||[])if(!directRooms.has(id))directRooms.set(id,r);
  const location=(id,rule={})=>{const areaId=areaOf(id),room=rooms.find(r=>r.id===rule.room)||rooms.find(r=>areaId&&r.area_id===areaId)||directRooms.get(id),area=areas[areaId]||areas[room?.area_id],floorId=area?.floor_id||'',floor=floors[floorId];return {room:room?.id||areaId||'unassigned',room_name:room?.name||area?.name||'Pièce non renseignée',area_id:areaId||room?.area_id||'',floor_id:floorId|| (room?'plan':'unassigned'),floor_name:floor?.name||(room?planFloor:'Niveau non renseigné')};};
  const openings=new Set([...apertures.map(a=>a.opening_entity),...openingEntities].filter(Boolean));
  const overrides=new Set(rules.flatMap(r=>[r.entity,...(r.aliases||[])]));
  const wanted=new Set([...directRooms.keys(),...openings]);
  if(scope==='home')for(const e of Object.values(entities)){
    if(e.disabled_by||e.hidden_by)continue;const area=areaOf(e.entity_id),s=states[e.entity_id],cls=s?.attributes?.device_class,domain=e.entity_id.split('.')[0];
    if(!s&&['sensor','binary_sensor'].includes(domain)){getState(e.entity_id);continue;}
    if(excludedAreas.includes(area)||(!area&&!CRITICAL.has(cls)))continue;
    if(['media_player','fan','vacuum'].includes(domain)||domain==='binary_sensor'&&(CRITICAL.has(cls)||['battery','problem','tamper','safety'].includes(cls))||domain==='sensor'&&(cls==='battery'||cls==='enum'&&s?.attributes?.options?.includes('finished')))wanted.add(e.entity_id);
  }
  const result=new Map();
  const add=(id,notice,rule={})=>{
    if(!notice||excludedEntities.includes(id))return;const loc=location(id,rule);if(excludedAreas.includes(loc.area_id))return;
    const deviceId=entities[id]?.device_id||'',device=devices[deviceId],key=(rule.group||deviceId||id)+'|'+notice.kind;
    const item={...notice,key,entity:id,entities:[id],device_id:deviceId,equipment_key:rule.equipment_group||deviceId||rule.group||id,label:rule.label||device?.name_by_user||device?.name||states[id]?.attributes?.friendly_name||id,details:[notice.detail],location:loc};
    const previous=result.get(key);
    if(previous){previous.entities=[...new Set([...previous.entities,id])];previous.details=[...new Set([...previous.details,notice.detail])];previous.critical ||=item.critical;if(noticeOrder(item,previous)<0){previous.level=item.level;previous.entity=id;previous.icon=item.icon;}}
    else result.set(key,item);
  };
  for(const id of wanted){if(overrides.has(id)||excludedEntities.includes(id))continue;const s=getState(id);add(id,baseNotice(s,{opening:openings.has(id)}));}
  const evaluated=rules.map(rule=>({rule,item:ruleNotice(rule,getState)}));const specificActive=new Set(evaluated.filter(({rule,item})=>item&&!rule.fallback_for?.length).map(({rule})=>rule.id));
  for(const {rule,item} of evaluated){if(rule.fallback_for?.some(id=>specificActive.has(id)))continue;add(rule.entity,item,rule);}
  return [...result.values()].sort(noticeOrder);
}
export function groupEquipmentNotices(notices){
  const groups=new Map();
  for(const n of [...notices].sort(noticeOrder)){
    const key=n.equipment_key||n.device_id||n.entity;
    if(!groups.has(key))groups.set(key,{key,label:n.label,entity:n.entity,device_id:n.device_id,location:n.location,level:n.level,critical:n.critical,icon:n.icon,notices:[],entities:[]});
    const g=groups.get(key);g.notices.push(n);g.entities=[...new Set([...g.entities,...n.entities])];
  }
  return [...groups.values()];
}
