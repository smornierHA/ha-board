# U3 — adresses des points historiques — issue #8 / PR #9

## Absence de point d’extension public adapté sur la révision étudiée

Vérification du 7 septembre 2026 sur le frontend Home Assistant `20260729.7`, commit `91c28c2f587553a817a315cfbbeee072a6ed5de4` :

1. le flux `history/stream` fournit des états compressés contenant `s`, `a` et `lu` ; les domaines `person` et `device_tracker` demandent leurs attributs ;
2. `hui-map-card` construit ensuite chaque point avec uniquement `point` et `timestamp` ;
3. `ha-map` définit ce type public sans champ d’adresse et fabrique la bulle avec le nom du chemin et l’heure ;
4. aucun événement de sélection de point ni formateur de bulle n’est exposé par cette carte.

Cette révision frontend ne fournit donc pas de point d’extension public adapté permettant d’enrichir les bulles historiques natives. Les hacks privés ou globaux restent interdits : accès à des propriétés privées, modification de prototype, exploration du Shadow DOM ou altération de composants natifs. Le remplacement du renderer cartographique est lui aussi hors du mandat actuel. U3 n’est pas livré par le candidat `0.1.1-rc.1`.

## Adaptateur préparé

`src/candidate/history-address-adapter.mjs` prépare le contrat de données pour une éventuelle adaptation future, sans autoriser son raccordement dans ce lot :

- clé par personne/source, instant et coordonnées arrondies ; aucune adresse courante réutilisée par défaut ;
- résultat obligatoire avec provenance `recorded` ou `reverse-geocoded` ;
- cache LRU borné (64 entrées par défaut, maximum 512), requêtes identiques dédupliquées ;
- `AbortController`, génération de configuration et refus des réponses tardives après reconfiguration/détachement ;
- absence d’adresse rend `null` ; le comportement d’affichage correspondant appartient à une éventuelle solution future.

Les tests fictifs couvrent deux points à deux adresses, absence d’adresse, déduplication, cache borné, réponse tardive, reconfiguration et détachement. L’adaptateur n’appelle aucun service et n’est pas inclus dans `dist/ha-board.js`.

## Décision nécessaire avant tout nouveau lot U3

U3 reste explicitement non livré et sa suite reste à décider. Aucune option d’architecture ci-dessous n’est autorisée par le mandat actuel :

- attendre qu’un point d’extension public Home Assistant adapté permette d’enrichir les bulles historiques natives ;
- dans un nouveau lot seulement, après décision d’architecture explicite, évaluer un renderer cartographique encapsulé propre à HA-BOARD. Cette option future ne constitue pas une autorisation de remplacer le renderer dans la PR #9.

L’adaptateur ne doit pas être raccordé dans ce lot. Aucun géocodage inverse n’est exécuté et aucune coordonnée n’est envoyée à un service. Si un futur lot envisage l’une de ces opérations, il devra d’abord inventorier une source d’adresses enregistrées à l’époque puis, pour tout géocodage inverse éventuel, obtenir une décision explicite sur le fournisseur, ses limites et sa politique de données.
