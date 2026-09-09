# Recette et critères avant une éventuelle stable

La distribution courante est `v0.2.0-rc.1` ; la [recette HA météo ciblée du 9 septembre 2026](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067) est confirmée par l’utilisateur après installation contrôlée. Les sections Personnes ci-dessous conservent la preuve du lot précédent. La CI et les contrats simulés ne constituent pas une recette Home Assistant réelle. `v0.1.2-rc.1` est publiée depuis `21c8212f8ae47fb3ff7d86131dd7c821c688b46e`, installée via HACS et chargée dans le navigateur ; l’utilisateur a confirmé sa recette HA ciblée le 9 septembre 2026. Cette clôture ne vaut pas promotion stable.

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

## Météo #12 — v0.2.0-rc.1, recette ciblée close

Les 43 contrats Personnes doivent passer sur source et bundle, et le SHA256 Personnes rester `80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6`. Les 22 contrats météo exécutent séparément source et fichier construit : abonnement tardif, A/B/A, détachement/reconnexion, connexion remplacée, événements ready/disconnected, erreurs tardives, plusieurs instances, zéro/données absentes, périodes, pluie, orientation, risques et actions simulées. Pour l’éditeur, ils couvrent YAML minimal et valeurs effectives, `false`/`0`, modification ciblée, retour/suppression au défaut, sauvegarde/réouverture, objets, types, clés inconnues et unités héritées conservées hors contrôles.

La démo `examples/weather-demo.html` utilise exclusivement des données fictives et une horloge figée. `tests/weather-browser.mjs` vérifie les deux fichiers dans Chrome : desktop sombre/mobile clair, navigation, reconnexion, risques footer/header, formulaire simulé et conservation des options. Ses captures ne sont pas des captures HA. Le formulaire et les icônes de simulation ne prouvent pas le rendu natif de `ha-form`/`ha-icon`.

Le test R2 exécute le corps exact de `update_dashboard_resources` lu dans HACS installé sur des ressources fictives : ordre météo/Personnes, ordre Personnes/météo, téléchargement suivant et mise à jour ultérieure. La préparation de la recette demandait d’établir Personnes avant météo selon `HACS.md`, vérifier le téléchargement de tous les assets et notices, actualiser explicitement l’URL/version/cache météo, vérifier une ressource météo unique, fichier réellement chargé, configuration privée conservée, rendu existant, éditeur natif (ouvrir/modifier/sauver/rouvrir), thèmes et navigation. Le rollback météo seul doit rester disponible. Aucune commande réelle n’est exécutée par le banc.

L’[installation réelle](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602574417) a ensuite contrôlé les six fichiers, la conservation de la configuration et la bascule unique météo. L’utilisateur confirme les essais natifs globalement concluants : [clôture](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). Ce retour clôt le lot ciblé ; il ne documente pas séparément chaque contrôle d’éditeur/thème/mobile ni un rollback exécuté. La seule remarque restante porte sur la documentation HACS ; son alignement fait désormais partie du [parcours de livraison](HACS.md#documentation-à-chaque-livraison).

## Garage #13 — candidat 0.3.0-rc.1

La PR draft doit établir par tests simulés la fermeture de G1, l’ignorance des réponses tardives, la protection contre double commande, les modes pulse/stateful/cover, les états unknown/unavailable et le fait qu’un succès de service ne confirme pas l’état physique. Elle doit aussi couvrir caméra A/B/A, nettoyage, plusieurs instances, navigation/hash/Escape et l’éditeur natif avec valeurs effectives, `false`/`0`, modification ciblée, clés inconnues et réouverture.

La comparaison navigateur utilise seulement des entités, images et services fictifs. Elle ne prouve ni le composant `ha-form` réel, ni l’affichage dans Home Assistant, ni une commande ou ouverture physique. Avant toute publication autorisée, la revue doit confirmer la provenance, les licences, les empreintes distinctes original/export/candidat/distribution, le caractère autonome du module et l’intégrité octet pour octet de Personnes et météo.

Après une future publication distinctement autorisée, la recette HA ciblée devra vérifier : fiche README du tag dans HACS, ressource Garage unique, version réellement chargée, configuration privée conservée, rendu et images existants, caméra native picture-entity, navigation/hash/Escape, plusieurs instances, éditeur ouvrir/modifier/sauver/rouvrir, commande réelle contrôlée et confirmation physique. Le rollback Garage seul doit être vérifié sans modifier Personnes, météo ni les autres ressources. Aucune de ces étapes réelles n’est accomplie par la PR de préparation.
