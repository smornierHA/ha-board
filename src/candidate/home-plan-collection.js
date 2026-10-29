/* Native HA configuration factory. Helpers restore state; no device is controlled. */
export const COLLECTION_OPTIONS = ['Au repos','En cours','À récupérer','Récupéré'];
const ENTITY=/^[a-z_]+\.[a-z0-9_]+$/;
export function collectionAutomation({name,stateEntity,doorEntity,helperEntity,runningStates,finishedStates,doorOpen='open',doorClosed=['closed','locked'],binaryDoor=false}){
  if(![stateEntity,doorEntity,helperEntity].every(id=>ENTITY.test(id))||!helperEntity.startsWith('input_select.')||!runningStates?.length||!finishedStates?.length)throw Error('Collection sources and helper are required');
  const set=option=>[{action:'input_select.select_option',target:{entity_id:helperEntity},data:{option}}];
  const is=state=>({condition:'state',entity_id:helperEntity,state});
  const by=id=>({condition:'trigger',id});
  return {
    alias:`Plan · ${name} · récupération`,
    description:'Mémorise la fin d’un cycle jusqu’à une ouverture réelle ultérieure de sa porte. Le statut Récupéré empêche une reconnexion finished de recréer la tâche ; un nouveau programme réarme le suivi. Aucun appareil commandé.',
    mode:'queued',max:10,
    triggers:[
      ...runningStates.map(to=>({trigger:'state',entity_id:stateEntity,to,id:'running'})),
      ...finishedStates.map(to=>({trigger:'state',entity_id:stateEntity,to,id:'finished'})),
      ...(binaryDoor?[{trigger:'door.opened',target:{entity_id:doorEntity},id:'opened'}]:doorClosed.map(from=>({trigger:'state',entity_id:doorEntity,from,to:doorOpen,id:'opened'}))),
      {trigger:'homeassistant',event:'start',id:'recover'}
    ],
    actions:[{choose:[
      {conditions:[by('running')],sequence:set('En cours')},
      {conditions:[by('finished'),is('En cours')],sequence:set('À récupérer')},
      {conditions:[by('opened'),is('À récupérer')],sequence:set('Récupéré')},
      {conditions:[by('recover'),{condition:'state',entity_id:stateEntity,state:runningStates}],sequence:set('En cours')},
      {conditions:[by('recover'),is('En cours'),{condition:'state',entity_id:stateEntity,state:finishedStates}],sequence:set('À récupérer')}
    ]}]
  };
}
