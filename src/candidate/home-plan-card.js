/* HA-BOARD Home Plan. Domestic geometry and images belong in private configuration. */
import { LitElement, html, css, unsafeCSS } from 'lit-element';
import { svg, nothing } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import productStyles from './home-plan-card.css';
import { buildNotices, conditionMatches, NOTICE_LEVELS, groupEquipmentNotices } from './home-plan-notices.js';

export const VERSION = '0.4.0-rc.1';
const ENTITY = /^[a-z_]+\.[a-z0-9_]+$/;
const BAD = new Set(['unknown', 'unavailable']);
const ALERT_CLASSES = new Set(['smoke','gas','moisture','problem','tamper','battery','safety']);
const OPEN_CLASSES = new Set(['door','window','opening','garage_door']);
const MODES = [['','home','Pièces'],['lights','lightbulb','Lumières'],['temperature','thermometer','Temp.'],['openings','door-open','Ouvertures'],['covers','blinds','Volets']];
const ICON = {home:'mdi:home-outline',house:'mdi:home-outline',lightbulb:'mdi:lightbulb-outline',thermometer:'mdi:thermometer', 'door-open':'mdi:door-open',blinds:'mdi:blinds-horizontal',sofa:'mdi:sofa-outline',waves:'mdi:pool',sun:'mdi:white-balance-sunny',armchair:'mdi:seat-outline',bath:'mdi:bathtub-outline','washing-machine':'mdi:washing-machine','cooking-pot':'mdi:countertop-outline',utensils:'mdi:silverware-fork-knife','briefcase-business':'mdi:desk','bed-double':'mdi:bed-outline','door-closed':'mdi:door-closed',x:'mdi:close','chevron-right':'mdi:chevron-right','chevron-up':'mdi:chevron-up','chevron-down':'mdi:chevron-down',square:'mdi:stop','shield-check':'mdi:shield-check-outline','circle-alert':'mdi:alert-circle-outline',tv:'mdi:television',bot:'mdi:robot-vacuum',refrigerator:'mdi:fridge-outline','panels-top-left':'mdi:window-closed-variant',smoke:'mdi:smoke-detector-variant',plus:'mdi:plus',settings:'mdi:cog-outline'};
const icon = name => html`<ha-icon icon=${ICON[name] || name || 'mdi:circle-small'} aria-hidden="true"></ha-icon>`;
const copy = value => structuredClone(value);
export function validEntity(id) { return typeof id === 'string' && ENTITY.test(id); }
export function known(state) { return !!state && !BAD.has(state.state); }
export function coverPosition(state) {
  const n = state?.attributes?.current_position;
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
}
export function coverText(state) {
  if (!state) return 'Entité introuvable';
  if (state.state === 'unavailable') return 'Indisponible';
  if (state.state === 'opening') return 'Ouverture…';
  if (state.state === 'closing') return 'Fermeture…';
  const p=coverPosition(state);
  return p===0?'Fermé':p===100?'Ouvert':p!==null?`${p} % ouvert`:state.state==='closed'?'Fermé':state.state==='open'?'Ouvert · position inconnue':'Position inconnue';
}
export function validateConfig(config) {
  if (!config || typeof config !== 'object') throw Error('Configuration du plan requise.');
  const result = copy(config);
  for (const key of ['rooms','apertures','markers','cover_options','cover_groups','notification_rules']) {
    if (result[key]!==undefined && !Array.isArray(result[key])) throw Error(`${key} doit être une liste.`);
    result[key] ||= [];
    if (result[key].length>200) throw Error('Trop d’éléments dans le plan.');
    const seen = new Set();
    for(const item of result[key]){
      const identity=key==='cover_options'?item.entity:item.id;
      if(!identity || typeof identity!=='string' || seen.has(identity)) throw Error(`Identifiant ${key} absent ou dupliqué.`);
      seen.add(identity);
      if(key==='notification_rules'){
        if(!validEntity(item.entity)||!['priority','ready','battery','maintenance','info','ignore'].includes(item.level||'maintenance'))throw Error('Règle de signalement invalide.');
        if(item.fallback_for&&(!Array.isArray(item.fallback_for)||item.fallback_for.some(id=>typeof id!=='string')))throw Error('Règles détaillées invalides.');
        if(item.aliases&&(!Array.isArray(item.aliases)||item.aliases.some(e=>!validEntity(e))))throw Error('Alias de signalement invalide.');
        if(item.unless&&(!validEntity(item.unless.entity)||!Array.isArray(item.unless.states)))throw Error('Exception de signalement invalide.');
        if(item.states&&(!Array.isArray(item.states)||item.states.some(v=>typeof v!=='string')))throw Error('États de signalement invalides.');
        if(['below','above'].some(k=>item[k]!==undefined&&!Number.isFinite(item[k])))throw Error('Seuil de signalement invalide.');
      }
      if(key==='cover_groups'&&item.id==='current')throw Error('Identifiant de groupe réservé.');
      if(key==='cover_options'&&item.max_position!==undefined&&(!Number.isFinite(item.max_position)||item.max_position<1||item.max_position>100))throw Error('Limite de course invalide.');
      for(const [field,value] of Object.entries(item)) if(field.endsWith('_entity') && value && !validEntity(value)) throw Error(`Entité invalide : ${field}`);
      if(item.entity&&!validEntity(item.entity))throw Error('Équipement de repère invalide.');
      if(item.excluded_entities&&(!Array.isArray(item.excluded_entities)||item.excluded_entities.some(e=>!validEntity(e))))throw Error('Liste d’exclusions invalide.');
      if(item.favorite_entities&&(!Array.isArray(item.favorite_entities)||item.favorite_entities.some(e=>!validEntity(e))))throw Error('Liste d’accès rapides invalide.');
      if(item.entities && (!Array.isArray(item.entities)||item.entities.some(e=>!validEntity(e)))) throw Error('Liste d’équipements invalide.');
      if(item.point && (!Array.isArray(item.point)||item.point.length!==2||!item.point.every(Number.isFinite))) throw Error('Position de repère invalide.');
    }
  }
  if(result.notification_scope&&!['plan','home'].includes(result.notification_scope))throw Error('Périmètre de signalements invalide.');
  for(const key of ['notification_excluded_entities','notification_opening_entities'])if(result[key]&&(!Array.isArray(result[key])||result[key].some(e=>!validEntity(e))))throw Error('Liste de signalements invalide.');
  if(result.notification_excluded_areas&&(!Array.isArray(result.notification_excluded_areas)||result.notification_excluded_areas.some(e=>typeof e!=='string')))throw Error('Zones exclues invalides.');
  return result;
}
export function sanitizeArtwork(markup) {
  const doc=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${markup||''}</svg>`,'image/svg+xml');
  if(doc.querySelector('parsererror')) throw Error('Tracé du plan invalide.');
  const tags=new Set(['svg','g','path','rect','line','polyline','polygon','circle','ellipse']);
  const attrs=new Set(['class','d','x','y','x1','x2','y1','y2','width','height','rx','ry','cx','cy','r','points','transform']);
  for(const el of [...doc.documentElement.querySelectorAll('*')]){
    if(!tags.has(el.localName)){el.remove();continue;}
    for(const a of [...el.attributes])if(!attrs.has(a.name))el.removeAttribute(a.name);
  }
  return doc.documentElement.innerHTML;
}
function safeImage(url) { return typeof url==='string' && (/^\/local\//.test(url)||/^data:image\/(jpeg|png|webp);base64,/.test(url)) ? url : ''; }
function validateModel(model) {
  if(!model||!Array.isArray(model.rooms)||model.rooms.length>200)throw Error('Pièces du plan invalides.');
  if(!Array.isArray(model.bounds)||model.bounds.length!==4||!model.bounds.every(Number.isFinite)||model.bounds[2]<=0||model.bounds[3]<=0)throw Error('Dimensions du plan invalides.');
  const seen=new Set();
  for(const r of model.rooms){if(!r.id||seen.has(r.id))throw Error('Identifiant de pièce absent ou dupliqué.');seen.add(r.id);}
  return {...copy(model),artwork:sanitizeArtwork(model.artwork)};
}

export class HomePlanCard extends LitElement {
  static properties={hass:{},editMode:{type:Boolean},_config:{state:true},_model:{state:true},_registry:{state:true},_registryError:{state:true},_selected:{state:true},_quick:{state:true},_view:{state:true},_mode:{state:true},_error:{state:true},_feedback:{state:true},_busy:{state:true},_photoMode:{state:true},_photos:{state:true},_showAlerts:{state:true},_noticeFilter:{state:true},_noticeFloor:{state:true},_noticeRoom:{state:true},_noticeEquipmentKey:{state:true},_floorCovers:{state:true},_floorLights:{state:true},_floorGroup:{state:true},_equipmentTab:{state:true},_editSelection:{state:true}};
  static styles=[unsafeCSS(productStyles),css`
    :host{--ha-card-border-width:0} .hpf-home{max-width:none;border-radius:var(--ha-card-border-radius,24px);box-shadow:none;background:var(--ha-card-background,var(--card-background-color,#fff));--hp-paper:var(--ha-card-background,var(--card-background-color,#fff));--hp-ink:var(--primary-text-color);--hp-secondary:var(--secondary-text-color)}
    ha-icon{--mdc-icon-size:18px;width:18px;height:18px;display:inline-flex;flex-shrink:0}button{cursor:pointer}button:focus-visible{outline:2px solid var(--hp-blue);outline-offset:2px}
    .hpf-home-mark ha-icon{--mdc-icon-size:22px;width:22px;height:22px}.hpf-glance ha-icon{--mdc-icon-size:15px;width:15px;height:15px}.hpf-modebar ha-icon{--mdc-icon-size:19px;width:19px;height:19px}.hpf-cover-actions ha-icon,.hpf-aperture ha-icon{--mdc-icon-size:14px;width:14px;height:14px}
    .hpf-sheet{position:absolute;inset:auto 0 0;border:0;border-top:1px solid var(--hp-line);border-radius:23px 23px 0 0;max-height:95%;overflow-y:auto;margin-top:8px;width:auto}.hpf-sheet-head h3{font-size:19px}.hpf-sheet[hidden]{display:none}
    .hpf-sheet-head{margin-bottom:10px}.hpf-close ha-icon{--mdc-icon-size:20px}.hpf-state{font-size:12px;color:var(--hp-secondary);padding:5px 16px 12px}.hpf-state.is-error{color:var(--error-color,#b3261e)}
    .hpf-cover-caption{flex-wrap:wrap;gap:6px}.hpf-cover-caption span{flex:1;min-width:110px}.hpf-cover-caption output{font-size:12px}.hpf-cover input{min-height:44px;margin:2px 0}.hpf-cover-actions button{min-height:44px}.hpf-room-tile ha-icon{display:block;margin-bottom:8px;--mdc-icon-size:20px}
    .hpf-more{display:flex;width:100%;gap:8px;align-items:center;justify-content:space-between;min-height:44px;text-align:left;border:0;border-bottom:1px solid var(--hp-line);padding:9px 0;background:transparent;font-size:12px}.hpf-more span:last-child{margin-left:auto;text-align:right;color:var(--hp-secondary)}
    .hpf-map .hpf-room-marker{position:absolute;z-index:3;transform:translate(-50%,-50%);display:grid;place-items:center;width:44px;height:44px;border:0;background:transparent;border-radius:10px}.hpf-room-marker ha-icon{background:var(--hp-paper);border-radius:5px;padding:2px;box-sizing:content-box;color:var(--hp-secondary)}.hpf-room-marker.is-alert ha-icon{color:var(--error-color,#b3261e);background:var(--hp-alert-bg)}
    .hpf-room-name .hpf-problem{color:var(--error-color,#b3261e)}.hpf-empty{padding:16px}.hpf-photo-caption ha-icon{width:14px;height:14px;--mdc-icon-size:14px}.hpf-device-grid{grid-template-columns:repeat(auto-fit,minmax(125px,1fr))}.hpf-device ha-icon{width:22px;height:22px;--mdc-icon-size:22px}.hpf-opening strong{white-space:nowrap}.hpf-cover-state{color:var(--hp-blue)}.hpf-footer .hpf-footer-copy{line-height:1.4}.hpf-danger{color:var(--error-color,#b3261e)}
  `];
  constructor(){super();this._config={rooms:[],apertures:[],markers:[]};this._view='plan';this._mode='';this._selected=null;this._quick=null;this._showAlerts=false;this._error='';this._feedback='';this._busy=new Set();this._photoMode=new Set();this._photos={};this._epoch=0;this._unsubs=[];this._pulseTimers=new Set();this._observed=new Set();this._registry={entities:{},devices:{},areas:{},floors:{}};}
  static getConfigElement(){return document.createElement('home-plan-card-editor');}
  static getStubConfig(){return {name:'Maison',floor:'Rez-de-chaussée',rooms:[],apertures:[],markers:[]};}
  setConfig(config){this._commandEpoch=(this._commandEpoch||0)+1;clearTimeout(this._feedbackTimer);this._pulseTimers.forEach(clearTimeout);this._pulseTimers.clear();this._busy=new Set();this._feedback='';this._config=validateConfig(config);this._selected=null;this._quick=null;this._showAlerts=false;this._floorCovers=false;this._floorLights=false;this._equipmentTab=false;this._drag=null;this._error='';this._loadModel();}
  getCardSize(){return 10;}
  getGridOptions(){return {columns:12,rows:'auto',min_columns:6};}
  connectedCallback(){super.connectedCallback();this._epoch++;this._loadModel();this._startRegistry();}
  disconnectedCallback(){this._drag=null;this._epoch++;this._modelRequest?.abort();this._modelRequest=null;this._modelLoading=false;this._registryLoading=false;this._unsubs.splice(0).forEach(fn=>fn());clearTimeout(this._feedbackTimer);this._pulseTimers.forEach(clearTimeout);this._pulseTimers.clear();this._busy=new Set();super.disconnectedCallback();}
  updated(changed){if(changed.has('hass')){this.toggleAttribute('dark',!!this.hass?.themes?.darkMode);if(!this._registryLoaded&&!this._registryLoading)this._startRegistry();}}
  shouldUpdate(changed){if(changed.size===1&&changed.has('hass')){const old=changed.get('hass');if(old&&old.entities===this.hass?.entities&&old.devices===this.hass?.devices&&old.themes===this.hass?.themes&&old.locale===this.hass?.locale&&[...this._observed].every(id=>old.states?.[id]===this.hass?.states?.[id]))return false;}return true;}
  async _loadModel(){
    if(!this.isConnected)return;
    if(this._model&&this._config.model_url&&this._loadedSource===this._config.model_url&&!this._config.model)return;
    this._modelRequest?.abort();const abort=new AbortController();this._modelRequest=abort;const epoch=this._epoch;
    try{
      let model=this._config.model;
      if(!model&&this._config.model_url){const u=new URL(this._config.model_url,location.origin);if(u.origin!==location.origin||!u.pathname.startsWith('/local/'))throw Error('Le plan doit être un fichier local Home Assistant.');const response=await fetch(u,{signal:abort.signal});if(!response.ok)throw Error(`Chargement du plan : HTTP ${response.status}`);const text=await response.text();if(text.length>3_000_000)throw Error('Plan trop volumineux.');model=JSON.parse(text);}
      if(!model)model={bounds:[0,0,100,100],rooms:[],artwork:''};
      const prepared=validateModel(model);if(abort.signal.aborted||epoch!==this._epoch||!this.isConnected)return;this._model=prepared;this._loadedSource=this._config.model_url;this._error='';this.dispatchEvent(new CustomEvent('plan-model-loaded',{detail:{model:prepared},bubbles:true,composed:true}));
    }catch(e){if(e.name!=='AbortError'&&epoch===this._epoch&&this.isConnected)this._error=e.message;}
  }
  async _startRegistry(){
    if(!this.isConnected||!this.hass?.callWS||this._registryLoading)return;
    this._registryLoading=true;const epoch=this._epoch;
    try{
      if(!this._unsubs.length&&this.hass.connection?.subscribeEvents){for(const type of ['entity_registry_updated','device_registry_updated','area_registry_updated','floor_registry_updated']){const fn=await this.hass.connection.subscribeEvents(()=>{this._registryLoaded=false;this._registryDirty=true;this._startRegistry();},type);if(epoch!==this._epoch||!this.isConnected){fn();return;}this._unsubs.push(fn);}}
      this._registryDirty=false;
      const [entities,devices,areas,floors]=await Promise.all(['entity','device','area','floor'].map(k=>this.hass.callWS({type:`config/${k}_registry/list`})));
      if(epoch!==this._epoch||!this.isConnected)return;
      this._registry={entities:Object.fromEntries(entities.map(e=>[e.entity_id,e])),devices:Object.fromEntries(devices.map(d=>[d.id||d.device_id,d])),areas:Object.fromEntries(areas.map(a=>[a.area_id,a])),floors:Object.fromEntries(floors.map(f=>[f.floor_id,f]))};this._registryLoaded=true;this._registryError='';
    }catch{if(epoch===this._epoch){this._registryLoaded=true;this._registryError='Associations automatiques indisponibles · équipements configurés conservés';}}finally{if(epoch===this._epoch){this._registryLoading=false;if(this._registryDirty)this._startRegistry();}}
  }
  _state(id){if(id)this._observed.add(id);return this.hass?.states?.[id];}
  set editorConfig(value){if(value!==this._editorConfig){this._editorConfig=value;this.setConfig(value);}}
  _entityIcon(id,override){return html`<ha-state-icon .hass=${this.hass} .stateObj=${this._state(id)} .icon=${override||this._registry.entities[id]?.icon||undefined} aria-hidden="true"></ha-state-icon>`;}
  _name(id){const s=this._state(id);return s?.attributes?.friendly_name||id;}
  _format(id){const rest=this._config.notification_rules.find(r=>r.idle_label&&(r.entity===id||r.aliases?.includes(id))&&r.unless&&conditionMatches(r.unless,e=>this._state(e))===true);if(rest)return rest.idle_label;const s=this._state(id);if(!s)return 'Entité introuvable';if(s.state==='unavailable')return 'Indisponible';if(s.state==='unknown')return 'Inconnu';if(this.hass?.formatEntityState)return this.hass.formatEntityState(s);return s.state+(s.attributes?.unit_of_measurement?' '+s.attributes.unit_of_measurement:'');}
  _rooms(){const overrides=new Map(this._config.rooms.map(r=>[r.id,r]));return (this._model?.rooms||[]).map(r=>({...r,...overrides.get(r.id)}));}
  _apertures(){const overrides=new Map(this._config.apertures.map(a=>[a.id,a]));return (this._model?.apertures||[]).map(a=>({...a,...overrides.get(a.id)}));}
  _markers(){const overrides=new Map(this._config.markers.map(a=>[a.id,a]));const base=(this._model?.markers||[]).map(a=>({...a,...overrides.get(a.id)}));const ids=new Set(base.map(m=>m.id));return [...base,...this._config.markers.filter(m=>!ids.has(m.id))];}
  _entities(r){
    if(this._roomEntityCache?.has(r.id))return this._roomEntityCache.get(r.id);
    const explicit=[...(r.entities||[]),...(r.favorite_entities||[]),r.temperature_entity,r.light_entity,...this._apertures().filter(a=>a.room===r.id).flatMap(a=>[a.cover_entity,a.opening_entity,a.command_entity]),...this._markers().filter(a=>a.room===r.id).map(a=>a.entity)];
    const reg=this._registry.entities,devices=this._registry.devices;
    if(r.auto_area&&r.area_id)for(const e of Object.values(reg)){if(e.disabled_by||e.hidden_by||e.entity_category||r.excluded_entities?.includes(e.entity_id))continue;const area=e.area_id||devices[e.device_id]?.area_id;if(area!==r.area_id)continue;const d=e.entity_id.split('.')[0];if(['light','cover','fan','climate','vacuum','media_player','sensor','binary_sensor','switch','select','number','button','scene','humidifier','water_heater','lock'].includes(d))explicit.push(e.entity_id);}
    const ids=[...new Set(explicit.filter(validEntity))];ids.forEach(id=>this._observed.add(id));this._roomEntityCache?.set(r.id,ids);return ids;
  }
  _leaves(ids,domain,excluded=[]){const result=new Set(),seen=new Set();const visit=id=>{if(seen.has(id)||excluded.includes(id)||!id.startsWith(domain+'.'))return;seen.add(id);const members=this._state(id)?.attributes?.entity_id;if(Array.isArray(members)&&members.length)members.forEach(visit);else result.add(id);};ids.forEach(visit);return [...result];}
  _lights(r){return this._leaves(this._entities(r),'light',r.excluded_entities).filter(id=>{if(r.entities?.includes(id)||this._markers().some(m=>m.entity===id&&m.room===r.id))return true;const e=this._registry.entities[id],area=e?.area_id||this._registry.devices[e?.device_id]?.area_id;return !r.area_id||!area||area===r.area_id;});}
  _covers(r){return this._leaves(this._entities(r),'cover',r.excluded_entities);}
  _openings(r){return [...new Set(this._apertures().filter(a=>a.room===r.id&&a.opening_entity).map(a=>a.opening_entity))];}
  _temperature(r){return r.temperature_entity||undefined;}
  _notices(rooms=this._rooms()){
    if(this._noticeCache)return this._noticeCache;
    this._noticeCache=buildNotices({states:this.hass?.states,registry:this._registry,rooms:rooms.map(r=>({...r,entity_ids:this._entities(r)})),apertures:this._apertures(),rules:this._config.notification_rules,scope:this._config.notification_scope||'plan',excludedAreas:this._config.notification_excluded_areas,excludedEntities:this._config.notification_excluded_entities,openingEntities:this._config.notification_opening_entities,planFloor:this._config.floor||this._model?.floor,getState:id=>this._state(id)});return this._noticeCache;
  }
  _roomNotices(r,level){return this._notices().filter(n=>n.location.room===r.id&&(!level||n.level===level));}
  _problems(r){return this._roomNotices(r,'priority').filter(n=>n.kind!=='opening').map(n=>n.entity);}
  _markerNotice(m){const device=this._registry.entities[m.entity]?.device_id;return this._notices().find(n=>['priority','battery','maintenance'].includes(n.level)&&(n.entities.includes(m.entity)||device&&n.device_id===device));}
  _markerVisible(m){if(!m.entity||!m.point)return false;if(this.editMode)return true;if(m.noticeGroup)return true;if(m.notification_only)return false;const cls=this._state(m.entity)?.attributes?.device_class;if(['smoke','gas','moisture','carbon_monoxide'].includes(cls))return !!this._markerNotice(m);return !this._mode||this._mode==='openings'&&!m.entity.startsWith('light.')||this._mode==='lights'&&m.entity.startsWith('light.')||this._state(m.entity)?.state==='on';}
  _openNotices(level,opener,room=''){this._noticeEquipmentKey=null;this._opener=opener;this._noticeFilter=level;this._noticeFloor='';this._noticeRoom=room;this._showAlerts=true;this._floorCovers=false;this._floorLights=false;this._focusSheet();}
  _roomNoticeButtons(r){const list=this._roomNotices(r);return list.length?html`<div class="hpf-room-notices">${NOTICE_LEVELS.map(level=>{const rows=list.filter(n=>n.level===level);return rows.length?html`<button class=${'hpf-notice-chip '+level} @click=${e=>this._openNotices(level,e.currentTarget,r.id)}>${icon(level==='priority'?'circle-alert':level==='ready'?'mdi:check-circle-outline':level==='battery'?'mdi:battery-alert-variant-outline':level==='maintenance'?'mdi:wrench-outline':'mdi:information-outline')}${rows.length} ${{priority:'priorité',ready:'à récupérer',battery:'pile faible',maintenance:'entretien',info:'en service'}[level]}${rows.length>1&&level==='priority'?'s':''}</button>`:nothing;})}</div>`:nothing;}
  _noticeGroups(){return groupEquipmentNotices(this._notices());}
  _groupForMarker(m,groups=this._noticeGroups()){
    const device=this._registry.entities[m.entity]?.device_id;
    return groups.find(g=>g.entities.includes(m.entity)||device&&g.device_id===device);
  }
  _mapMarkers(rooms){
    const markers=this._markers(),groups=this._noticeGroups(),claimed=new Set(),result=[];
    for(const m of markers){
      const group=m.entity?.startsWith('light.')?null:this._groupForMarker(m,groups);
      if(group&&!this.editMode&&claimed.has(group.key))continue;
      if(group)claimed.add(group.key);
      result.push({...m,noticeGroup:group});
    }
    const perRoom=new Map();
    for(const group of groups){
      if(claimed.has(group.key))continue;
      const r=rooms.find(r=>r.id===group.location.room);if(!r)continue;
      const index=perRoom.get(r.id)||0;perRoom.set(r.id,index+1);
      // This is a notification anchor, not an inferred physical appliance position.
      const unit=this._model.bounds[2]/Math.max(Math.min((this.clientWidth||350)-24,560),250),point=group.level==='info'?[(r.label?.[0]||r.x+r.w/2)+index*32*unit,(r.label?.[1]||r.y+r.h/2)+28]:[r.x+r.w/2+(index%2?1:-1)*25*unit,r.y+30+Math.floor(index/2)*48*unit];
      result.push({id:'notice-'+group.key,room:r.id,entity:group.entity,name:group.label,point,notification_only:true,generated:true,noticeGroup:group});
    }
    return result;
  }
  _openEquipmentNotices(group,opener){this._openNotices(group.level,opener,group.location.room);this._noticeEquipmentKey=group.key;}
  _noticeRow(n){return html`<button data-notice=${n.key} class=${'hpf-notice-row '+n.level+(n.critical?' is-critical':'')} @click=${()=>this._more(n.entity)}>${icon(n.icon)}<span><strong>${n.label}</strong><span class="hpf-notice-reason">${n.details.join(' · ')}</span><small>${n.location.floor_name} · ${n.location.room_name}</small></span>${icon('chevron-right')}</button>`;}
  _noticeSheet(rooms,close){
    if(this._noticeEquipmentKey){const group=this._noticeGroups().find(g=>g.key===this._noticeEquipmentKey);return html`<section class="hpf-sheet hpf-notice-sheet" role="region" aria-label="Signalements de l’appareil" @keydown=${e=>{if(e.key==='Escape')this._close();}}><div class="hpf-sheet-head"><div><h3>${group?.label||'Équipement'}</h3><span class="hpf-sheet-sub">${group?`${group.notices.length} signalement${group.notices.length>1?'s':''} · ${group.location.room_name}`:'Plus aucun signalement en cours'}</span></div>${close()}</div><div class="hpf-notice-list">${group?.notices.map(n=>this._noticeRow(n))}</div><button class="hpf-quick-room" @click=${e=>this._openNotices('priority',e.currentTarget)}>Tous les signalements${icon('chevron-right')}</button></section>`;}

    const all=this._notices(rooms),floor=this._noticeFloor||'',room=this._noticeRoom||'',level=this._noticeFilter||'priority',scoped=all.filter(n=>(!floor||n.location.floor_id===floor)&&(!room||n.location.room===room)),shown=scoped.filter(n=>n.level===level);
    const floors=new Map(all.map(n=>[n.location.floor_id,n.location.floor_name])),roomOptions=new Map(all.filter(n=>!floor||n.location.floor_id===floor).map(n=>[n.location.room,n.location.room_name]));
    if(floor&&!floors.has(floor))floors.set(floor,this._registry.floors?.[floor]?.name||'Niveau sélectionné');if(room&&!roomOptions.has(room))roomOptions.set(room,rooms.find(r=>r.id===room)?.name||'Pièce sélectionnée');
    return html`<section class="hpf-sheet hpf-notice-sheet" role="region" aria-label="Signalements" @keydown=${e=>{if(e.key==='Escape')this._close();}}><div class="hpf-sheet-head"><h3>À suivre</h3>${close()}</div><div class="hpf-notice-tabs" role="group" aria-label="Niveau de signalement">${NOTICE_LEVELS.map(l=>html`<button data-notice-level=${l} aria-pressed=${level===l} @click=${()=>this._noticeFilter=l}>${{priority:'Priorités',ready:'À récupérer',battery:'Piles',maintenance:'Entretien',info:'Infos'}[l]}<span>${scoped.filter(n=>n.level===l).length}</span></button>`)}</div><div class="hpf-notice-filters"><label>Niveau<select aria-label="Niveau de la maison" .value=${floor} @change=${e=>{this._noticeFloor=e.target.value;this._noticeRoom='';}}><option value="">Tous les niveaux</option>${[...floors].map(([id,name])=>html`<option value=${id}>${name}</option>`)}</select></label><label>Pièce<select aria-label="Pièce des signalements" .value=${room} @change=${e=>this._noticeRoom=e.target.value}><option value="">Toutes les pièces</option>${[...roomOptions].map(([id,name])=>html`<option value=${id}>${name}</option>`)}</select></label></div><div class="hpf-notice-list">${shown.map(n=>this._noticeRow(n))}${!shown.length?html`<p class="hpf-empty">Aucun signalement en cours dans cette catégorie.</p>`:nothing}</div></section>`;
  }

  _matches(r){return !this._mode||this._mode==='lights'&&this._lights(r).length||this._mode==='covers'&&this._covers(r).length||this._mode==='temperature'&&this._temperature(r)||this._mode==='openings'&&this._apertures().some(a=>a.room===r.id&&(a.opening_entity||a.command_entity));}
  _status(r){const p=this._problems(r),o=this._openings(r).filter(id=>this._state(id)?.state==='on'),temp=this._temperature(r);if(p.length)return `${p.length} alerte${p.length>1?'s':''}`;if(o.length)return `${o.length} ouverture${o.length>1?'s':''}`;if(temp)return this._format(temp);const c=this._covers(r);return c.length===1?this._coverLabel(c[0]):c.length?`${c.length} volets`:this._entities(r).length?'Équipements de la pièce':'Aucun équipement associé';}
  _photo(r){return safeImage(r.illustration&&!this._photoMode.has(r.id)?r.illustration:r.photos?.[this._photos[r.id]||0]);}
  _more(id){this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}));}
  _select(r,opener){if(this.editMode)return;this._opener=opener;this._selected=r.id;this._quick=null;this._floorCovers=false;this._floorLights=false;this._equipmentTab=false;this._showAlerts=false;this._focusSheet();}
  _aperture(a,opener){if(this.editMode)return;this._opener=opener;this._selected=a.room;this._quick=a.id;this._floorCovers=false;this._floorLights=false;this._showAlerts=false;this._focusSheet();}
  async _focusSheet(){await this.updateComplete;this.renderRoot.querySelector('.hpf-sheet [data-close]')?.focus({preventScroll:true});this.renderRoot.querySelector('.hpf-sheet')?.scrollIntoView({behavior:'auto',block:'nearest'});}
  _close(){this._selected=null;this._quick=null;this._showAlerts=false;this._floorCovers=false;this._floorLights=false;this.updateComplete.then(()=>this._opener?.isConnected&&this._opener.focus({preventScroll:true}));}
  _policy(entity){return (this._config.cover_options||[]).find(p=>p.entity===entity)||{};}
  _coverValue(entity){const p=coverPosition(this._state(entity));return p===null?null:this._policy(entity).invert_position?100-p:p;}
  _coverLabel(entity){const s=this._state(entity),p=this._coverValue(entity);if(this._policy(entity).kind!=='screen'){if(!this._policy(entity).invert_position||!known(s)||p===null)return coverText(s);return p===0?'Fermé':p===100?'Ouvert':`${p} % ouvert`;}if(!known(s)||p===null)return !s?'Entité introuvable':s.state==='unavailable'?'Indisponible':'Déploiement inconnu';return p===0?'Rentré':`${p} % déployé`;}
  _shutters(ids){return [...new Set(ids)].filter(id=>this._policy(id).kind!=='screen'&&!['awning','garage','gate','door'].includes(this._state(id)?.attributes?.device_class));}
  _windowCovers(rooms){return this._shutters(rooms.flatMap(r=>this._covers(r)));}
  _coverGroups(rooms){return [{id:'current',name:this._config.floor||this._model.floor||'Ce niveau',ids:this._windowCovers(rooms)},...(this._config.cover_groups||[]).map(g=>({...g,ids:this._shutters(this._leaves(g.entities||[],'cover'))}))];}


  _lightGroups(rooms){
    const currentFloors=new Set(rooms.map(r=>this._registry.areas[r.area_id]?.floor_id).filter(Boolean));
    const groups=[{id:'current',name:this._config.floor||this._model.floor||'Ce niveau',ids:[...new Set(rooms.flatMap(r=>this._lights(r)))]}];
    for(const f of Object.values(this._registry.floors).sort((a,b)=>(a.level??0)-(b.level??0))){
      if(currentFloors.has(f.floor_id))continue;
      const areas=Object.values(this._registry.areas).filter(a=>a.floor_id===f.floor_id),ids=[...new Set(areas.flatMap(a=>this._lights({id:'area-'+a.area_id,area_id:a.area_id,auto_area:true,entities:[],excluded_entities:[]})))];
      if(ids.length)groups.push({id:'floor-'+f.floor_id,name:f.name,ids});
    }
    return groups;
  }
  _haptic(type){if(this.editMode||!this.isConnected)return;const event=new Event('haptic',{bubbles:true,composed:true});event.detail=type;this.dispatchEvent(event);}

  async _batch(ids,action){
    const feature={open_cover:1,close_cover:2,stop_cover:8,turn_on:0,turn_off:0}[action],unique=[...new Set(ids)],available=unique.filter(id=>{const s=this._state(id);return s&&s.state!=='unavailable'&&(!id.startsWith('light.')||known(s))&&!this._busy.has(id)&&(!feature||s.attributes.supported_features&feature);}),epoch=this._epoch,generation=this._commandEpoch;
    if(available.length)this._haptic('light');
    const result=await Promise.all(available.map(id=>this._send(id,id.split('.')[0]+'.'+action,{},false)));
    if(epoch!==this._epoch||generation!==this._commandEpoch||!this.isConnected)return;
    if(result.some(v=>!v))this._haptic('failure');else if(available.length<unique.length)this._haptic('warning');
    this._feedback=`${result.filter(Boolean).length}/${unique.length} commande${unique.length>1?'s':''} envoyée${unique.length>1?'s':''}${unique.length>available.length?' · équipements indisponibles ou non compatibles ignorés':''}${result.some(v=>!v)?' · au moins un échec':''}`;
  }
  async _send(entity,service,data={},haptic=true){
    let [domain,action]=service.split('.');const state=this._state(entity);if(!validEntity(entity)||!state||state.state==='unavailable')return false;
    const allowed={light:['turn_on','turn_off'],cover:['open_cover','close_cover','stop_cover','set_cover_position'],switch:['turn_on','turn_off']};if(!allowed[domain]?.includes(action)||entity.split('.')[0]!==domain)throw Error('Commande non autorisée.');
    if(domain==='cover'){const policy=this._policy(entity),limit=policy.max_position||100;if(action==='open_cover'&&(limit<100||policy.invert_position)){action='set_cover_position';data={position:limit};}if(action==='close_cover'&&policy.invert_position){action='set_cover_position';data={position:0};}if(action==='set_cover_position'){const p=Number(data.position);if(!Number.isFinite(p))return false;const logical=Math.max(0,Math.min(limit,p));data={...data,position:policy.invert_position?100-logical:logical};}const bit={open_cover:1,close_cover:2,stop_cover:8,set_cover_position:4}[action];if(!(state.attributes.supported_features&bit))return false;}
    if(this._busy.has(entity)||this.editMode)return false;if(haptic)this._haptic('light');const epoch=this._epoch,generation=this._commandEpoch;this._busy=new Set([...this._busy,entity]);this._feedback='Envoi de la commande…';clearTimeout(this._feedbackTimer);
    try{await this.hass.callService(domain,action,data,{entity_id:entity});if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected)this._feedback=domain==='switch'?'Impulsion envoyée · état physique non suivi':'Commande envoyée · état affiché selon le retour de l’équipement';return true;}
    catch(e){if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected){if(haptic)this._haptic('failure');this._feedback='Échec de la commande : '+(e.message||String(e));}return false;}
    finally{if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected){if(domain==='switch'){const timer=setTimeout(()=>{this._pulseTimers.delete(timer);if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected)this._busy=new Set([...this._busy].filter(id=>id!==entity));},2000);this._pulseTimers.add(timer);}else this._busy=new Set([...this._busy].filter(id=>id!==entity));this._feedbackTimer=setTimeout(()=>{this._feedback='';},7000);}}
  }
  _cover(entity,name){
    const s=this._state(entity),p=this._coverValue(entity),f=s?.attributes?.supported_features||0,policy=this._policy(entity),screen=policy.kind==='screen',max=policy.max_position||100,disabled=!s||s.state==='unavailable'||this._busy.has(entity);
    return html`<div class="hpf-cover" data-entity=${entity}><div class="hpf-cover-caption">${this._entityIcon(entity,screen?'mdi:projector-screen-outline':undefined)}<span>${name||this._name(entity)}</span><output>${this._coverLabel(entity)}</output><button class="hpf-cover-info" aria-label=${'Détails de '+this._name(entity)} @click=${()=>this._more(entity)}>${icon('settings')}</button></div><div class="hpf-position-control"><span class=${'hpf-cover-preview '+(screen?'is-screen':'')} style=${`--closed:${p===null?50:100-p}%`} aria-hidden="true"></span><div><input aria-label=${(screen?'Déploiement de ':'Fermeture de ')+(name||this._name(entity))} type="range" min="0" max=${screen?max:100} aria-valuetext=${this._coverLabel(entity)} .value=${String(p===null?50:screen?p:100-p)} ?disabled=${disabled||p===null||!(f&4)} @change=${e=>this._send(entity,'cover.set_cover_position',{position:screen?Number(e.target.value):100-Number(e.target.value)})}><div class="hpf-range-labels"><span>${screen?'Rentré':'Ouvert'}</span><span>${screen?`Course limitée à ${max} %`:'Fermé'}</span></div></div></div><div class="hpf-cover-actions"><button ?disabled=${disabled||!(f&(max<100||policy.invert_position?4:1))} @click=${()=>this._send(entity,'cover.open_cover')}>${icon(screen?'chevron-down':'chevron-up')}${screen?'Déployer':'Ouvrir'}</button><button ?disabled=${disabled||!(f&8)} @click=${()=>this._send(entity,'cover.stop_cover')}>${icon('square')}Arrêter</button><button ?disabled=${disabled||!(f&(policy.invert_position?4:2))} @click=${()=>this._send(entity,'cover.close_cover')}>${icon(screen?'chevron-up':'chevron-down')}${screen?'Rentrer':'Fermer'}</button></div></div>`;
  }
  _groupControls(ids,label,domain='cover'){
    if(ids.length<2)return nothing;
    const actions=domain==='light'?[['turn_on','Tout allumer','lightbulb'],['turn_off','Tout éteindre','lightbulb']]:[['open_cover','Tout ouvrir','chevron-up'],['stop_cover','Tout arrêter','square'],['close_cover','Tout fermer','chevron-down']];
    return html`<div class="hpf-group" data-group=${domain}><div class="hpf-group-caption"><strong>${label}</strong><span>${ids.length} ${domain==='light'?'lumières':'volets'}</span></div><div class=${'hpf-group-actions '+(domain==='light'?'two':'')}>${actions.map(([action,label,i])=>html`<button ?disabled=${ids.every(id=>{const s=this._state(id);return !s||s.state==='unavailable'||this._busy.has(id);})} @click=${()=>this._batch(ids,action)}>${icon(i)}${label}</button>`)}</div></div>`;
  }
  _opening(entity,name){const s=this._state(entity);return html`<div class=${'hpf-opening '+(s?.state==='on'?'is-open':'')}>${this._entityIcon(entity)}<span>${name||this._name(entity)}</span><strong>${known(s)?s.state==='on'?'Ouverte':'Fermée':s?.state==='unavailable'?'Indisponible':'État inconnu'}</strong></div>`;}
  _light(id){const s=this._state(id);return html`<button class=${'hpf-device '+(s?.state==='on'?'is-lit':'')} data-light=${id} ?disabled=${!known(s)||this._busy.has(id)} aria-pressed=${s?.state==='on'} @click=${()=>this._send(id,s.state==='on'?'light.turn_off':'light.turn_on')}>${this._entityIcon(id)}<span><strong>${this._name(id)}</strong><small>${this._format(id)}</small></span></button>`;}
  _equipment(id){return html`<button class="hpf-more" data-equipment=${id} @click=${()=>this._more(id)}>${this._entityIcon(id)}<span>${this._name(id)}</span><span>${this._format(id)}</span></button>`;}
  _equipmentGroups(r){
    const groups=new Map();
    for(const id of this._entities(r)){
      const e=this._registry.entities[id],d=this._registry.devices[e?.device_id],key=d?.id||d?.device_id||((id.startsWith('light.')||id.startsWith('scene.'))?id.split('.')[0]:id),name=d?.name_by_user||d?.name||(key==='light'?'Éclairages':key==='scene'?'Scènes':this._name(id));
      if(!groups.has(key))groups.set(key,{key,name,ids:[]});groups.get(key).ids.push(id);
    }
    return html`<div class="hpf-equipment-groups">${[...groups.values()].sort((a,b)=>a.name.localeCompare(b.name)).map(g=>html`<details class="hpf-equipment-group"><summary>${this._entityIcon(g.ids[0])}<span><strong>${g.name}</strong><small>${g.ids.length} information${g.ids.length>1?'s':''}</small></span>${icon('chevron-down')}</summary>${g.ids.map(id=>this._equipment(id))}</details>`)}</div>`;
  }
  _sheet(rooms){
    const r=rooms.find(r=>r.id===this._selected),a=this._apertures().find(a=>a.id===this._quick);
    const close=()=>html`<button class="hpf-close" data-close aria-label="Revenir au plan" @click=${this._close}>${icon('x')}</button>`;
    if(this._floorCovers||this._floorLights){const lights=this._floorLights,groups=lights?this._lightGroups(rooms):this._coverGroups(rooms),group=groups.find(g=>g.id===this._floorGroup)||groups[0],ids=group.ids;return html`<section class="hpf-sheet" role="region" aria-label=${lights?'Lumières du niveau':'Volets du niveau'} @keydown=${e=>{if(e.key==='Escape')this._close();}}><div class="hpf-sheet-head"><div><h3>${lights?'Lumières':'Volets'}</h3><span class="hpf-sheet-sub">${ids.length} ${lights?'lumières':'volets'}</span></div>${close()}</div>${groups.length>1?html`<label class="hpf-level-picker">Niveau<select aria-label=${lights?'Niveau des lumières':'Niveau des volets'} .value=${group.id} @change=${e=>this._floorGroup=e.target.value}>${groups.map(g=>html`<option value=${g.id}>${g.name}</option>`)}</select></label>`:nothing}${this._groupControls(ids,group.name,lights?'light':'cover')}${lights?html`<div class="hpf-device-grid">${repeat(ids,id=>id,id=>this._light(id))}</div>`:ids.map(id=>this._cover(id))}${!ids.length?html`<p class="hpf-empty">Aucun équipement associé à ce niveau.</p>`:nothing}</section>`;}


    if(this._showAlerts)return this._noticeSheet(rooms,close);
    if(!r)return nothing;
    const covered=a?.cover_entity?[a.cover_entity]:this._covers(r),opening=a?.opening_entity?[a.opening_entity]:this._openings(r),lights=this._lights(r),photo=this._photo(r),shutters=this._windowCovers([r]);
    const favorite=(r.favorite_entities||this._entities(r).filter(id=>['fan','vacuum','media_player','climate'].includes(id.split('.')[0])).slice(0,3));
    return html`<section class="hpf-sheet" role="region" aria-label=${a?.name||r.name} @keydown=${e=>{if(e.key==='Escape')this._close();}}><div class="hpf-sheet-head"><div><h3>${a?.name||r.name}</h3><span class="hpf-sheet-sub">${a?r.name:this._temperature(r)?this._format(this._temperature(r)):this._config.floor||this._model?.floor||''}</span></div>${close()}</div>
      ${!a?this._roomNoticeButtons(r):nothing}
      ${!a?html`<div class="hpf-sheet-tabs" role="group" aria-label="Vue de la pièce"><button aria-pressed=${!this._equipmentTab} @click=${()=>this._equipmentTab=false}>Commandes</button><button aria-pressed=${!!this._equipmentTab} @click=${()=>this._equipmentTab=true}>Équipements</button></div>`:nothing}
      ${!a&&this._equipmentTab?this._equipmentGroups(r):html`
        ${!a&&photo?html`<div class="hpf-room-photo"><img src=${photo} alt=${(r.illustration&&!this._photoMode.has(r.id)?'Illustration de ':'Photo de ')+r.name}>${r.illustration?html`<button class="hpf-photo-style" @click=${()=>{const set=new Set(this._photoMode);set.has(r.id)?set.delete(r.id):set.add(r.id);this._photoMode=set;}}>${this._photoMode.has(r.id)?'Voir l’illustration':'Voir la photo'}</button>`:nothing}${r.photos?.length>1&&this._photoMode.has(r.id)?html`<button class="hpf-photo-next" @click=${()=>this._photos={...this._photos,[r.id]:((this._photos[r.id]||0)+1)%r.photos.length}}>${(this._photos[r.id]||0)+1} / ${r.photos.length}</button>`:nothing}</div>`:nothing}
        ${!a?this._groupControls(lights,'Éclairages','light'):nothing}
        ${!a&&lights.length?html`<div class="hpf-device-grid">${repeat(lights,id=>id,id=>this._light(id))}</div>`:nothing}
        ${!a?this._groupControls(shutters,'Volets de la pièce'):nothing}
        ${repeat(covered,id=>id,id=>this._cover(id))}${opening.map(id=>this._opening(id))}
        ${a?.command_entity?html`<div class="hpf-cover"><div class="hpf-cover-caption">${this._entityIcon(a.command_entity)}<span>Porte motorisée</span></div><p class="hpf-sheet-sub">État physique non suivi · commande par impulsion</p><button class="hpf-device" data-command=${a.command_entity} ?disabled=${!this._state(a.command_entity)||this._state(a.command_entity)?.state==='unavailable'||this._busy.has(a.command_entity)} @click=${()=>this._send(a.command_entity,'switch.turn_on')}>${icon('door-open')}Actionner la porte</button><button class="hpf-more" @click=${()=>this._more(a.command_entity)}>${icon('settings')}Détails de l’équipement${icon('chevron-right')}</button></div>`:nothing}
        ${!a?html`<div class="hpf-favorites">${favorite.map(id=>this._equipment(id))}</div>`:html`<button class="hpf-quick-room" @click=${e=>this._select(r,e.currentTarget)}>${icon(r.icon)}Voir la pièce${icon('chevron-right')}</button>`}
      `}
      ${!this._entities(r).length?html`<p class="hpf-empty">Aucun équipement associé. Ajoutez-les dans l’éditeur de la carte.</p>`:nothing}
    </section>`;
  }
  _markerTap(m){if(this.editMode)return;const s=this._state(m.entity);if(m.entity?.startsWith('light.')&&known(s))this._send(m.entity,s.state==='on'?'light.turn_off':'light.turn_on');else this._more(m.entity);}
  _editPick(kind,item){this._editSelection=kind+':'+item.id;this.dispatchEvent(new CustomEvent('plan-item-selected',{detail:{kind,id:item.id,room:item.room},bubbles:true,composed:true}));}
  _dragStart(e,kind,item){if(!this.editMode||e.button>0)return;e.preventDefault();this._editPick(kind,item);const el=e.currentTarget;el.setPointerCapture(e.pointerId);this._drag={id:item.id,kind,el,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,originalStyle:el.getAttribute('style'),moved:false};}
  _dragMove(e){const d=this._drag;if(!d||d.pointerId!==e.pointerId)return;const box=this.renderRoot.querySelector('.hpf-map').getBoundingClientRect(),b=this._model.bounds;d.moved ||= Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>3;if(!d.moved)return;const x=Math.max(22,Math.min(box.width-22,e.clientX-box.left)),y=Math.max(22,Math.min(box.height-22,e.clientY-box.top));d.point=[Math.round(b[0]+x/box.width*b[2]),Math.round(b[1]+y/box.height*b[3])];d.el.style.left=x/box.width*100+'%';d.el.style.top=y/box.height*100+'%';}
  _dragEnd(e,cancel=false){const d=this._drag;if(!d||d.pointerId!==e.pointerId)return;this._drag=null;if(d.el.hasPointerCapture(e.pointerId))d.el.releasePointerCapture(e.pointerId);if(d.moved&&!cancel)this.dispatchEvent(new CustomEvent('plan-position-changed',{detail:{kind:d.kind,id:d.id,point:d.point},bubbles:true,composed:true}));else if(cancel)d.el.setAttribute('style',d.originalStyle);}
  _editKey(e,kind,item){if(!this.editMode)return;const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!delta)return;e.preventDefault();this._editPick(kind,item);const p=kind==='marker'?item.point:item.control||[(item.segment[0]+item.segment[2])/2,(item.segment[1]+item.segment[3])/2],b=this._model.bounds,step=e.shiftKey?1:5;this.dispatchEvent(new CustomEvent('plan-position-changed',{detail:{kind,id:item.id,point:p.map((v,i)=>Math.max(b[i],Math.min(b[i]+b[i+2],v+delta[i]*step)))},bubbles:true,composed:true}));}
  _map(rooms){
    const b=this._model.bounds,apertures=this._apertures(),markers=this._mapMarkers(rooms),pct=(v,i)=>(v-b[i])/b[i+2]*100;
    const pointStyle=p=>`left:clamp(22px,${pct(p[0],0)}%,calc(100% - 22px));top:${pct(p[1],1)}%`;
    const selected=rooms.find(r=>r.id===this._selected)||rooms.find(r=>r.id===this._model.preview?.room);
    return html`<div class=${'hpf-map '+(this.editMode?'is-editing':'')} style=${`aspect-ratio:${b[2]}/${b[3]}`}>
      <svg class="hpf-drawing" viewBox=${b.join(' ')} role="img" aria-label=${'Plan du '+(this._config.floor||this._model.floor||'niveau')}><title>Pièces et équipements</title>${rooms.map(r=>svg`<path class=${`hpf-room-floor ${this._lights(r).some(id=>this._state(id)?.state==='on')?'is-lit':''} ${r.id===this._selected?'is-selected':''} ${this._matches(r)?'':'is-muted'}`} d=${r.path||''}/>`)}${unsafeSVG(this._model.artwork)}</svg>
      ${repeat(rooms,r=>r.id,r=>{const [x,y,w,h]=r.hit||[r.x,r.y,r.w,r.h],l=r.label||[x+w/2,y+h/2],temp=this._temperature(r),opens=this._openings(r).some(id=>this._state(id)?.state==='on'),problems=this._problems(r);return html`<button class=${`hpf-zone ${opens?'has-opening':''} ${this._matches(r)?'':'is-muted'}`} style=${`left:${pct(x,0)}%;top:${pct(y,1)}%;width:${w/b[2]*100}%;height:${h/b[3]*100}%`} aria-label=${r.name+', '+this._status(r)} aria-pressed=${r.id===this._selected} @click=${e=>this._select(r,e.currentTarget)}><span class="hpf-room-name" ?hidden=${r.hide_label} style=${`left:${(l[0]-x)/w*100}%;top:${(l[1]-y)/h*100}%`}><strong><span class="hpf-name-full">${r.short||r.name}</span><span class="hpf-name-micro">${r.micro||r.short||r.name}</span>${opens||problems.length?html`<span class=${'hpf-room-alert '+(problems.length?'hpf-problem':'')}>!</span>`:nothing}</strong>${temp?html`<small>${this._format(temp)}</small>`:this._lights(r).some(id=>this._state(id)?.state==='on')?html`<span class="hpf-dot"></span>`:nothing}</span></button>`;})}
      <svg class="hpf-aperture-layer" viewBox=${b.join(' ')} aria-hidden="true">${apertures.map(a=>{const s=a.segment;if(!s||s.length!==4)return nothing;const p=`M${s[0]} ${s[1]}L${s[2]} ${s[3]}`,o=this._state(a.opening_entity),c=this._state(a.cover_entity),pos=this._coverValue(a.cover_entity),vertical=s[0]===s[2],shift=vertical?-12:12,parallel=`M${s[0]+(vertical?shift:0)} ${s[1]+(vertical?0:shift)}L${s[2]+(vertical?shift:0)} ${s[3]+(vertical?0:shift)}`;return svg`${o?.state==='on'?svg`<path class="aperture-halo" d=${p}/>`:nothing}<path class=${'aperture-line '+(o?.state==='on'?'is-open':'')} d=${p} data-map-aperture=${a.cover_entity||a.command_entity||a.opening_entity?a.id:nothing} @click=${e=>this._aperture(a,this.renderRoot.querySelector(`[data-aperture="${CSS.escape(a.id)}"]`))}/>${a.leaf?svg`${a.show_swing===false?nothing:svg`<path class=${'aperture-swing '+(o?.state==='on'?'is-open':'')} d=${`M${s[2]} ${s[3]}Q${a.leaf[2]} ${s[3]} ${a.leaf[2]} ${a.leaf[3]}`}/>`}<path class=${'aperture-leaf '+(o?.state==='on'?'is-open':'')} d=${o?.state==='on'?`M${a.leaf[0]} ${a.leaf[1]}L${a.leaf[2]} ${a.leaf[3]}`:p}/>`:nothing}${a.cover_entity?svg`<path class="shutter-track" d=${parallel}/>${pos!==null?svg`<path class="shutter-fill" d=${parallel} pathLength="100" stroke-dasharray=${`${100-pos} 100`}/>`:nothing}${this._mode==='covers'&&a.control?svg`<path class="aperture-leader" d=${`M${(s[0]+s[2])/2} ${(s[1]+s[3])/2}L${a.control[0]} ${a.control[1]}`}/>`:nothing}`:nothing}`;})}</svg>
      ${apertures.filter(a=>a.cover_entity||a.command_entity||a.opening_entity).map(a=>{const p=a.control||[(a.segment[0]+a.segment[2])/2,(a.segment[1]+a.segment[3])/2],o=this._state(a.opening_entity),c=this._state(a.cover_entity),r=rooms.find(r=>r.id===a.room);return html`<button data-aperture=${a.id} class=${`hpf-aperture ${a.cover_entity?'has-cover':''} ${this._mode==='covers'?'show-value':''} ${o?.state==='on'?'is-open':''} ${r&&this._matches(r)?'':'is-muted'}`} style=${pointStyle(p)} aria-label=${a.name+(a.cover_entity?', '+this._coverLabel(a.cover_entity):'')} @pointerdown=${e=>this._dragStart(e,'aperture',a)} @pointermove=${this._dragMove} @pointerup=${e=>this._dragEnd(e)} @pointercancel=${e=>this._dragEnd(e,true)} @keydown=${e=>this._editKey(e,'aperture',a)} @click=${e=>this._aperture(a,e.currentTarget)} data-edit-selected=${this._editSelection==='aperture:'+a.id}><span class="hpf-aperture-mark">${icon(a.cover_entity?'blinds':o?.state==='off'?'door-closed':'door-open')}${a.cover_entity?html`<span>${this._coverValue(a.cover_entity)===0?'Fermé':this._coverValue(a.cover_entity)===100?'Ouvert':this._coverValue(a.cover_entity)!==null?this._coverValue(a.cover_entity)+' %':'?'}</span>`:nothing}</span></button>`;})}
      ${markers.filter(m=>this._markerVisible(m)).map(m=>{const state=this._state(m.entity),light=m.entity.startsWith('light.'),group=m.noticeGroup,level=group?.level,alert=level==='priority';return html`<button data-marker=${m.id} data-equipment-notice=${group?.key||nothing} data-edit-selected=${this._editSelection==='marker:'+m.id} class=${'hpf-room-marker '+(alert?'is-alert ':'')+(group?'hpf-equipment-notice '+level+' ':'')+(group?.critical?'is-critical ':'')+(light?'is-light ':'')+(light&&state?.state==='on'?'is-on':'')} style=${pointStyle(m.point)} aria-label=${group?`${m.name||group.label}, ${group.notices.length} signalement${group.notices.length>1?'s':''} : ${group.notices.map(n=>n.details.join(', ')).join('; ')}`:this._name(m.entity)+', '+this._format(m.entity)} @pointerdown=${e=>this._dragStart(e,'marker',m)} @pointermove=${this._dragMove} @pointerup=${e=>this._dragEnd(e)} @pointercancel=${e=>this._dragEnd(e,true)} @keydown=${e=>this._editKey(e,'marker',m)} @click=${e=>group&&!this.editMode?this._openEquipmentNotices({...group,label:m.name||group.label},e.currentTarget):this._markerTap(m)}>${this._entityIcon(m.entity,m.icon&&m.icon!=='smoke'?ICON[m.icon]||m.icon:group?.icon)}${group?html`<span class="hpf-notice-count" aria-hidden="true">${group.notices.length}</span>`:nothing}</button>`;})}

      ${!this.editMode&&selected&&this._photo(selected)&&this._model.preview?html`<button class="hpf-photo-shortcut" style=${`left:${pct(this._model.preview.x,0)}%;top:${pct(this._model.preview.y,1)}%;width:${this._model.preview.w/b[2]*100}%;height:${this._model.preview.h/b[3]*100}%`} @click=${e=>this._select(selected,e.currentTarget)}><img src=${this._photo(selected)} alt=${selected.name}><span class="hpf-photo-caption">${selected.short||selected.name}${icon('chevron-right')}</span></button>`:nothing}
    </div>`;
  }
  render(){
    this._observed=new Set();this._roomEntityCache=new Map();this._noticeCache=null;if(!this._model)return html`<ha-card><div class="hpf-empty">${this._error||'Chargement du plan…'}</div></ha-card>`;
    const rooms=this._rooms(),lights=[...new Set(rooms.flatMap(r=>this._lights(r)))].filter(id=>this._state(id)?.state==='on'),openingIds=[...new Set(rooms.flatMap(r=>this._openings(r)))],open=openingIds.filter(id=>this._state(id)?.state==='on'),unknown=openingIds.filter(id=>!known(this._state(id))),problems=[...new Set(rooms.flatMap(r=>this._problems(r)))];
    if(this.editMode)return html`<ha-card><section class="hpf-home hpf-placement">${this._map(rooms)}<div class="hpf-placement-caption">Glisser un repère · flèches du clavier pour ajuster</div></section></ha-card>`;
    return html`<ha-card><section class="hpf-home" aria-label="Plan et commandes de la maison"><header class="hpf-head"><div class="hpf-heading"><span class="hpf-home-mark">${icon('house')}</span><div><h2>${this._config.name||'Maison'}</h2><span class="hpf-floor-name">${this._config.floor||this._model.floor}</span></div></div></header>
      <div class="hpf-tools"><div class="hpf-glance"><button data-light-count aria-pressed=${this._mode==='lights'} @click=${()=>this._mode=this._mode==='lights'?'':'lights'}>${icon('lightbulb')}${lights.length} lumière${lights.length>1?'s':''}</button><button data-open-count aria-pressed=${this._mode==='openings'} @click=${()=>this._mode=this._mode==='openings'?'':'openings'}>${icon('door-open')}${open.length} ouverture${open.length>1?'s':''}${unknown.length?' · '+unknown.length+' ?':''}</button></div><div class="hpf-view" role="group" aria-label="Présentation"><button aria-pressed=${this._view==='plan'} @click=${()=>this._view='plan'}>Plan</button><button aria-pressed=${this._view==='rooms'} @click=${()=>this._view='rooms'}>Pièces</button></div></div>
      <div class="hpf-modebar" role="group" aria-label="Informations sur le plan">${MODES.map(([mode,i,label])=>html`<button data-mode=${mode} aria-pressed=${this._mode===mode} aria-label=${label} @click=${()=>this._mode=mode}>${icon(i)}${mode==='openings'?html`<span class="hpf-mode-long">${label}</span><span class="hpf-mode-short">Ouv.</span>`:label}</button>`)}</div>
      ${this._mode==='lights'?html`<button class="hpf-floor-covers" data-floor-lights @click=${e=>{this._opener=e.currentTarget;this._selected=null;this._quick=null;this._floorLights=true;this._floorCovers=false;this._floorGroup='current';this._showAlerts=false;this._focusSheet();}}>${icon('lightbulb')}Toutes les lumières du niveau · ${this._lightGroups(rooms)[0].ids.length}${icon('chevron-right')}</button>`:nothing}
      ${this._mode==='covers'?html`<button class="hpf-floor-covers" data-floor-covers @click=${e=>{this._opener=e.currentTarget;this._selected=null;this._quick=null;this._floorCovers=true;this._floorLights=false;this._floorGroup='current';this._showAlerts=false;this._focusSheet();}}>${icon('blinds')}Tous les volets du niveau · ${this._windowCovers(rooms).length}${icon('chevron-right')}</button>`:nothing}
      ${!rooms.length?html`<div class="hpf-empty">Ajoutez un plan local et ses pièces dans l’éditeur de la carte.</div>`:this._view==='plan'?this._map(rooms):html`<div class="hpf-room-grid">${rooms.filter(r=>this._matches(r)).map(r=>html`<button class=${'hpf-room-tile '+(this._problems(r).length?'has-opening':'')} data-room=${r.id} @click=${e=>this._select(r,e.currentTarget)}>${icon(r.icon)}<strong>${r.name}</strong><small>${this._status(r)}</small></button>`)}</div>`}
      ${this._view==='plan'?html`<div class="hpf-map-legend"><span class="opening-key">${icon('door-open')}Ouverture physique</span><span class="cover-key">${icon('blinds')}${this._mode==='covers'?'Volet · % d’ouverture':'Toucher pour commander'}</span></div>`:nothing}
      <footer class="hpf-notice-footer" aria-label="Résumé des signalements"><span class="hpf-footer-copy" aria-live="polite">${!this._notices(rooms).length?unknown.length?`${unknown.length} état${unknown.length>1?'s':''} d’ouverture inconnu${unknown.length>1?'s':''}`:'Rien à signaler':nothing}</span>${NOTICE_LEVELS.map(level=>{const rows=this._notices(rooms).filter(n=>n.level===level);return rows.length?html`<button data-alerts=${level==='priority'?'':nothing} data-notice-summary=${level} class=${'hpf-notice-chip '+level+(rows.some(n=>n.critical)?' is-critical':'')} @click=${e=>this._openNotices(level,e.currentTarget)}>${icon(level==='priority'?'circle-alert':level==='ready'?'mdi:check-circle-outline':level==='battery'?'mdi:battery-alert-variant-outline':level==='maintenance'?'mdi:wrench-outline':'mdi:information-outline')}<span>${{priority:'Alertes',ready:'À récupérer',battery:'Piles',maintenance:'Entretien',info:'Actifs'}[level]}</span><strong>${rows.length}</strong></button>`:nothing;})}</footer>
      ${this._sheet(rooms)}${this._feedback?html`<div class="hpf-state" role="status" aria-live="polite">${this._feedback}</div>`:nothing}${this._registryError?html`<div class="hpf-state">${this._registryError}</div>`:nothing}${this._error?html`<div class="hpf-state is-error" role="alert">${this._error}</div>`:nothing}
    </section></ha-card>`;
  }
}

export class HomePlanCardEditor extends LitElement {
  static properties={hass:{},_config:{state:true},_room:{state:true},_marker:{state:true},_formReady:{state:true},_formError:{state:true},_baseModel:{state:true},_apertureId:{state:true},_coverEdit:{state:true},_noticeDraft:{state:true}};
  static styles=css`:host{display:block} .fields{display:grid;gap:14px}.fields>home-plan-card{width:100%;min-width:0}.fields details{border-top:1px solid var(--divider-color);padding:8px 0}.fields summary{padding:8px 0;cursor:pointer}select,input{box-sizing:border-box;font:inherit;width:100%;min-height:44px;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;padding:8px}label{display:grid;gap:8px}h3{font-size:16px;margin:8px 0}p{font-size:13px;color:var(--secondary-text-color)}.row{display:flex;gap:8px}.row>*{flex:1}button{font:inherit;min-height:44px;border:0;border-radius:8px;padding:8px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}a{color:var(--primary-color)}`;
  constructor(){super();this._config={rooms:[],apertures:[],markers:[]};this._room='';this._marker='';this._formReady=!!customElements.get('ha-form');this._formError='';this._editorEpoch=0;}
  connectedCallback(){super.connectedCallback();const epoch=++this._editorEpoch;this._prepareForm(epoch);}
  disconnectedCallback(){this._editorEpoch++;clearTimeout(this._editorWait);super.disconnectedCallback();}
  async _prepareForm(epoch){
    if(customElements.get('ha-form')){this._formReady=true;return;}
    try{const helpers=await window.loadCardHelpers?.();const tile=helpers?.createCardElement({type:'tile',entity:'sun.sun'});await tile?.constructor.getConfigElement?.();}catch{}
    if(epoch!==this._editorEpoch||!this.isConnected)return;
    const ready=await Promise.race([customElements.whenDefined('ha-form').then(()=>true),new Promise(resolve=>{this._editorWait=setTimeout(()=>resolve(false),6000);})]);clearTimeout(this._editorWait);
    if(epoch===this._editorEpoch&&this.isConnected){this._formReady=ready;this._formError=ready?'':'Éditeur natif indisponible. Fermez puis rouvrez l’éditeur de la carte.';}
  }
  setConfig(config){this._config=validateConfig(config);if(!this._config.rooms.some(r=>r.id===this._room))this._room=this._config.rooms[0]?.id||'';}
  _change(patch){this._config={...this._config,...patch};this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:copy(this._config)},bubbles:true,composed:true}));}
  _roomChange(patch){this._change({rooms:this._config.rooms.map(r=>r.id===this._room?{...r,...patch}:r)});}
  _noticeChange(id,patch){if('entity' in patch&&!validEntity(patch.entity))return;this._change({notification_rules:this._config.notification_rules.map(r=>{if(r.id!==id)return r;const next={...r,...patch};if(next.states===null)next.states=[];for(const k of ['below','above'])if(next[k]===null||next[k]==='')delete next[k];return next;})});}
  _noticeEditor(form){
    const draft=this._noticeDraft||{entity:'',level:'maintenance',label:''};
    return html`<details><summary>Alertes et informations</summary>${form(this._config,[{name:'notification_scope',selector:{select:{options:[{value:'plan',label:'Pièces du plan'},{value:'home',label:'Toutes les zones de la maison'}]}}},{name:'notification_excluded_areas',selector:{area:{multiple:true}}},{name:'notification_excluded_entities',selector:{entity:{multiple:true}}},{name:'notification_opening_entities',selector:{entity:{multiple:true,filter:{domain:'binary_sensor'}}}}],{notification_scope:'Périmètre du résumé',notification_excluded_areas:'Zones à exclure du résumé',notification_excluded_entities:'Équipements à exclure du résumé',notification_opening_entities:'Contacts physiques supplémentaires'},value=>this._change(value))}
      ${this._config.notification_rules.map(rule=>{const source=this.hass?.states[rule.state_entity||rule.entity],options=[...new Set([...(source?.attributes?.options||[]),...(rule.states||[]),source?.state,'on','off','finished','replace','empty','low'].filter(Boolean))],mode=rule.below!==undefined?'below':rule.above!==undefined?'above':'states';return html`<details><summary>${rule.label||this.hass?.states[rule.entity]?.attributes.friendly_name||rule.entity}</summary>${form(rule,[{name:'entity',selector:{entity:{}}},{name:'state_entity',selector:{entity:{}}},{name:'level',selector:{select:{options:[{value:'priority',label:'Priorité'},{value:'ready',label:'À récupérer'},{value:'battery',label:'Piles'},{value:'maintenance',label:'Entretien'},{value:'info',label:'Information'},{value:'ignore',label:'Ne pas signaler'}]}}},{name:'label',selector:{text:{}}},{name:'icon',selector:{icon:{}}}],{icon:'Icône (facultative)',entity:'Équipement',state_entity:'Source de l’état (facultative)',level:'Catégorie',label:'Libellé'},value=>this._noticeChange(rule.id,value))}<label>Condition<select .value=${mode} @change=${e=>{const next={...rule};delete next.states;delete next.below;delete next.above;next[e.target.value]=e.target.value==='states'?['on']:e.target.value==='below'?20:0;this._change({notification_rules:this._config.notification_rules.map(r=>r.id===rule.id?next:r)});}}><option value="states">État précis</option><option value="below">Valeur inférieure ou égale</option><option value="above">Valeur supérieure ou égale</option></select></label>${form(rule,mode==='states'?[{name:'states',selector:{select:{multiple:true,custom_value:true,options}}}]:[{name:mode,selector:{number:{mode:'box',min:-100000,max:100000,step:0.1}}}],{states:'États à signaler',below:'Seuil bas (≤)',above:'Seuil haut (≥)'},value=>this._noticeChange(rule.id,value))}${rule.unless?html`<p>Une exception d’état est configurée et conservée pour cet équipement.</p>`:nothing}<button @click=${()=>this._change({notification_rules:this._config.notification_rules.filter(r=>r.id!==rule.id)})}>Retirer cette règle</button></details>`;})}
      <h3>Ajouter un signalement</h3>${form(draft,[{name:'entity',selector:{entity:{}}},{name:'label',selector:{text:{}}},{name:'level',selector:{select:{options:[{value:'priority',label:'Priorité'},{value:'ready',label:'À récupérer'},{value:'battery',label:'Piles'},{value:'maintenance',label:'Entretien'},{value:'info',label:'Information'}]}}}],{entity:'Équipement',label:'Libellé',level:'Catégorie'},value=>this._noticeDraft=value)}<button ?disabled=${!validEntity(draft.entity)} @click=${()=>{const id='notice-'+Date.now().toString(36);this._change({notification_rules:[...this._config.notification_rules,{...draft,id,states:['on']}]});this._noticeDraft=null;}}>Ajouter la règle</button><p>Seuls les états en cours sont comptés. Les règles modifient ce résumé, sans créer de notification externe ni commander d’équipement.</p></details>`;
  }
  _allMarkers(){const map=new Map((this._baseModel?.markers||[]).map(m=>[m.id,m]));for(const m of this._config.markers)map.set(m.id,{...map.get(m.id),...m});const preview=this.renderRoot.querySelector('home-plan-card');for(const m of preview?._model?preview._mapMarkers(preview._rooms()):[]){if(m.generated&&!map.has(m.id))map.set(m.id,{id:m.id,room:m.room,entity:m.entity,name:m.name,point:m.point,notification_only:true});}return [...map.values()];}
  _allApertures(){const map=new Map((this._baseModel?.apertures||[]).map(m=>[m.id,m]));for(const m of this._config.apertures)map.set(m.id,{...map.get(m.id),...m});return [...map.values()];}
  _markerChange(patch){const merged=this._allMarkers().find(m=>m.id===this._marker);if(!merged)return;this._change({markers:[...this._config.markers.filter(m=>m.id!==this._marker),{...merged,...patch}]});}
  _apertureChange(id,patch){const merged=this._allApertures().find(m=>m.id===id);if(!merged)return;this._change({apertures:[...this._config.apertures.filter(m=>m.id!==id),{...merged,...patch}]});}
  _position(e){e.stopPropagation();const {kind,id,point}=e.detail;if(kind==='marker'){this._marker=id;this._markerChange({point});}else{this._apertureId=id;this._apertureChange(id,{control:point});}}
  _picked(e){e.stopPropagation();this._room=e.detail.room;if(e.detail.kind==='marker'){this._marker=e.detail.id;this._apertureId='';}else{this._apertureId=e.detail.id;this._marker='';}}
  _newMarker(entity){const r=this._config.rooms.find(r=>r.id===this._room),base=this._baseModel?.rooms?.find(x=>x.id===this._room),id='marker-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)),point=copy(r?.label||base?.label||[0,0]);this._change({markers:[...this._config.markers,{id,room:this._room,name:entity?this.hass?.states[entity]?.attributes.friendly_name||entity:'Équipement',point,...(entity?{entity}:{})}]});this._marker=id;this._apertureId='';}
  _placeLights(){const preview=this.renderRoot.querySelector('home-plan-card'),r=preview?._rooms().find(r=>r.id===this._room);if(!r)return;const existing=new Set(this._allMarkers().map(m=>m.entity)),ids=preview._lights(r).filter(id=>!existing.has(id));const markers=ids.map((entity,i)=>({id:'light-'+entity.replaceAll('.','-'),room:r.id,entity,name:preview._name(entity),point:[(r.label?.[0]||r.x+r.w/2)+(i-(ids.length-1)/2)*35,(r.label?.[1]||r.y+r.h/2)-40]}));this._change({markers:[...this._config.markers,...markers]});if(markers.length)this._marker=markers[0].id;}
  render(){
    if(!this._formReady)return html`<p>${this._formError||'Chargement de l’éditeur natif…'}</p>`;
    const r=this._config.rooms.find(r=>r.id===this._room),m=this._allMarkers().find(m=>m.id===this._marker),a=this._allApertures().find(a=>a.id===this._apertureId),cover=this._coverEdit||a?.cover_entity,policy=this._config.cover_options.find(p=>p.entity===cover)||{entity:cover,kind:'shutter',max_position:100};
    const form=(data,schema,labels,change)=>html`<ha-form .hass=${this.hass} .data=${data} .schema=${schema} .computeLabel=${s=>labels[s.name]||s.name} @value-changed=${e=>{e.stopPropagation();change(e.detail.value);}}></ha-form>`;
    return html`<div class="fields">
      <label>Pièce<select .value=${this._room} @change=${e=>{this._room=e.target.value;this._marker='';this._apertureId='';}}><option value="">Choisir une pièce</option>${this._config.rooms.map(r=>html`<option value=${r.id}>${r.name||r.id}</option>`)}</select></label>
      <home-plan-card .editorConfig=${this._config} .hass=${this.hass} .editMode=${true} @plan-model-loaded=${e=>{e.stopPropagation();this._baseModel=e.detail.model;}} @plan-item-selected=${this._picked} @plan-position-changed=${this._position}></home-plan-card>
      ${r?html`<div class="row"><button @click=${()=>this._newMarker()}>Ajouter un repère</button><button @click=${this._placeLights}>Placer les lumières</button></div>
        <label>Repère<select .value=${this._marker} @change=${e=>{this._marker=e.target.value;this._apertureId='';}}><option value="">Choisir sur le plan</option>${this._allMarkers().filter(m=>m.room===r.id).map(m=>html`<option value=${m.id}>${m.name||m.entity||m.id}</option>`)}</select></label>
        ${m?html`${form(m,[{name:'name',selector:{text:{}}},{name:'entity',selector:{entity:{}}},{name:'icon',selector:{icon:{}}},{name:'notification_only',selector:{boolean:{}}}],{name:'Libellé',entity:'Équipement',icon:'Icône personnalisée (facultative)',notification_only:'Afficher seulement si un signalement est actif'},value=>this._markerChange(value))}<div class="row"><label>Position X<input type="number" .value=${String(m.point?.[0]??0)} @change=${e=>this._markerChange({point:[Number(e.target.value),m.point?.[1]||0]})}></label><label>Position Y<input type="number" .value=${String(m.point?.[1]??0)} @change=${e=>this._markerChange({point:[m.point?.[0]||0,Number(e.target.value)]})}></label></div><button @click=${()=>{this._change({markers:this._config.markers.filter(x=>x.id!==m.id),...(this._baseModel?.markers?.some(x=>x.id===m.id)?{markers:[...this._config.markers.filter(x=>x.id!==m.id),{...m,entity:null}]}:{})});this._marker='';}}>Retirer ce repère</button>`:nothing}
        <details><summary>Équipements et zone de la pièce</summary>${form(r,[{name:'name',selector:{text:{}}},{name:'area_id',selector:{area:{}}},{name:'auto_area',selector:{boolean:{}}},{name:'entities',selector:{entity:{multiple:true}}},{name:'favorite_entities',selector:{entity:{multiple:true}}},{name:'excluded_entities',selector:{entity:{multiple:true}}},{name:'temperature_entity',selector:{entity:{filter:{domain:'sensor'}}}},{name:'light_entity',selector:{entity:{filter:{domain:'light'}}}}],{name:'Nom de la pièce',area_id:'Zone Home Assistant',auto_area:'Suivre les équipements de cette zone',entities:'Équipements ajoutés à cette pièce',favorite_entities:'Accès rapides dans la fiche',excluded_entities:'Équipements automatiques à masquer',temperature_entity:'Température ambiante (facultative)',light_entity:'Éclairage principal'},value=>this._roomChange(value))}<p>La température ambiante est explicitement choisie. Les mesures du four, du réfrigérateur et autres appareils restent dans leurs fiches.</p></details>
        <details ?open=${!!a}><summary>Fenêtres et portes</summary><label>Ouverture<select .value=${this._apertureId||''} @change=${e=>{this._apertureId=e.target.value;this._marker='';}}><option value="">Choisir une ouverture</option>${this._allApertures().filter(a=>a.room===r.id).map(a=>html`<option value=${a.id}>${a.name||a.id}</option>`)}</select></label>${a?html`${form(a,[{name:'opening_entity',selector:{entity:{filter:{domain:'binary_sensor'}}}},{name:'cover_entity',selector:{entity:{filter:{domain:'cover'}}}},{name:'command_entity',selector:{entity:{filter:{domain:'switch'}}}}],{opening_entity:'Contact physique',cover_entity:'Volet associé',command_entity:'Commande motorisée'},value=>this._apertureChange(a.id,value))}<div class="row">${[0,1].map((i)=>html`<label>${i?'Position Y':'Position X'}<input type="number" .value=${String(a.control?.[i]??0)} @change=${e=>{const p=copy(a.control||[0,0]);p[i]=Number(e.target.value);this._apertureChange(a.id,{control:p});}}></label>`)}</div>`:nothing}</details>
        <details><summary>Course et type d’un volet / écran</summary>${form({entity:cover},[{name:'entity',selector:{entity:{filter:{domain:'cover'}}}}],{entity:'Volet ou écran'},value=>this._coverEdit=value.entity)}${cover?form(policy,[{name:'kind',selector:{select:{options:[{value:'shutter',label:'Volet'},{value:'screen',label:'Écran de projection'}]}}},{name:'max_position',selector:{number:{min:1,max:100,mode:'box',unit_of_measurement:'%'}}},{name:'invert_position',selector:{boolean:{}}}],{kind:'Type',max_position:'Course maximale depuis cette carte',invert_position:'Inverser le sens de la position'},value=>this._change({cover_options:[...this._config.cover_options.filter(p=>p.entity!==cover),{...policy,...value}]})):nothing}<p>Les écrans sont exclus des commandes de volets groupées. La limite s’applique aux commandes de cette carte.</p></details>
      `:nothing}
      ${this._noticeEditor(form)}
      <details><summary>Groupes de volets par niveau</summary>${this._config.cover_groups.map(g=>html`${form(g,[{name:'name',selector:{text:{}}},{name:'entities',selector:{entity:{multiple:true,filter:{domain:'cover'}}}}],{name:'Nom du niveau',entities:'Volets ou groupes de ce niveau'},value=>this._change({cover_groups:this._config.cover_groups.map(x=>x.id===g.id?{...x,...value}:x)}))}<button @click=${()=>this._change({cover_groups:this._config.cover_groups.filter(x=>x.id!==g.id)})}>Retirer ce niveau</button>`)}<button @click=${()=>this._change({cover_groups:[...this._config.cover_groups,{id:'level-'+Date.now().toString(36),name:'Autre niveau',entities:[]}]})}>Ajouter un niveau</button></details>
      <details><summary>Réglages de la carte</summary><label>Nom de la carte<input .value=${this._config.name||'Maison'} @change=${e=>this._change({name:e.target.value})}></label><label>Fichier du plan<input .value=${this._config.model_url||''} placeholder="/local/maison/plan.json" @change=${e=>this._change({model_url:e.target.value})}></label></details>
      <p>Enregistrer la carte pour conserver les positions. Les associations ci-dessus concernent cette carte ; elles ne déplacent pas les appareils dans les zones HA.</p><a href=${this._config.documentation_url||'https://github.com/smornierHA/ha-board'} target="_blank" rel="noopener noreferrer">Documentation du plan</a>
    </div>`;
  }

}
if(!customElements.get('home-plan-card'))customElements.define('home-plan-card',HomePlanCard);
if(!customElements.get('home-plan-card-editor'))customElements.define('home-plan-card-editor',HomePlanCardEditor);
window.customCards ||= [];
if(!window.customCards.some(c=>c.type==='home-plan-card'))window.customCards.push({type:'home-plan-card',name:'Plan de la maison',description:'Pièces, volets, lumières, ouvertures et équipements',preview:true,documentationURL:'https://github.com/smornierHA/ha-board'});
