/* Native group membership and truthful room summaries; no HA writes. */
const ENTITY=/^[a-z_]+\.[a-z0-9_]+$/;
const unavailable=s=>!s||['unknown','unavailable'].includes(s.state);
function expandGroup(entity,getState,domain=entity?.split('.')[0]){
 const found=new Set(),seen=new Set(),path=new Set();let complete=true;
 const visit=id=>{if(!ENTITY.test(id||'')||!id.startsWith(domain+'.')||path.has(id)){complete=false;return;}if(seen.has(id))return;if(seen.size>=200){complete=false;return;}seen.add(id);path.add(id);const members=getState(id)?.attributes?.entity_id;if(Array.isArray(members)&&members.length)members.forEach(visit);else found.add(id);path.delete(id);};
 visit(entity);return {ids:[...found],complete};
}
export function groupLeaves(entity,getState,domain=entity?.split('.')[0]){
 return expandGroup(entity,getState,domain).ids;
}
export function exactGroup(entity,ids,getState){
 if(!entity||!Array.isArray(getState(entity)?.attributes?.entity_id))return false;
 const {ids:leaves,complete}=expandGroup(entity,getState);return complete&&leaves.length===ids.length&&leaves.every(id=>ids.includes(id));
}
export function roomGroupSummary(kind,ids,getState,position){
 let count=0,unknown=0;const unique=[...new Set(ids)];
 for(const id of unique){const s=getState(id);if(unavailable(s)){unknown++;continue;}if(kind==='covers'){const p=position?.(id);if(typeof p==='number'&&Number.isFinite(p)){if(p>0)count++;}else if(['open','opening','closing'].includes(s.state))count++;else if(s.state!=='closed')unknown++;}else if(s.state==='on')count++;else if(s.state!=='off')unknown++;}
 const noun={lights:'allumées',covers:'ouverts',openings:'ouvertes'}[kind];
 return {count,total:unique.length,unknown,active:count>0,text:unknown===unique.length?'État inconnu':`${count}/${unique.length} ${noun}${unknown?' · '+unknown+' ?':''}`};
}
