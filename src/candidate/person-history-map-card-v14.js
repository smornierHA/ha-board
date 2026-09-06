class PersonHistoryMapCardV14 extends HTMLElement{
  static getStubConfig(hass){return {persons:Object.keys(hass?.states||{}).filter(id=>id.startsWith('person.')).slice(0,4).map(entity=>({entity})),hours_to_show:24};}
  static getConfigForm(){
    const text=name=>({name,selector:{text:{}}});
    return {schema:[text('title'),text('subtitle'),{name:'persons',required:true,selector:{object:{multiple:true,label_field:'name',description_field:'entity',fields:{
      entity:{name:'Personne / source de l’historique',required:true,selector:{entity:{filter:{domain:['person','device_tracker']}}}},
      name:{name:'Nom affiché',selector:{text:{}}},color:{name:'Couleur CSS (ex. #4269d0)',selector:{text:{}}}
    }}}},{name:'hours_to_show',selector:{number:{min:1,max:168,step:1,mode:'box'}}},text('aspect_ratio'),
    {name:'auto_fit',selector:{boolean:{}}},{name:'fit_zones',selector:{boolean:{}}},
    {name:'zone_entity',selector:{entity:{filter:{domain:'zone'}}}},text('storage_key')],
    computeLabel:s=>({title:'Titre',subtitle:'Sous-titre',persons:'Personnes',hours_to_show:'Historique (heures)',aspect_ratio:'Proportions (ex. 4:3)',auto_fit:'Cadrage automatique',fit_zones:'Inclure les zones dans le cadrage',zone_entity:'Zone de repère',storage_key:'Clé de mémorisation des filtres'}[s.name]),
    computeHelper:s=>s.name==='persons'?'Ajouter, supprimer ou réordonner les personnes. La source choisie fournit aussi l’historique.':s.name==='storage_key'?'Une clé distincte par carte, stable entre les visites.':undefined};
  }

  constructor(){super();this.attachShadow({mode:'open'});this.sel=new Set();this.map=null;this._generation=0;this._detached=false;PersonHistoryMapCardV14._nextId=(PersonHistoryMapCardV14._nextId||0)+1;this._instanceStorageKey=`person-history-map-filter-v14-${PersonHistoryMapCardV14._nextId}`;}
  setConfig(c){if(!c?.persons?.length)throw new Error('person-history-map-card-v14: persons required');this._cancelLoad?.();this._generation++;this.map=null;this.c={title:'Déplacements',subtitle:'24 dernières heures',hours_to_show:24,aspect_ratio:'4:3',auto_fit:true,fit_zones:false,cluster:false,zone_entity:'zone.home',storage_key:this._instanceStorageKey,...c};this.restore();this.shell();this.createMap(this._generation);}
  set hass(h){this.h=h;if(this.map)this.map.hass=h;}
  connectedCallback(){if(!this._detached)return;this._detached=false;if(this.c&&!this.map)this.createMap(++this._generation);}
  disconnectedCallback(){this._detached=true;this._cancelLoad?.();this._generation++;this.map=null;const host=this.shadowRoot.querySelector('#map');if(host)host.innerHTML='';}
  getCardSize(){return 8;} getGridOptions(){return{columns:12,rows:'auto',min_columns:6,min_rows:7};}
  ids(){return this.c.persons.map(p=>p.entity)}
  palette(){return['#4269d0','#f4bd4a','#ff725c','#6cc5b0']}
  colorFor(p,i){return p?.color||this.palette()[i%this.palette().length]}
  esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  restore(){const all=this.ids();let raw=null;try{raw=localStorage.getItem(this.c.storage_key)}catch(_e){}if(raw===null){this.sel=new Set(all);return}try{const saved=JSON.parse(raw);if(Array.isArray(saved)){this.sel=new Set(saved.filter(id=>all.includes(id)));return}}catch(_e){}this.sel=new Set(all)}
  save(){try{localStorage.setItem(this.c.storage_key,JSON.stringify([...this.sel]))}catch(_e){}}
  shell(error=''){this.shadowRoot.innerHTML=`<style>
:host{display:block;min-width:0}*{box-sizing:border-box}.wrap{overflow:hidden;border-radius:28px;background:var(--ha-card-background,var(--card-background-color));box-shadow:var(--ha-card-box-shadow)}.head{padding:14px 14px 7px}.top{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}.title b{display:block;font-size:17px;color:var(--primary-text-color)}.title span{display:block;margin-top:2px;font-size:11px;color:var(--secondary-text-color)}.count{font-size:10px;color:var(--secondary-text-color)}.filters{display:flex;gap:6px;overflow-x:auto;padding:8px 14px 10px;scrollbar-width:none}.filters::-webkit-scrollbar{display:none}button{height:29px;padding:0 9px;border-radius:999px;font:600 11px/1 var(--paper-font-body1_-_font-family,inherit);white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:5px;color:var(--primary-text-color);transition:background .18s ease,border-color .18s ease,opacity .18s ease,transform .12s ease}button:active{transform:scale(.97)}button.personFilter{--pc:var(--primary-color);border:1px solid color-mix(in srgb,var(--pc) 52%,transparent);background:color-mix(in srgb,var(--pc) 9%,rgba(var(--rgb-primary-text-color,255,255,255),.03))}button.personFilter::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--pc);box-shadow:0 0 0 2px color-mix(in srgb,var(--pc) 16%,transparent);flex:none}button.personFilter.on{background:color-mix(in srgb,var(--pc) 28%,rgba(var(--rgb-primary-text-color,255,255,255),.04));border-color:color-mix(in srgb,var(--pc) 82%,white 18%)}button.personFilter:not(.on){opacity:.58}button.allFilter{border:1px solid rgba(var(--rgb-primary-text-color,255,255,255),.16);background:rgba(var(--rgb-primary-text-color,255,255,255),.04)}button.allFilter.on{background:linear-gradient(90deg,color-mix(in srgb,#4269d0 30%,transparent) 0 25%,color-mix(in srgb,#f4bd4a 30%,transparent) 25% 50%,color-mix(in srgb,#ff725c 30%,transparent) 50% 75%,color-mix(in srgb,#6cc5b0 30%,transparent) 75% 100%);border-color:rgba(var(--rgb-primary-text-color,255,255,255),.26)}button.allFilter.none{opacity:.5;border-style:dashed}.map{padding:0 10px 8px}.map>div{overflow:hidden;border-radius:20px}.empty{display:none;aspect-ratio:4/3;border-radius:20px;place-items:center;text-align:center;color:var(--secondary-text-color);background:rgba(var(--rgb-primary-text-color,255,255,255),.025);border:1px dashed rgba(var(--rgb-primary-text-color,255,255,255),.1);font-size:12px}.mapError{aspect-ratio:4/3;display:grid;place-items:center;text-align:center;padding:18px;border-radius:20px;color:var(--error-color);background:rgba(var(--rgb-primary-text-color,255,255,255),.025);border:1px dashed color-mix(in srgb,var(--error-color) 45%,transparent);font-size:12px}.hint{padding:0 14px 11px;font-size:9px;color:var(--secondary-text-color);opacity:.78}@media(max-width:400px){.head{padding-top:12px}.map{padding-inline:8px}.filters{padding-inline:12px}}
</style><ha-card class="wrap"><div class="head"><div class="top"><div class="title"><b>${this.esc(this.c.title)}</b><span>${this.esc(this.c.subtitle)}</span></div><div class="count"></div></div></div><div class="filters"></div><div class="map">${error?`<div id="map" class="mapError" role="alert"><span>Carte indisponible</span><button class="retry" type="button">Réessayer</button></div>`:'<div id="map" role="status">Chargement de la carte…</div>'}<div class="empty">Aucune personne sélectionnée</div></div><div class="hint">Touchez une personne pour l’afficher ou la masquer · sélection multiple possible</div></ha-card>`;this.filters();this.syncEmpty();const retry=this.shadowRoot.querySelector('.retry');if(retry)retry.onclick=()=>{this.shell();this.createMap(++this._generation)};}
  filters(){if(!this.shadowRoot||!this.c)return;const box=this.shadowRoot.querySelector('.filters'),count=this.shadowRoot.querySelector('.count');if(!box)return;const all=this.ids(),allOn=this.sel.size===all.length,noneOn=this.sel.size===0;box.innerHTML=`<button data-all class="allFilter ${allOn?'on':''} ${noneOn?'none':''}">Tous</button>`+this.c.persons.map((p,i)=>`<button data-id="${p.entity}" class="personFilter ${this.sel.has(p.entity)?'on':''}" style="--pc:${this.colorFor(p,i)}">${this.esc(p.name||p.entity.split('.').pop())}</button>`).join('');if(count)count.textContent=`${this.sel.size}/${all.length}`;box.querySelector('[data-all]').onclick=()=>{const currentlyAll=this.sel.size===all.length;this.sel=currentlyAll?new Set():new Set(all);this.save();this.filters();this.updateMap()};box.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const id=b.dataset.id;if(this.sel.has(id))this.sel.delete(id);else this.sel.add(id);this.save();this.filters();this.updateMap()})}
  async createMap(generation){
    let timer, cancel;
    const active=()=>generation===this._generation&&!this._detached;
    // HA's helper can return an unupgraded hui-map-card on a cold load.
    // Bound the whole operation, and release it on detach/reconfiguration.
    const cancelled=new Promise((_,reject)=>{cancel=()=>reject(new Error('cancelled'));});
    this._cancelLoad=cancel;
    const timeout=new Promise((_,reject)=>{timer=window.setTimeout(()=>reject(new Error('map-load-timeout')),10000);});
    try{
      const candidate=await Promise.race([(async()=>{
        const helpers=await window.loadCardHelpers();
        if(!active())return null;
        const element=await helpers.createCardElement(this.mapConfig());
        if(!active())return null;
        if(element?.localName==='hui-map-card'&&typeof element.setConfig!=='function'){
          await customElements.whenDefined('hui-map-card');
          if(!active())return null;
          customElements.upgrade(element);
        }
        if(!element||typeof element.setConfig!=='function'||element.localName==='hui-error-card')throw new Error('native-map-unavailable');
        return element;
      })(),cancelled,timeout]);
      if(!active()||!candidate)return;
      // The filters or hass may have changed while HA upgraded the element.
      candidate.setConfig(this.mapConfig());
      if(this.h)candidate.hass=this.h;
      const host=this.shadowRoot.querySelector('#map');if(!host)return;
      host.innerHTML='';host.appendChild(candidate);this.map=candidate;this.syncEmpty();
    }catch(_error){if(active()){this.map=null;this.shell('load-error');}}
    finally{window.clearTimeout(timer);if(this._cancelLoad===cancel)this._cancelLoad=null;}
  }
  mapConfig(){const entities=this.c.persons.map((p,i)=>({p,i})).filter(x=>this.sel.has(x.p.entity)).map(x=>({entity:x.p.entity,focus:true,name:x.p.name,color:this.colorFor(x.p,x.i)}));if(this.c.zone_entity)entities.push({entity:this.c.zone_entity,focus:false});return{type:'map',hours_to_show:this.c.hours_to_show,aspect_ratio:this.c.aspect_ratio,auto_fit:this.c.auto_fit,fit_zones:this.c.fit_zones,cluster:false,entities}}
  syncEmpty(){const mapHost=this.shadowRoot?.querySelector('#map'),empty=this.shadowRoot?.querySelector('.empty');if(!mapHost||!empty)return;const none=this.sel.size===0;mapHost.style.display=none?'none':'block';empty.style.display=none?'grid':'none'}
  updateMap(){if(!this.map)return;this.map.setConfig(this.mapConfig());if(this.h)this.map.hass=this.h;this.syncEmpty()}
}
if(!customElements.get('person-history-map-card-v14')){customElements.define('person-history-map-card-v14',PersonHistoryMapCardV14);window.customCards=window.customCards||[];window.customCards.push({type:'person-history-map-card-v14',name:'Person History Map',description:'Historique des déplacements avec filtres individuels',documentationURL:'https://github.com/smornierHA/ha-board/blob/main/docs/CARDS.md#person-history-map'});}
