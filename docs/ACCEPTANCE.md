# Recette et critères avant une éventuelle stable

La CI et les contrats simulés ne constituent pas une recette Home Assistant réelle. `v0.1.2-rc.1` est publiée depuis `21c8212f8ae47fb3ff7d86131dd7c821c688b46e`, installée via HACS et chargée dans le navigateur ; l’utilisateur a confirmé sa recette HA ciblée le 9 septembre 2026. Cette clôture ne vaut pas promotion stable.

## Correctif visuel `v0.1.2-rc.1`

Les contrôles Node couvrent sources **et** bundle reconstruit avec données fictives :

| Cas | Attendu |
|---|---|
| Zone présente | la zone HA nommée est le libellé compact et détaillé |
| Ville sans zone | le nom de ville seul est affiché |
| Suffixe pays | `Ville Exemple, France` et une adresse postale sans virgules donnent `Ville Exemple` comme libellé ; l’adresse distincte reste complète |
| Noms légitimes | `Roissy-en-France`, `Roissy en France` et `Val de France` ne sont pas tronqués |
| Ville absente | fallback sobre, sans rue/pays/code postal inventé comme ville |
| Source ancienne/future/incohérente | contrôle interne conservé ; la source future/incohérente n’est pas présentée comme courante |
| Durée hors domicile | aucune durée n’est attribuée à la ville |
| Nettoyage visuel | absence du bandeau présence/dernière position, du dépliant Qualité et de la note de fraîcheur trajet |
| Invariants | Memoji, batteries/charge, téléphone/tablette, Proximité/Trajet/Destination, navigation, éditeurs et Person History Map préservés |

Les assertions historiques qui exigeaient la précision, les dates, les sources ou les avertissements dans le DOM sont remplacées par des vérifications des valeurs internes et par l’absence explicite de ces textes dans le rendu. Les [CI intégrées](https://github.com/smornierHA/ha-board/actions/runs/34258176907) sont réussies : 43/43 contrats sources et bundle, plus la régression ciblée du fallback postal sans virgules.

## Recette Home Assistant ciblée close — 9 septembre 2026

La [confirmation utilisateur consolidée](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) établit le chargement après rafraîchissement forcé de Personnes puis la recette ciblée des vues compactes/détaillées et de la navigation, sans anomalie signalée. Les [contrôles techniques](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597510216) identifient la version HACS, le bundle installé et la ressource active.

La réserve du banc de capture automatique Puppet porte sur ce banc ; elle ne bloque plus cette recette confirmée dans le navigateur utilisateur authentifié. Aucune capture automatique complète n’est revendiquée.

## Compléments avant une éventuelle promotion stable

La recette ciblée close ne prouve pas automatiquement les autres cases de la [roadmap](ROADMAP.md) :

- **S2** : ouverture, modification, sauvegarde et réouverture des deux éditeurs réels ;
- **S3** : matrice desktop/mobile et thèmes clair/sombre intégralement consignée ;
- **S4** : downgrade HACS ou fallback original effectivement exécuté et vérifié ;
- **S5** : décision distincte de promotion stable après revue des preuves.

`v0.1.1-rc.1` est le retour arrière disponible. Sa disponibilité n’est pas une preuve de downgrade testé. Aucun de ces compléments n’est un prérequis pour reconnaître la clôture du correctif ciblé déjà validé.

## U3 / backlog #10

L’ancien U3 d’adresse dans les bulles historiques natives est écarté par décision utilisateur et **non livré**. Aucun prototype U3 n’est demandé dans ce lot. Le graphe historique durée + position de #10 est un lot futur distinct et n’entre pas dans la recette de `v0.1.2-rc.1`.

Aucune capture familiale ni donnée réelle n’est nécessaire ou autorisée dans GitHub. Une PR/CI verte ne vaut ni fusion, ni publication, ni installation HACS, ni recette Home Assistant.
