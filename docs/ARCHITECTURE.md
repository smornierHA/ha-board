# Architecture du POC

La vue Personnes (`sections`, sous-vue) contient un en-tête Person History et quatre cartes Person Rich détaillées. Quatre cartes compactes de même type sont présentes à l'accueil. L'inventaire a traversé toute la configuration Lovelace, y compris les conteneurs non couverts par la recherche MCP : aucune autre version Person Rich/History n'est référencée dans ce dashboard à cet instant.

Person History crée une carte native `type: map` via `loadCardHelpers`/`createCardElement`, lui transmet hass, les personnes sélectionnées et zone.home. Le frontend HA fournit tuiles et tracés Recorder. /map est une stratégie native séparée ; le wrapper ne la remplace pas et ne configure aucun fournisseur CARTO.

Dans le frontend ciblé, les attributs historiques existent au niveau du flux mais sont abandonnés lorsque `hui-map-card` forme les chemins `{point, timestamp}`. `ha-map` produit ensuite ses bulles sans formateur public. L’adaptateur `history-address-adapter.mjs` reste donc une préparation historique non chargée. L’ancien U3 est écarté par décision utilisateur, non livré ; aucun raccordement ni prototype supplémentaire n’est demandé. Le remplacement est le graphe durée + position au backlog #10. Aucun accès aux propriétés privées, prototype global ou scraping de bulle n’est admis.

Person Rich lit les personnes/capteurs associés. CSS et présentation sont encapsulés dans son Shadow DOM. Le Memoji provient de `person.attributes.entity_picture`. Les capteurs associés sont configurables : batterie, charge, durée, GPS/ville, adresse et date propre de géocodage, téléphone/iPad, activité/focus, proximité/trajet/destination. Le modèle interne sépare zone/ville, adresse, position et qualité. Depuis `v0.1.2-rc.1`, le bandeau technique, le dépliant `details` de qualité et la note de fraîcheur du trajet sont retirés du rendu par décision utilisateur ; les contrôles de provenance, de date et de cohérence restent internes.

Dépendances : frontend HA, états des intégrations et capteurs, Recorder pour historique, images HA, stockage navigateur des filtres. La carte compacte navigue vers /lovelace/Personnes ; la détaillée ouvre hass-more-info. Pas de commande physique dans ces cartes.

Les deux composants sont autonomes. Les autres 40 ressources Lovelace ne doivent pas être supprimées ou réordonnées. Le chargement asynchrone exige gestion d'erreur, jeton de génération et nettoyage au détachement. Les mises à jour hass sans changement utile ne doivent pas reconstruire le DOM. Le champ map_entity actuellement ignoré sera traité selon DATA-FRESHNESS, sans changement sémantique implicite.

## Pilote météo #12

La météo est un Web Component autonome, avec entrée dédiée et aucun import runtime. `build_hacs.py` préserve les octets Personnes et construit `weather-combined-forecast-card.js` séparément. Le manifeste recense les deux artefacts et le publisher les joint à une même release ; seule la ressource dédiée active le type météo. L’éditeur conserve une copie de la configuration YAML et applique uniquement les champs émis par `ha-form`.

Chaque abonnement quotidien capture une génération, l’entité et la connexion. Le détachement, le changement d’entité/connexion et la reconnexion invalident cette génération ; un résultat périmé libère immédiatement son abonnement et n’écrit plus de données. Listeners, frames et temporisations sont propres à l’instance et nettoyés. Les risques restent intégrés à la carte et attribués ; aucune dépendance au garage, au portail ou à #10.
