/* Pure native dashboard layout for dedicated room accounts. */
const TYPE='custom:home-plan-card',SETUP='custom:home-plan-pc-setup';
const idOK=v=>typeof v==='string'&&/^[a-f0-9]{32}$/.test(v);
const fold=v=>String(v||'').trim().toLocaleLowerCase('fr');
export function validatePCProfiles(profiles){
 if(!Array.isArray(profiles)||!profiles.length||profiles.length>4)throw Error('Profils PC invalides.');
 const keys=new Set(),names=new Set(),logins=new Set();
 for(const p of profiles){if(!p||typeof p.room_id!=='string'||!/^[-a-z0-9_]{1,60}$/.test(p.room_id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>80||typeof p.username!=='string'||!/^[a-z0-9_.-]{3,60}$/.test(p.username)||p.user_id&&!idOK(p.user_id)||keys.has(p.room_id)||names.has(fold(p.name))||logins.has(p.username))throw Error('Profil PC invalide ou dupliqué.');keys.add(p.room_id);names.add(fold(p.name));logins.add(p.username);}
 return profiles;
}

export function arrangePersonalRoomSections(config,profiles,{viewIndex=0,removeSetup=false}={}){
 validatePCProfiles(profiles);const next=structuredClone(config),view=next.views?.[viewIndex];if(!Array.isArray(view?.sections))throw Error('Vue Aperçu introuvable.');
 const chosen=profiles.map(p=>{const matches=view.sections.flatMap(s=>s.cards||[]).filter(c=>c.type===TYPE&&c.room_only===true&&c.start_room===p.room_id);if(matches.length!==1)throw Error('Une seule carte personnelle est requise par pièce.');return {profile:p,card:matches[0]};});
 const selected=new Set(chosen.map(x=>x.card)),rest=view.sections.map(section=>({...section,cards:(section.cards||[]).filter(c=>!selected.has(c)&&!(removeSetup&&c.type===SETUP))})).filter(s=>s.cards.length);
 for(const section of rest)if(section.cards.some(c=>c.type===TYPE))section.column_span=2;
 const first=chosen.map(({profile:p,card})=>{const conditions=card.visibility||[],userCondition=conditions.find(c=>c.condition==='user'),users=[...new Set([...(userCondition?.users||[]),...(p.user_id?[p.user_id]:[])])];if(!users.length||users.some(v=>!idOK(v)))throw Error('Utilisateurs de la pièce à vérifier.');
  card.visibility=[...conditions.filter(c=>c.condition!=='user'),{condition:'user',users}];card.grid_options={...card.grid_options,columns:'full',rows:'auto'};
  const room=card.rooms?.find(r=>r.id===p.room_id);if(!room||!(room.scene||room.scene_url))throw Error('Modèle 3D de la pièce introuvable.');room.default_view='3d';
  return {type:'grid',column_span:2,visibility:structuredClone(card.visibility),cards:[card]};
 });view.sections=[...first,...rest];return next;
}

