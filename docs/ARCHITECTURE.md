# Architecture du POC

La vue Personnes (`sections`, sous-vue) contient un en-tête Person History et quatre cartes Person Rich détaillées. Quatre cartes compactes de même type sont présentes à l'accueil. L'inventaire a traversé toute la configuration Lovelace, y compris les conteneurs non couverts par la recherche MCP : aucune autre version Person Rich/History n'est référencée dans ce dashboard à cet instant.

Person History crée une carte native `type: map` via `loadCardHelpers`/`createCardElement`, lui transmet hass, les personnes sélectionnées et zone.home. Le frontend HA fournit tuiles et tracés Recorder. /map est une stratégie native séparée ; le wrapper ne la remplace pas et ne configure aucun fournisseur CARTO.

Dans le frontend ciblé, les attributs historiques existent au niveau du flux mais sont abandonnés lorsque `hui-map-card` forme les chemins `{point, timestamp}`. `ha-map` produit ensuite ses bulles sans formateur public. L’adaptateur `history-address-adapter.mjs` reste donc un composant de préparation non chargé : le brancher exigerait un renderer encapsulé ou une évolution publique de HA. Aucun accès aux propriétés privées, prototype global ou scraping de bulle n’est admis.

Person Rich lit les personnes/capteurs associés. CSS et présentation sont encapsulés dans son Shadow DOM. Le Memoji provient de `person.attributes.entity_picture`. Les capteurs associés sont configurables : batterie, charge, durée, GPS/ville, adresse et date propre de géocodage, téléphone/iPad, activité/focus, proximité/trajet/destination. Le modèle de présentation sépare zone/ville, adresse, position et qualité ; le détail technique utilise l’élément HTML natif `details`.

Dépendances : frontend HA, états des intégrations et capteurs, Recorder pour historique, images HA, stockage navigateur des filtres. La carte compacte navigue vers /lovelace/Personnes ; la détaillée ouvre hass-more-info. Pas de commande physique dans ces cartes.

Les deux composants sont autonomes. Les autres 40 ressources Lovelace ne doivent pas être supprimées ou réordonnées. Le chargement asynchrone exige gestion d'erreur, jeton de génération et nettoyage au détachement. Les mises à jour hass sans changement utile ne doivent pas reconstruire le DOM. Le champ map_entity actuellement ignoré sera traité selon DATA-FRESHNESS, sans changement sémantique implicite.
