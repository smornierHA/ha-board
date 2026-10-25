/* HA-BOARD Home Plan. Domestic geometry and images belong in private configuration. */
import { LitElement, html, css, unsafeCSS } from 'lit-element';
import { svg, nothing } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import productStyles from './home-plan-card.css';

export const VERSION = '0.1.0-rc.2';
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
  for (const key of ['rooms','apertures','markers']) {
    if (result[key]!==undefined && !Array.isArray(result[key])) throw Error(`${key} doit être une liste.`);
    result[key] ||= [];
    if (result[key].length>200) throw Error('Trop d’éléments dans le plan.');
    const seen = new Set();
    for(const item of result[key]){
      if(!item.id || typeof item.id!=='string' || seen.has(item.id)) throw Error(`Identifiant ${key} absent ou dupliqué.`);
      seen.add(item.id);
      for(const [field,value] of Object.entries(item)) if(field.endsWith('_entity') && value && !validEntity(value)) throw Error(`Entité invalide : ${field}`);
      if(item.entity&&!validEntity(item.entity))throw Error('Équipement de repère invalide.');
      if(item.excluded_entities&&(!Array.isArray(item.excluded_entities)||item.excluded_entities.some(e=>!validEntity(e))))throw Error('Liste d’exclusions invalide.');
      if(item.entities && (!Array.isArray(item.entities)||item.entities.some(e=>!validEntity(e)))) throw Error('Liste d’équipements invalide.');
      if(item.point && (!Array.isArray(item.point)||item.point.length!==2||!item.point.every(Number.isFinite))) throw Error('Position de repère invalide.');
    }
  }
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
  static properties={hass:{},_config:{state:true},_model:{state:true},_registry:{state:true},_registryError:{state:true},_selected:{state:true},_quick:{state:true},_view:{state:true},_mode:{state:true},_error:{state:true},_feedback:{state:true},_busy:{state:true},_photoMode:{state:true},_photos:{state:true},_showAlerts:{state:true}};
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
  constructor(){super();this._config={rooms:[],apertures:[],markers:[]};this._view='plan';this._mode='';this._selected=null;this._quick=null;this._showAlerts=false;this._error='';this._feedback='';this._busy=new Set();this._photoMode=new Set();this._photos={};this._epoch=0;this._unsubs=[];this._pulseTimers=new Set();this._observed=new Set();this._registry={entities:{},devices:{},areas:{}};}
  static getConfigElement(){return document.createElement('home-plan-card-editor');}
  static getStubConfig(){return {name:'Maison',floor:'Rez-de-chaussée',rooms:[],apertures:[],markers:[]};}
  setConfig(config){this._commandEpoch=(this._commandEpoch||0)+1;clearTimeout(this._feedbackTimer);this._pulseTimers.forEach(clearTimeout);this._pulseTimers.clear();this._busy=new Set();this._feedback='';this._config=validateConfig(config);this._selected=null;this._quick=null;this._showAlerts=false;this._error='';this._loadModel();}
  getCardSize(){return 10;}
  getGridOptions(){return {columns:12,rows:'auto',min_columns:6};}
  connectedCallback(){super.connectedCallback();this._epoch++;this._loadModel();this._startRegistry();}
  disconnectedCallback(){this._epoch++;this._modelRequest?.abort();this._modelRequest=null;this._modelLoading=false;this._registryLoading=false;this._unsubs.splice(0).forEach(fn=>fn());clearTimeout(this._feedbackTimer);this._pulseTimers.forEach(clearTimeout);this._pulseTimers.clear();this._busy=new Set();super.disconnectedCallback();}
  updated(changed){if(changed.has('hass')){this.toggleAttribute('dark',!!this.hass?.themes?.darkMode);if(!this._registryLoaded&&!this._registryLoading)this._startRegistry();}}
  shouldUpdate(changed){if(changed.size===1&&changed.has('hass')){const old=changed.get('hass');if(old&&old.entities===this.hass?.entities&&old.devices===this.hass?.devices&&old.themes===this.hass?.themes&&old.locale===this.hass?.locale&&[...this._observed].every(id=>old.states?.[id]===this.hass?.states?.[id]))return false;}return true;}
  async _loadModel(){
    if(!this.isConnected)return;
    this._modelRequest?.abort();const abort=new AbortController();this._modelRequest=abort;const epoch=this._epoch;
    try{
      let model=this._config.model;
      if(!model&&this._config.model_url){const u=new URL(this._config.model_url,location.origin);if(u.origin!==location.origin||!u.pathname.startsWith('/local/'))throw Error('Le plan doit être un fichier local Home Assistant.');const response=await fetch(u,{signal:abort.signal});if(!response.ok)throw Error(`Chargement du plan : HTTP ${response.status}`);const text=await response.text();if(text.length>3_000_000)throw Error('Plan trop volumineux.');model=JSON.parse(text);}
      if(!model)model={bounds:[0,0,100,100],rooms:[],artwork:''};
      const prepared=validateModel(model);if(abort.signal.aborted||epoch!==this._epoch||!this.isConnected)return;this._model=prepared;this._error='';
    }catch(e){if(e.name!=='AbortError'&&epoch===this._epoch&&this.isConnected)this._error=e.message;}
  }
  async _startRegistry(){
    if(!this.isConnected||!this.hass?.callWS||this._registryLoading)return;
    this._registryLoading=true;const epoch=this._epoch;
    try{
      if(!this._unsubs.length&&this.hass.connection?.subscribeEvents){for(const type of ['entity_registry_updated','device_registry_updated','area_registry_updated']){const fn=await this.hass.connection.subscribeEvents(()=>{this._registryLoaded=false;this._registryDirty=true;this._startRegistry();},type);if(epoch!==this._epoch||!this.isConnected){fn();return;}this._unsubs.push(fn);}}
      this._registryDirty=false;
      const [entities,devices,areas]=await Promise.all(['entity','device','area'].map(k=>this.hass.callWS({type:`config/${k}_registry/list`})));
      if(epoch!==this._epoch||!this.isConnected)return;
      this._registry={entities:Object.fromEntries(entities.map(e=>[e.entity_id,e])),devices:Object.fromEntries(devices.map(d=>[d.id||d.device_id,d])),areas:Object.fromEntries(areas.map(a=>[a.area_id,a]))};this._registryLoaded=true;this._registryError='';
    }catch{if(epoch===this._epoch){this._registryLoaded=true;this._registryError='Associations automatiques indisponibles · équipements configurés conservés';}}finally{if(epoch===this._epoch){this._registryLoading=false;if(this._registryDirty)this._startRegistry();}}
  }
  _state(id){if(id)this._observed.add(id);return this.hass?.states?.[id];}
  _name(id){const s=this._state(id);return s?.attributes?.friendly_name||id;}
  _format(id){const s=this._state(id);if(!s)return 'Entité introuvable';if(s.state==='unavailable')return 'Indisponible';if(s.state==='unknown')return 'Inconnu';if(this.hass?.formatEntityState)return this.hass.formatEntityState(s);return s.state+(s.attributes?.unit_of_measurement?' '+s.attributes.unit_of_measurement:'');}
  _rooms(){const overrides=new Map(this._config.rooms.map(r=>[r.id,r]));return (this._model?.rooms||[]).map(r=>({...r,...overrides.get(r.id)}));}
  _apertures(){const overrides=new Map(this._config.apertures.map(a=>[a.id,a]));return (this._model?.apertures||[]).map(a=>({...a,...overrides.get(a.id)}));}
  _markers(){const overrides=new Map(this._config.markers.map(a=>[a.id,a]));const base=(this._model?.markers||[]).map(a=>({...a,...overrides.get(a.id)}));const ids=new Set(base.map(m=>m.id));return [...base,...this._config.markers.filter(m=>!ids.has(m.id))];}
  _entities(r){
    if(this._roomEntityCache?.has(r.id))return this._roomEntityCache.get(r.id);
    const explicit=[...(r.entities||[]),r.temperature_entity,r.light_entity,...this._apertures().filter(a=>a.room===r.id).flatMap(a=>[a.cover_entity,a.opening_entity,a.command_entity]),...this._markers().filter(a=>a.room===r.id).map(a=>a.entity)];
    const reg=this._registry.entities,devices=this._registry.devices;
    if(r.auto_area&&r.area_id)for(const e of Object.values(reg)){if(e.disabled_by||e.hidden_by||e.entity_category||r.excluded_entities?.includes(e.entity_id))continue;const area=e.area_id||devices[e.device_id]?.area_id;if(area!==r.area_id)continue;const s=this.hass?.states?.[e.entity_id],d=e.entity_id.split('.')[0],cls=s?.attributes?.device_class;if(['light','cover','fan','climate','vacuum','media_player'].includes(d)||d==='sensor'&&['temperature','humidity','battery','power','energy','carbon_dioxide','volatile_organic_compounds'].includes(cls)||d==='binary_sensor'&&(OPEN_CLASSES.has(cls)||ALERT_CLASSES.has(cls)))explicit.push(e.entity_id);}
    const ids=[...new Set(explicit.filter(validEntity))];ids.forEach(id=>this._observed.add(id));this._roomEntityCache?.set(r.id,ids);return ids;
  }
  _lights(r){const ids=this._entities(r).filter(e=>e.startsWith('light.'));const members=new Set(ids.flatMap(id=>this._state(id)?.attributes?.entity_id||[]));return ids.filter(id=>!members.has(id));}
  _covers(r){return this._entities(r).filter(e=>e.startsWith('cover.'));}
  _openings(r){return [...new Set(this._apertures().filter(a=>a.room===r.id&&a.opening_entity).map(a=>a.opening_entity))];}
  _temperature(r){return r.temperature_entity||this._entities(r).find(id=>this._state(id)?.attributes?.device_class==='temperature'&&id.startsWith('sensor.'));}
  _problems(r){return this._entities(r).filter(id=>{const s=this._state(id),cls=s?.attributes?.device_class;return known(s)&&(id.startsWith('binary_sensor.')&&ALERT_CLASSES.has(cls)&&s.state==='on'||id.startsWith('sensor.')&&cls==='battery'&&Number(s.state)<=20);});}
  _matches(r){return !this._mode||this._mode==='lights'&&this._lights(r).some(id=>this._state(id)?.state==='on')||this._mode==='covers'&&this._covers(r).length||this._mode==='temperature'&&this._temperature(r)||this._mode==='openings'&&this._openings(r).some(id=>this._state(id)?.state==='on');}
  _status(r){const p=this._problems(r),o=this._openings(r).filter(id=>this._state(id)?.state==='on'),temp=this._temperature(r);if(p.length)return `${p.length} alerte${p.length>1?'s':''}`;if(o.length)return `${o.length} ouverture${o.length>1?'s':''}`;if(temp)return this._format(temp);const c=this._covers(r);return c.length===1?coverText(this._state(c[0])):c.length?`${c.length} volets`:this._entities(r).length?'Équipements de la pièce':'Aucun équipement associé';}
  _photo(r){return safeImage(r.illustration&&!this._photoMode.has(r.id)?r.illustration:r.photos?.[this._photos[r.id]||0]);}
  _more(id){this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}));}
  _select(r,opener){this._opener=opener;this._selected=r.id;this._quick=null;this._showAlerts=false;this._focusSheet();}
  _aperture(a,opener){this._opener=opener;this._selected=a.room;this._quick=a.id;this._showAlerts=false;this._focusSheet();}
  async _focusSheet(){await this.updateComplete;this.renderRoot.querySelector('.hpf-sheet [data-close]')?.focus({preventScroll:true});this.renderRoot.querySelector('.hpf-sheet')?.scrollIntoView({behavior:'auto',block:'nearest'});}
  _close(){this._selected=null;this._quick=null;this._showAlerts=false;this.updateComplete.then(()=>this._opener?.isConnected&&this._opener.focus({preventScroll:true}));}
  async _send(entity,service,data={}){
    const [domain,action]=service.split('.');const state=this._state(entity);if(!validEntity(entity)||!state||state.state==='unavailable')return;
    const allowed={light:['turn_on','turn_off'],cover:['open_cover','close_cover','stop_cover','set_cover_position'],switch:['turn_on','turn_off']};if(!allowed[domain]?.includes(action)||entity.split('.')[0]!==domain)throw Error('Commande non autorisée.');
    if(this._busy.has(entity))return;const epoch=this._epoch,generation=this._commandEpoch;this._busy=new Set([...this._busy,entity]);this._feedback='Envoi de la commande…';clearTimeout(this._feedbackTimer);
    try{await this.hass.callService(domain,action,data,{entity_id:entity});if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected)this._feedback=domain==='switch'?'Impulsion envoyée · état physique non suivi':'Commande envoyée · état affiché selon le retour de l’équipement';}
    catch(e){if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected)this._feedback='Échec de la commande : '+(e.message||String(e));}
    finally{if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected){if(domain==='switch'){const timer=setTimeout(()=>{this._pulseTimers.delete(timer);if(epoch===this._epoch&&generation===this._commandEpoch&&this.isConnected)this._busy=new Set([...this._busy].filter(id=>id!==entity));},2000);this._pulseTimers.add(timer);}else this._busy=new Set([...this._busy].filter(id=>id!==entity));this._feedbackTimer=setTimeout(()=>{this._feedback='';},7000);}}
  }
  _cover(entity,name){const s=this._state(entity),p=coverPosition(s),f=s?.attributes?.supported_features||0,disabled=!s||s.state==='unavailable'||this._busy.has(entity);return html`<div class="hpf-cover" data-entity=${entity}><label class="hpf-cover-caption">${icon('blinds')}<span>${name||this._name(entity)}</span><output>${coverText(s)}</output></label><input aria-label=${'Pourcentage d’ouverture de '+(name||this._name(entity))} type="range" min="0" max="100" .value=${String(p??50)} ?disabled=${disabled||p===null||!(f&4)} @change=${e=>this._send(entity,'cover.set_cover_position',{position:Number(e.target.value)})}><div class="hpf-cover-actions"><button ?disabled=${disabled||!(f&1)} @click=${()=>this._send(entity,'cover.open_cover')}>${icon('chevron-up')}Ouvrir</button><button ?disabled=${disabled||!(f&8)} @click=${()=>this._send(entity,'cover.stop_cover')}>${icon('square')}Arrêter</button><button ?disabled=${disabled||!(f&2)} @click=${()=>this._send(entity,'cover.close_cover')}>${icon('chevron-down')}Fermer</button></div></div>`;}
  _opening(entity,name){const s=this._state(entity);return html`<div class=${'hpf-opening '+(s?.state==='on'?'is-open':'')}>${icon(s?.attributes?.device_class==='window'?'panels-top-left':'door-open')}<span>${name||this._name(entity)}</span><strong>${known(s)?s.state==='on'?'Ouverte':'Fermée':s?.state==='unavailable'?'Indisponible':'État inconnu'}</strong></div>`;}
  _equipment(id){const s=this._state(id);return html`<button class="hpf-more" @click=${()=>this._more(id)}>${icon(s?.attributes?.icon|| (s?.attributes?.device_class==='smoke'?'smoke':'settings'))}<span>${this._name(id)}</span><span>${this._format(id)}</span></button>`;}
  _sheet(rooms){
    const r=rooms.find(r=>r.id===this._selected),a=this._apertures().find(a=>a.id===this._quick);
    if(this._showAlerts)return html`<section class="hpf-sheet" role="region" aria-label="Alertes"><div class="hpf-sheet-head"><h3>À vérifier</h3><button class="hpf-close" data-close aria-label="Revenir au plan" @click=${this._close}>${icon('x')}</button></div>${rooms.map(r=>html`${this._problems(r).map(id=>this._equipment(id))}${this._openings(r).filter(id=>this._state(id)?.state==='on').map(id=>this._equipment(id))}`)}</section>`;
    if(!r)return nothing;
    const covered=a?.cover_entity?[a.cover_entity]:this._covers(r),opening=a?.opening_entity?[a.opening_entity]:this._openings(r),lights=this._lights(r),photo=this._photo(r);
    const main=new Set([...covered,...opening,...lights,this._temperature(r)]);
    const rest=this._entities(r).filter(id=>!main.has(id)&&id!==a?.command_entity);
    return html`<section class="hpf-sheet" role="region" aria-label=${a?.name||r.name} @keydown=${e=>{if(e.key==='Escape')this._close();}}><div class="hpf-sheet-head"><div><h3>${a?.name||r.name}</h3><span class="hpf-sheet-sub">${a?r.name:this._temperature(r)?this._format(this._temperature(r)):this._config.floor||this._model?.floor||''}</span></div><button class="hpf-close" data-close aria-label="Revenir au plan" @click=${this._close}>${icon('x')}</button></div>
      ${!a&&photo?html`<div class="hpf-room-photo"><img src=${photo} alt=${(r.illustration&&!this._photoMode.has(r.id)?'Illustration de ':'Photo de ')+r.name}>${r.illustration?html`<button class="hpf-photo-style" @click=${()=>{const set=new Set(this._photoMode);set.has(r.id)?set.delete(r.id):set.add(r.id);this._photoMode=set;}}>${this._photoMode.has(r.id)?'Voir l’illustration':'Voir la photo'}</button>`:nothing}${r.photos?.length>1&&this._photoMode.has(r.id)?html`<button class="hpf-photo-next" @click=${()=>this._photos={...this._photos,[r.id]:((this._photos[r.id]||0)+1)%r.photos.length}}>${(this._photos[r.id]||0)+1} / ${r.photos.length}</button>`:nothing}</div>`:nothing}
      ${!a&&lights.length?html`<div class="hpf-device-grid">${repeat(lights,id=>id,id=>{const s=this._state(id);return html`<button class=${'hpf-device '+(s?.state==='on'?'is-lit':'')} ?disabled=${!known(s)||this._busy.has(id)} aria-pressed=${s?.state==='on'} @click=${()=>this._send(id,s.state==='on'?'light.turn_off':'light.turn_on')}>${icon('lightbulb')}<span><strong>${this._name(id)}</strong><small>${this._format(id)}</small></span></button>`;})}</div>`:nothing}
      ${repeat(covered,id=>id,id=>this._cover(id))}${opening.map(id=>this._opening(id))}
      ${a?.command_entity?html`<div class="hpf-cover"><div class="hpf-cover-caption">${icon('door-open')}<span>Porte motorisée</span></div><p class="hpf-sheet-sub">État physique non suivi · commande par impulsion</p><button class="hpf-device" data-command=${a.command_entity} ?disabled=${!this._state(a.command_entity)||this._state(a.command_entity)?.state==='unavailable'||this._busy.has(a.command_entity)} @click=${()=>this._send(a.command_entity,'switch.turn_on')}>${icon('door-open')}Actionner la porte</button><button class="hpf-more" @click=${()=>this._more(a.command_entity)}>${icon('settings')}Détails de l’équipement${icon('chevron-right')}</button></div>`:nothing}
      ${!a?html`${rest.filter(id=>this._state(id)?.attributes?.device_class==='smoke').map(id=>this._equipment(id))}${rest.some(id=>this._state(id)?.attributes?.device_class!=='smoke')?html`<details><summary>Autres équipements (${rest.filter(id=>this._state(id)?.attributes?.device_class!=='smoke').length})</summary>${rest.filter(id=>this._state(id)?.attributes?.device_class!=='smoke').map(id=>this._equipment(id))}</details>`:nothing}`:html`<button class="hpf-quick-room" @click=${e=>this._select(r,e.currentTarget)}>${icon(r.icon)}Voir la pièce${icon('chevron-right')}</button>`}
      ${!this._entities(r).length?html`<p class="hpf-empty">Aucun équipement associé. Ajoutez-les dans l’éditeur de la carte.</p>`:nothing}
    </section>`;
  }
  _map(rooms){
    const b=this._model.bounds,apertures=this._apertures(),markers=this._markers(),pct=(v,i)=>(v-b[i])/b[i+2]*100;
    const pointStyle=p=>`left:clamp(22px,${pct(p[0],0)}%,calc(100% - 22px));top:${pct(p[1],1)}%`;
    const selected=rooms.find(r=>r.id===this._selected)||rooms.find(r=>r.id===this._model.preview?.room);
    return html`<div class="hpf-map" style=${`aspect-ratio:${b[2]}/${b[3]}`}>
      <svg class="hpf-drawing" viewBox=${b.join(' ')} role="img" aria-label=${'Plan du '+(this._config.floor||this._model.floor||'niveau')}><title>Pièces et équipements</title>${rooms.map(r=>svg`<path class=${`hpf-room-floor ${this._lights(r).some(id=>this._state(id)?.state==='on')?'is-lit':''} ${r.id===this._selected?'is-selected':''} ${this._matches(r)?'':'is-muted'}`} d=${r.path||''}/>`)}${unsafeSVG(this._model.artwork)}</svg>
      ${repeat(rooms,r=>r.id,r=>{const [x,y,w,h]=r.hit||[r.x,r.y,r.w,r.h],l=r.label||[x+w/2,y+h/2],temp=this._temperature(r),opens=this._openings(r).some(id=>this._state(id)?.state==='on'),problems=this._problems(r);return html`<button class=${`hpf-zone ${opens?'has-opening':''} ${this._matches(r)?'':'is-muted'}`} style=${`left:${pct(x,0)}%;top:${pct(y,1)}%;width:${w/b[2]*100}%;height:${h/b[3]*100}%`} aria-label=${r.name+', '+this._status(r)} aria-pressed=${r.id===this._selected} @click=${e=>this._select(r,e.currentTarget)}><span class="hpf-room-name" ?hidden=${r.hide_label} style=${`left:${(l[0]-x)/w*100}%;top:${(l[1]-y)/h*100}%`}><strong><span class="hpf-name-full">${r.short||r.name}</span><span class="hpf-name-micro">${r.micro||r.short||r.name}</span>${opens||problems.length?html`<span class=${'hpf-room-alert '+(problems.length?'hpf-problem':'')}>!</span>`:nothing}</strong>${temp?html`<small>${this._format(temp)}</small>`:this._lights(r).some(id=>this._state(id)?.state==='on')?html`<span class="hpf-dot"></span>`:nothing}</span></button>`;})}
      <svg class="hpf-aperture-layer" viewBox=${b.join(' ')} aria-hidden="true">${apertures.map(a=>{const s=a.segment;if(!s||s.length!==4)return nothing;const p=`M${s[0]} ${s[1]}L${s[2]} ${s[3]}`,o=this._state(a.opening_entity),c=this._state(a.cover_entity),pos=coverPosition(c),vertical=s[0]===s[2],shift=vertical?-12:12,parallel=`M${s[0]+(vertical?shift:0)} ${s[1]+(vertical?0:shift)}L${s[2]+(vertical?shift:0)} ${s[3]+(vertical?0:shift)}`;return svg`${o?.state==='on'?svg`<path class="aperture-halo" d=${p}/>`:nothing}<path class=${'aperture-line '+(o?.state==='on'?'is-open':'')} d=${p} data-map-aperture=${a.id} @click=${e=>this._aperture(a,this.renderRoot.querySelector(`[data-aperture="${CSS.escape(a.id)}"]`))}/>${a.cover_entity?svg`<path class="shutter-track" d=${parallel}/>${pos!==null?svg`<path class="shutter-fill" d=${parallel} pathLength="100" stroke-dasharray=${`${100-pos} 100`}/>`:nothing}${this._mode==='covers'&&a.control?svg`<path class="aperture-leader" d=${`M${(s[0]+s[2])/2} ${(s[1]+s[3])/2}L${a.control[0]} ${a.control[1]}`}/>`:nothing}`:nothing}`;})}</svg>
      ${apertures.filter(a=>a.cover_entity||a.command_entity||a.opening_entity).map(a=>{const p=a.control||[(a.segment[0]+a.segment[2])/2,(a.segment[1]+a.segment[3])/2],o=this._state(a.opening_entity),c=this._state(a.cover_entity),r=rooms.find(r=>r.id===a.room);return html`<button data-aperture=${a.id} class=${`hpf-aperture ${a.cover_entity?'has-cover':''} ${this._mode==='covers'?'show-value':''} ${o?.state==='on'?'is-open':''} ${r&&this._matches(r)?'':'is-muted'}`} style=${pointStyle(p)} aria-label=${a.name+(a.cover_entity?', '+coverText(c):'')} @click=${e=>this._aperture(a,e.currentTarget)}><span class="hpf-aperture-mark">${icon(a.cover_entity?'blinds':o?.state==='off'?'door-closed':'door-open')}${a.cover_entity?html`<span>${coverPosition(c)===0?'Fermé':coverPosition(c)===100?'Ouvert':coverPosition(c)!==null?coverPosition(c)+' %':'?'}</span>`:nothing}</span></button>`;})}
      ${markers.filter(m=>m.entity&&m.point&&(!this._mode||this._mode==='openings'||this._state(m.entity)?.state==='on')).map(m=>html`<button class=${'hpf-room-marker '+(this._state(m.entity)?.state==='on'?'is-alert':'')} style=${pointStyle(m.point)} aria-label=${this._name(m.entity)+', '+this._format(m.entity)} @click=${()=>this._more(m.entity)}>${icon(m.icon||'smoke')}</button>`)}
      ${selected&&this._photo(selected)&&this._model.preview?html`<button class="hpf-photo-shortcut" style=${`left:${pct(this._model.preview.x,0)}%;top:${pct(this._model.preview.y,1)}%;width:${this._model.preview.w/b[2]*100}%;height:${this._model.preview.h/b[3]*100}%`} @click=${e=>this._select(selected,e.currentTarget)}><img src=${this._photo(selected)} alt=${selected.name}><span class="hpf-photo-caption">${selected.short||selected.name}${icon('chevron-right')}</span></button>`:nothing}
    </div>`;
  }
  render(){
    this._observed=new Set();this._roomEntityCache=new Map();if(!this._model)return html`<ha-card><div class="hpf-empty">${this._error||'Chargement du plan…'}</div></ha-card>`;
    const rooms=this._rooms(),lights=[...new Set(rooms.flatMap(r=>this._lights(r)))].filter(id=>this._state(id)?.state==='on'),openingIds=[...new Set(rooms.flatMap(r=>this._openings(r)))],open=openingIds.filter(id=>this._state(id)?.state==='on'),unknown=openingIds.filter(id=>!known(this._state(id))),problems=[...new Set(rooms.flatMap(r=>this._problems(r)))];
    return html`<ha-card><section class="hpf-home" aria-label="Plan et commandes de la maison"><header class="hpf-head"><div class="hpf-heading"><span class="hpf-home-mark">${icon('house')}</span><div><h2>${this._config.name||'Maison'}</h2><span class="hpf-floor-name">${this._config.floor||this._model.floor}</span></div></div></header>
      <div class="hpf-tools"><div class="hpf-glance"><button data-light-count aria-pressed=${this._mode==='lights'} @click=${()=>this._mode=this._mode==='lights'?'':'lights'}>${icon('lightbulb')}${lights.length} lumière${lights.length>1?'s':''}</button><button data-open-count aria-pressed=${this._mode==='openings'} @click=${()=>this._mode=this._mode==='openings'?'':'openings'}>${icon('door-open')}${open.length} ouverture${open.length>1?'s':''}${unknown.length?' · '+unknown.length+' ?':''}</button></div><div class="hpf-view" role="group" aria-label="Présentation"><button aria-pressed=${this._view==='plan'} @click=${()=>this._view='plan'}>Plan</button><button aria-pressed=${this._view==='rooms'} @click=${()=>this._view='rooms'}>Pièces</button></div></div>
      <div class="hpf-modebar" role="group" aria-label="Informations sur le plan">${MODES.map(([mode,i,label])=>html`<button data-mode=${mode} aria-pressed=${this._mode===mode} aria-label=${label} @click=${()=>this._mode=mode}>${icon(i)}${mode==='openings'?html`<span class="hpf-mode-long">${label}</span><span class="hpf-mode-short">Ouv.</span>`:label}</button>`)}</div>
      ${!rooms.length?html`<div class="hpf-empty">Ajoutez un plan local et ses pièces dans l’éditeur de la carte.</div>`:this._view==='plan'?this._map(rooms):html`<div class="hpf-room-grid">${rooms.filter(r=>this._matches(r)).map(r=>html`<button class=${'hpf-room-tile '+(this._problems(r).length?'has-opening':'')} data-room=${r.id} @click=${e=>this._select(r,e.currentTarget)}>${icon(r.icon)}<strong>${r.name}</strong><small>${this._status(r)}</small></button>`)}</div>`}
      ${this._view==='plan'?html`<div class="hpf-map-legend"><span class="opening-key">${icon('door-open')}Ouverture physique</span><span class="cover-key">${icon('blinds')}${this._mode==='covers'?'Volet · % d’ouverture':'Toucher pour commander'}</span></div>`:nothing}
      <footer class="hpf-footer">${icon(problems.length||open.length?'circle-alert':'shield-check')}<span class="hpf-footer-copy">${problems.length?`${problems.length} alerte${problems.length>1?'s':''}`:open.length?`${open.length} ouverture${open.length>1?'s':''} ouverte${open.length>1?'s':''}`:unknown.length?'État de certaines ouvertures inconnu':'Les ouvertures suivies sont fermées'}</span>${problems.length||open.length?html`<button data-alerts @click=${e=>{this._opener=e.currentTarget;this._showAlerts=true;this._focusSheet();}}>À vérifier${icon('chevron-right')}</button>`:nothing}</footer>
      ${this._sheet(rooms)}${this._feedback?html`<div class="hpf-state" role="status" aria-live="polite">${this._feedback}</div>`:nothing}${this._registryError?html`<div class="hpf-state">${this._registryError}</div>`:nothing}${this._error?html`<div class="hpf-state is-error" role="alert">${this._error}</div>`:nothing}
    </section></ha-card>`;
  }
}

export class HomePlanCardEditor extends LitElement {
  static properties={hass:{},_config:{state:true},_room:{state:true},_marker:{state:true},_formReady:{state:true},_formError:{state:true}};
  static styles=css`:host{display:block} .fields{display:grid;gap:16px}select,input{box-sizing:border-box;font:inherit;width:100%;min-height:44px;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;padding:8px}label{display:grid;gap:8px}h3{font-size:16px;margin:8px 0}p{font-size:13px;color:var(--secondary-text-color)}.row{display:flex;gap:8px}.row>*{flex:1}button{font:inherit;min-height:44px;border:0;border-radius:8px;padding:8px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}a{color:var(--primary-color)}`;
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
  _markerChange(patch){this._change({markers:this._config.markers.map(m=>m.id===this._marker?{...m,...patch}:m)});}
  render(){if(!this._formReady)return html`<p>${this._formError||'Chargement de l’éditeur natif…'}</p>`;const r=this._config.rooms.find(r=>r.id===this._room),m=this._config.markers.find(m=>m.id===this._marker);return html`<div class="fields"><label>Nom de la carte<input .value=${this._config.name||'Maison'} @change=${e=>this._change({name:e.target.value})}></label><label>Fichier du plan<input .value=${this._config.model_url||''} placeholder="/local/maison/plan.json" @change=${e=>this._change({model_url:e.target.value})}></label><label>Pièce<select .value=${this._room} @change=${e=>{this._room=e.target.value;this._marker='';}}><option value="">Choisir une pièce</option>${this._config.rooms.map(r=>html`<option value=${r.id}>${r.name||r.id}</option>`)}</select></label>
      ${r?html`<ha-form .hass=${this.hass} .data=${r} .schema=${[{name:'name',selector:{text:{}}},{name:'area_id',selector:{area:{}}},{name:'auto_area',selector:{boolean:{}}},{name:'entities',selector:{entity:{multiple:true}}},{name:'excluded_entities',selector:{entity:{multiple:true}}},{name:'temperature_entity',selector:{entity:{filter:{domain:'sensor'}}}},{name:'light_entity',selector:{entity:{filter:{domain:'light'}}}}]} .computeLabel=${s=>({name:'Nom de la pièce',area_id:'Zone Home Assistant',auto_area:'Afficher les équipements de cette zone',entities:'Équipements ajoutés à cette pièce',excluded_entities:'Équipements automatiques à masquer',temperature_entity:'Température principale',light_entity:'Éclairage principal'})[s.name]} @value-changed=${e=>{e.stopPropagation();this._roomChange(e.detail.value);}}></ha-form>
      <h3>Fenêtres et portes</h3>${this._config.apertures.filter(a=>a.room===r.id).map(a=>html`<details><summary>${a.name||a.id}</summary><ha-form .hass=${this.hass} .data=${a} .schema=${[{name:'opening_entity',selector:{entity:{filter:{domain:'binary_sensor'}}}},{name:'cover_entity',selector:{entity:{filter:{domain:'cover'}}}},{name:'command_entity',selector:{entity:{filter:{domain:'switch'}}}}]} .computeLabel=${s=>({opening_entity:'Contact physique',cover_entity:'Volet associé',command_entity:'Commande motorisée'})[s.name]} @value-changed=${e=>{e.stopPropagation();this._change({apertures:this._config.apertures.map(x=>x.id===a.id?{...x,...e.detail.value}:x)});}}></ha-form></details>`)}
      <h3>Repères sur le plan</h3><label>Équipement<select .value=${this._marker} @change=${e=>this._marker=e.target.value}><option value="">Choisir un repère</option>${this._config.markers.filter(m=>m.room===r.id).map(m=>html`<option value=${m.id}>${m.name||m.entity||m.id}</option>`)}</select></label><button @click=${()=>{const id='marker-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));this._change({markers:[...this._config.markers,{id,room:r.id,name:'Équipement',point:copy(r.label||[0,0]),icon:'mdi:circle-small'}]});this._marker=id;}}>Ajouter un repère</button>
      ${m?html`<ha-form .hass=${this.hass} .data=${m} .schema=${[{name:'name',selector:{text:{}}},{name:'entity',selector:{entity:{}}},{name:'icon',selector:{icon:{}}}]} .computeLabel=${s=>({name:'Libellé',entity:'Équipement',icon:'Icône'})[s.name]} @value-changed=${e=>{e.stopPropagation();this._markerChange(e.detail.value);}}></ha-form><div class="row"><label>Position X<input type="number" .value=${String(m.point?.[0]||0)} @change=${e=>this._markerChange({point:[Number(e.target.value),m.point?.[1]||0]})}></label><label>Position Y<input type="number" .value=${String(m.point?.[1]||0)} @change=${e=>this._markerChange({point:[m.point?.[0]||0,Number(e.target.value)]})}></label></div><button @click=${()=>{this._change({markers:this._config.markers.filter(x=>x.id!==m.id)});this._marker='';}}>Retirer ce repère</button>`:nothing}`:nothing}
      <p>Les équipements d’une zone suivent les associations de Paramètres → Appareils et services → Zones. Les ajouts manuels et repères ci-dessus concernent cette carte.</p><a href=${this._config.documentation_url||'https://github.com/smornierHA/ha-board'} target="_blank" rel="noopener noreferrer">Documentation du plan</a></div>`;}
}
if(!customElements.get('home-plan-card'))customElements.define('home-plan-card',HomePlanCard);
if(!customElements.get('home-plan-card-editor'))customElements.define('home-plan-card-editor',HomePlanCardEditor);
window.customCards ||= [];
if(!window.customCards.some(c=>c.type==='home-plan-card'))window.customCards.push({type:'home-plan-card',name:'Plan de la maison',description:'Pièces, volets, lumières, ouvertures et équipements',preview:true,documentationURL:'https://github.com/smornierHA/ha-board'});
