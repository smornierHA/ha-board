# Recette et critères avant une éventuelle stable

La CI et les contrats simulés ne constituent pas une recette Home Assistant réelle. `v0.1.1-rc.1` est publiée depuis `d71e66ac3e6c1b6f8df728c248c0e7f32b5dd4e8` et son installation est confirmée par l’utilisateur ; ce retour visuel motive `0.1.2-rc.1` mais ne valide pas une stable.

## Correctif visuel `0.1.2-rc.1`

Les contrôles Node doivent couvrir sources **et** bundle reconstruit avec données fictives :

| Cas | Attendu |
|---|---|
| Zone présente | la zone HA nommée est le libellé compact et détaillé |
| Ville sans zone | le nom de ville seul est affiché |
| Suffixe pays | `Ville Exemple, France` devient `Ville Exemple` comme libellé ; l’adresse distincte peut rester complète |
| Ville absente | fallback sobre, sans rue/pays/code postal inventé comme ville |
| Source ancienne/future/incohérente | contrôle interne conservé ; la source future/incohérente n’est pas présentée comme courante |
| Durée hors domicile | aucune durée n’est attribuée à la ville |
| Nettoyage visuel | absence du bandeau présence/dernière position, du dépliant Qualité et de la note de fraîcheur trajet |
| Invariants | Memoji, batteries/charge, téléphone/tablette, Proximité/Trajet/Destination, navigation, éditeurs et Person History Map préservés |

Les assertions historiques qui exigeaient la précision, les dates, les sources ou les avertissements dans le DOM sont remplacées par des vérifications des valeurs internes et par l’absence explicite de ces textes dans le rendu.

## Recette Home Assistant restant à faire sous mandat séparé

Avant toute promotion stable, vérifier sur la version réellement chargée :

1. compact et détail après rechargement complet ;
2. zone, ville hors zone, adresse distincte et absence des trois éléments retirés ;
3. Memoji, batteries/charge, équipements et blocs Proximité/Trajet/Destination ;
4. navigation clavier/tactile ;
5. éditeur, sauvegarde et réouverture en conservant les clés YAML existantes ;
6. desktop/mobile et thèmes clair/sombre ;
7. ressource HACS unique ;
8. retour arrière vers `v0.1.1-rc.1` ou fallback original si nécessaire.

## U3 / backlog #10

L’ancien U3 d’adresse dans les bulles historiques natives est écarté par décision utilisateur et **non livré**. Aucun prototype U3 n’est demandé dans ce lot. Le graphe historique durée + position de #10 est un lot futur distinct et n’entre pas dans la recette de `0.1.2-rc.1`.

Aucune capture familiale ni donnée réelle n’est nécessaire ou autorisée dans GitHub. Une PR/CI verte ne vaut ni fusion, ni publication, ni installation HACS, ni recette Home Assistant.
