# Fin de cycle et récupération

La carte lit une tâche persistante ; le navigateur ne mémorise pas la récupération. Une automatisation native par appareil utilise un helper `input_select`, sans `initial`, avec les options **Au repos / En cours / À récupérer / Récupéré**. Ce helper restaure son état après redémarrage. Les sources sont explicitement vérifiées avant raccordement : état du programme et porte de l’appareil, jamais la porte de la pièce.

`src/candidate/home-plan-collection.js` construit la configuration de l’automatisation à partir d’identifiants fournis à l’installation. Aucun identifiant réel n’est publié. La création passe par les API natives de helpers et d’automatisations ; aucune écriture de `.storage` ou de YAML global.

1. Un programme en cours arme le suivi : **En cours**.
2. La fin de programme fait passer **En cours → À récupérer**.
3. Seule une ouverture réelle ultérieure de la porte passe **À récupérer → Récupéré**.
4. Un nouveau programme réarme le suivi. Une reconnexion sur un ancien état terminé ne recrée pas une tâche déjà récupérée.

Une porte ouverte avant la fin ne valide pas une fin ultérieure. Une récupération `unknown/unavailable → open` ne constitue pas une nouvelle ouverture. Pour un contact binaire de classe `door`, le déclencheur natif `door.opened` assure ce comportement. Pour une porte enum, les transitions fermées/verrouillées vers ouverte sont configurées explicitement : le déclencheur dédié ne prend pas ce type de capteur en charge. Le mode `queued` conserve l’ordre des événements rapprochés ; aucun délai, attente longue ou redémarrage n’est nécessaire. Un contrôle au démarrage rapproche aussi un programme terminé pendant l’arrêt de HA du suivi En cours restauré ; il conserve un état Récupéré déjà acquis.

À la première installation, le suivi est initialisé une seule fois à partir des observations disponibles. Une ancienne fin sans chronologie fiable ne prouve pas la récupération. Les événements observés après création peuvent servir à cette initialisation ; ils sont consignés dans la référence privée. Les tests ne modifient jamais l’état des capteurs réels pour simuler une porte.

La règle de la carte garde l’état natif du programme comme `entity` pour retrouver son appareil et sa pièce, utilise le helper comme `state_entity`, le niveau `ready` et l’état `À récupérer`. Les autres sources de fin du même appareil sont déclarées comme alias pour éviter une seconde indication automatique. Les consommables de cet appareil restent indépendants.

Une prise mesurant uniquement la puissance ne renseigne pas l’ouverture de la porte. La récupération automatique exige ce contact, et une fin de programme fiable ; ce lot n’invente pas ces états à partir d’une consommation nulle.

## Vérification et retour

`tests/home-plan-collection.mjs` exerce les branches de la configuration native produite : porte avant/après fin, reconnexion, nouveau programme et ordre des opérations. Ces contrats purs sont raccordés au workflow existant. Ils ne remplacent pas un cycle physique complet. L’installation contrôle la configuration relue et l’activation natives ; une trace réelle est distinguée d’une simulation.

Inverse ciblé : remettre uniquement la carte et sa ressource antérieures avec un hash Lovelace frais, puis désactiver les nouvelles automatisations. Les helpers peuvent rester en place sans effet ; leur suppression est une opération distincte. Ne restaurer aucune sauvegarde globale et ne modifier aucune commande d’appareil.

Sources : [restauration Input select](https://www.home-assistant.io/integrations/input_select/), [Door opened](https://www.home-assistant.io/triggers/door.opened/), guides natifs HA-MCP relus le 29 octobre 2026. Instance vérifiée compatible avant installation ; aucune mise à jour Core.
