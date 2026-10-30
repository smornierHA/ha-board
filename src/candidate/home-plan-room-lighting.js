/* Bounded visual lighting from existing HA snapshots. No clock, network or device action. */
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};

export function lightLevel(state){return state?.state==='on'?(finite(state.attributes?.brightness)?clamp(state.attributes.brightness/255):1):0;}
export function lightColor(state){
 const a=state?.attributes||{};
 if(Array.isArray(a.rgb_color)&&a.rgb_color.length===3&&a.rgb_color.every(finite))return a.rgb_color.map(v=>clamp(v/255));
 if(finite(a.color_temp_kelvin))return mix([1,.60,.31],[.78,.87,1],clamp((a.color_temp_kelvin-2000)/4500));
 if(Array.isArray(a.hs_color)&&a.hs_color.length===2&&a.hs_color.every(finite)){
  const h=((a.hs_color[0]%360)+360)%360/60,s=clamp(a.hs_color[1]/100),x=1-Math.abs(h%2-1),rgb=h<1?[1,x,0]:h<2?[x,1,0]:h<3?[0,1,x]:h<4?[0,x,1]:h<5?[x,0,1]:[1,0,x];return rgb.map(v=>1-s+s*v);
 }
 return [1,.87,.68];
}
export function coverOpening(state){
 if(!state||['unknown','unavailable'].includes(state.state))return null;
 const p=state.attributes?.current_position;if(finite(p)&&p>=0&&p<=100)return p/100;
 return state.state==='closed'?0:state.state==='open'?1:null;
}
export function solarDaylight(sun){
 if(!sun||!['above_horizon','below_horizon'].includes(sun.state))return {known:false,level:.55,label:'Ambiance'};
 const elevation=sun.attributes?.elevation,level=finite(elevation)?smooth(-6,12,elevation):sun.state==='above_horizon'?1:0;
 return {known:true,level,label:level<.08?'Nuit':level<.8?'Crépuscule':'Jour'};
}
function worldPoint(o,offset){const angle=(o.rotation||0)*Math.PI/180;return [o.at[0]+offset[0]*Math.cos(angle)+offset[2]*Math.sin(angle),o.at[1]+offset[1],o.at[2]-offset[0]*Math.sin(angle)+offset[2]*Math.cos(angle)];}
const TYPES=new Set(['ring','lamp','lines','blocks','backlight','desk','led-strip']);
export function roomLighting(scene,signals={},environment={}){
 const solar=solarDaylight(environment.sun),windows=scene.objects.filter(o=>o.type==='window');
 let area=0,transmission=0;const daylight=[];
 for(const o of windows){const weight=o.size[0]*o.size[1],opening=o.cover?coverOpening(signals[o.cover]):1,pass=opening??.55;area+=weight;transmission+=pass*weight;
  daylight.push({key:'window',kind:'daylight',at:worldPoint(o,[0,0,.20]),rgb:[1,.94,.81],intensity:solar.level*pass*.72,radius:Math.max(...scene.size)*.9});
 }
 const opening=area?transmission/area:1,admitted=solar.level*(.10+.90*opening),ambientStrength=.23+.38*admitted;
 const ambient=mix([.61,.72,1],[1,.98,.94],solar.level).map(v=>v*ambientStrength),direct=.065+.32*solar.level*opening;
 const grouped=new Map();
 for(const o of scene.objects){if(!o.bind||!TYPES.has(o.type))continue;const s=signals[o.bind];if(s?.entity_id&&!s.entity_id.startsWith('light.'))continue;if(!lightLevel(s))continue;
  const offset=o.type==='lamp'?[0,.44,-.05]:o.type==='desk'?[0,.90,0]:[0,0,.09],at=worldPoint(o,offset),profile=o.type==='ring'?{radius:3.2,power:1.45}:o.type==='lamp'||o.type==='desk'?{radius:2.2,power:1.1}:{radius:1.9,power:1.0};
  const group=grouped.get(o.bind);if(group){group.points.push(at);group.radius=Math.max(group.radius,profile.radius);group.power=Math.max(group.power,profile.power);}else grouped.set(o.bind,{points:[at],...profile});
 }
 // A light may have a 2D/control anchor without its own mesh (for example a light curtain).
 for(const h of scene.hotspots){const s=signals[h.key];if(grouped.has(h.key)||!s?.entity_id?.startsWith('light.')||!lightLevel(s))continue;const o=h.object&&scene.objects.find(o=>o.id===h.object),at=o?worldPoint(o,h.offset||[0,0,0]):h.at;grouped.set(h.key,{points:[at],radius:2.1,power:.85});}
 const lamps=[...grouped].map(([key,g])=>({key,kind:'lamp',at:g.points[0].map((_,i)=>g.points.reduce((sum,p)=>sum+p[i],0)/g.points.length),rgb:lightColor(signals[key]),radius:g.radius,intensity:g.power*lightLevel(signals[key])**.85*(1+.65*(1-admitted))}));
 // Keep the window contribution and brightest light groups within a fixed GPU budget.
 const sources=[...daylight.filter(s=>s.intensity>.001).slice(0,2),...lamps.sort((a,b)=>b.intensity-a.intensity)].slice(0,8);
 const background=mix([21,32,49],[232,232,224],clamp(admitted*.88+lamps.reduce((sum,l)=>sum+l.intensity,0)*.045));
 return {daylight:solar.level,opening,label:solar.label,solarKnown:solar.known,ambient,direct,sources,background:background.map(Math.round)};
}
export function roomRenderSize(width,height,dpr=1,fine=false,maxSize=4096){
 const pixels=fine?2600000:1200000,target=fine?Math.max(1.5,Math.min(dpr*1.25,2.5)):Math.min(dpr,2),ratio=Math.min(target,Math.sqrt(pixels/Math.max(1,width*height)),maxSize/Math.max(1,width,height));
 return {width:Math.max(1,Math.floor(width*ratio)),height:Math.max(1,Math.floor(height*ratio)),ratio,shadowSize:Math.min(fine?2048:1024,maxSize)};
}
