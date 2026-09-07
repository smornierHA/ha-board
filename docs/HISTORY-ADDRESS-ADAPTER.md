# U3 — adresses des points historiques

## Point d’extension vérifié

Vérification du 7 septembre 2026 sur le frontend Home Assistant `20260729.7`, commit `91c28c2f587553a817a315cfbbeee072a6ed5de4` :

1. le flux `history/stream` fournit des états compressés contenant `s`, `a` et `lu` ; les domaines `person` et `device_tracker` demandent leurs attributs ;
2. `hui-map-card` construit ensuite chaque point avec uniquement `point` et `timestamp` ;
3. `ha-map` définit ce type public sans champ d’adresse et fabrique la bulle avec le nom du chemin et l’heure ;
4. aucun événement de sélection de point ni formateur de bulle n’est exposé par cette carte.

Le wrapper ne peut donc pas ajouter une adresse à la bulle native sans accéder à des propriétés privées, modifier un prototype, explorer le Shadow DOM ou remplacer le rendu cartographique. Ces quatre méthodes sont exclues. U3 n’est pas livré par le candidat `0.1.1-rc.1`.

## Adaptateur préparé

`src/candidate/history-address-adapter.mjs` prépare le contrat de données pour une future adaptation encapsulée :

- clé par personne/source, instant et coordonnées arrondies ; aucune adresse courante réutilisée par défaut ;
- résultat obligatoire avec provenance `recorded` ou `reverse-geocoded` ;
- cache LRU borné (64 entrées par défaut, maximum 512), requêtes identiques dédupliquées ;
- `AbortController`, génération de configuration et refus des réponses tardives après reconfiguration/détachement ;
- absence d’adresse rend `null`, donc « Adresse inconnue » devra être affiché pour ce point par le futur renderer.

Les tests fictifs couvrent deux points à deux adresses, absence d’adresse, déduplication, cache borné, réponse tardive, reconfiguration et détachement. L’adaptateur n’appelle aucun service et n’est pas inclus dans `dist/ha-board.js`.

## Décision nécessaire avant raccordement

Deux voies restent proportionnées : attendre un point d’extension public HA pour enrichir les bulles, ou valider un renderer cartographique encapsulé propre à HA-BOARD qui reproduit les fonctions natives conservées. Dans les deux cas, inventorier d’abord une source d’adresses enregistrées à l’époque. Un géocodage inverse éventuel doit être opt-in, identifier son fournisseur, ses limites et sa politique de données ; aucune coordonnée familiale n’est envoyée à un nouveau service dans ce lot.
