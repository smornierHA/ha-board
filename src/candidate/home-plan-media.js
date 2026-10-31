/* Presentation and bounded media commands. No HA request or device action here. */
const known=s=>!!s&&!['unknown','unavailable',''].includes(s.state);
const text=v=>String(v??'').toLowerCase().replace(/[ _-]/g,'');
export function isArtMode(s){
 const value=s?.attributes?.art_mode_status;
 // The running app can report Art while the websocket status still says off.
 return value===true||['on','true','art','artmode'].includes(text(value))||[s?.attributes?.app_id,s?.attributes?.source].some(v=>['art','artmode','com.samsung.tv.art'].includes(text(v)));
}
export function mediaPolicy(id,options=[]){return options.find(p=>p.entity===id||p.aliases?.includes(id))||{};}
export function mediaPresentation(id,getState,options=[]){
 const policy=mediaPolicy(id,options),source=policy.state_entity||id,s=getState(source),available=known(s),art=available&&isArtMode(s),active=available&&!art&&['on','playing','paused','buffering'].includes(s.state);
 return {policy,state:s,available,art,active,label:!available?s?.state==='unavailable'?'Indisponible':'État inconnu':art?'Mode Art':active?'En service':'Éteint'};
}
export function mediaCommand(id,action,getState,options=[]){
 if(!['turn_on','turn_off'].includes(action))return null;
 const view=mediaPresentation(id,getState,options),entity=view.policy.command_entity||id,target=getState(entity);
 if(!view.available||!known(target)||!(target.attributes?.supported_features&(action==='turn_on'?128:256)))return null;
 if(action==='turn_off'&&view.policy.off_service==='samsungtv_smart.set_art_mode')return view.art?null:{entity,domain:'samsungtv_smart',action:'set_art_mode',data:{entity_id:entity},nativeTarget:false};
 return {entity,domain:'media_player',action,data:{},nativeTarget:true};
}
