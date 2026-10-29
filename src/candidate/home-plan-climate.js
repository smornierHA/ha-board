// Climate capabilities and reported state. No physical activity is inferred from a setpoint.
const bad=new Set(['unknown','unavailable']);
export const presetLabel=value=>({auto:'Auto',comfort:'Confort',eco:'Éco',anti_frost:'Hors-gel',frost_protection:'Hors-gel',stop:'Arrêt',off:'Arrêt',none:'Sans profil',away:'Absent',home:'Présent',sleep:'Nuit',boost:'Boost'}[String(value).toLowerCase()]||value);
export const modeLabel=value=>({heat:'Chauffage',auto:'Auto',off:'Arrêt',cool:'Climatisation'}[value]||value);
const numeric=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
export function climateInfo(state){
 const a=state?.attributes||{},available=!!state&&!bad.has(state.state),f=a.supported_features||0,current=numeric(a.current_temperature),target=numeric(a.temperature),min=numeric(a.min_temp),max=numeric(a.max_temp),step=numeric(a.target_temp_step)>0?a.target_temp_step:.5;
 const order={auto:0,comfort:1,eco:2,anti_frost:3,frost_protection:3,stop:4,off:4};
 const presets=(f&16)&&Array.isArray(a.preset_modes)?[...new Set(a.preset_modes.filter(x=>typeof x==='string'&&x.toLowerCase()!=='none'))].sort((a,b)=>(order[a.toLowerCase()]??9)-(order[b.toLowerCase()]??9)):[];
 const modes=Array.isArray(a.hvac_modes)?a.hvac_modes.filter(x=>['heat','auto','off'].includes(x)):[];
 const stopped=state?.state==='off'||['stop','off'].includes(String(a.preset_mode).toLowerCase()),action=a.hvac_action,conflict=available&&stopped&&['heating','cooling'].includes(action);
 const status=!available?'unavailable':conflict?'conflict':stopped?'off':action==='heating'?'heating':action==='cooling'?'cooling':action==='idle'?'idle':'enabled';
 const label={unavailable:state?.state==='unknown'?'État inconnu':'Indisponible',conflict:'À vérifier',off:'Arrêt',heating:'En chauffe',cooling:'Refroidit',idle:'En attente',enabled:'Activé'}[status];
 return {available,current:available?current:null,target:available?target:null,min,max,step,presets,modes,status,label,preset:a.preset_mode,action,canSet:available&&!!(f&1)&&target!==null&&min!==null&&max!==null&&max>min};
}
export function climateCommand(state,action,data={}){
 const info=climateInfo(state);if(!info.available)return null;
 if(action==='set_temperature')return info.canSet&&typeof data.temperature==='number'&&Number.isFinite(data.temperature)&&data.temperature>=info.min&&data.temperature<=info.max?{temperature:data.temperature}:null;
 if(action==='set_preset_mode')return info.presets.includes(data.preset_mode)?{preset_mode:data.preset_mode}:null;
 if(action==='set_hvac_mode')return info.modes.includes(data.hvac_mode)?{hvac_mode:data.hvac_mode}:null;
 return null;
}
export function climateIncrement(state,direction,base){
 const i=climateInfo(state);if(!i.canSet||![1,-1].includes(direction))return null;
 const start=numeric(base)??i.target;return Math.round(Math.min(i.max,Math.max(i.min,start+direction*i.step))*1000)/1000;
}
