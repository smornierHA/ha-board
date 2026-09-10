# Livraison HACS — Dashboard

HA-BOARD est un dépôt HACS personnalisé de catégorie **Dashboard**, pas une intégration `custom_components`.

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=smornierHA&repository=ha-board&category=plugin)

## État réellement atteint avant la livraison Garage

- [`v0.2.0-rc.1`](https://github.com/smornierHA/ha-board/releases/tag/v0.2.0-rc.1) est publiée depuis `a9c885419cea031fb307623076100b04feb78e98`, installée via HACS sans mise à jour en attente.
- Les [six fichiers téléchargés ont été contrôlés](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602574417) : deux JS, deux notices, manifeste et provenance. Météo : SHA256 `f853e1d46c887209ed3dad4c56d592a79bc9e769102654095ea2a7c6f6edc093`. Personnes : SHA256 `80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6`, identique au bundle `v0.1.2-rc.1`.
- Une ressource par module, Personnes avant météo dans le namespace HACS. Configuration du dashboard conservée.
- Chargement et [recette HA ciblée confirmés par l’utilisateur le 9 septembre 2026](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). Cette confirmation ne vaut pas promotion stable ni preuve de chaque combinaison éditeur/thème/mobile.
- L’original météo et le [rollback météo seul](#rollback-météo-seul-non-exécuté) sont disponibles ; aucun rollback réel n’est revendiqué. L’historique Personnes et ses anciens retours arrière restent dans [ACCEPTANCE](ACCEPTANCE.md).

## Installer

1. Dans HACS, ouvrir ⋮ puis **Dépôts personnalisés**.
2. Ajouter `https://github.com/smornierHA/ha-board`, catégorie **Dashboard**.
3. Activer l’affichage des préreleases si nécessaire, sélectionner explicitement la version candidate examinée (contenu courant : `v0.3.0-rc.1`), télécharger et recharger complètement le navigateur.
4. Vérifier la version réellement exécutée et qu’une seule ressource existe sous `/hacsfiles/ha-board/ha-board.js`.
5. Pour ajouter la météo ou Garage, suivre leur migration par ressource ; leurs modules sont téléchargés mais leurs ressources distinctes doivent être configurées explicitement.
6. Exécuter les contrôles applicables de ACCEPTANCE.md puis vérifier la [documentation de livraison](#documentation-à-chaque-livraison).

Les types restent `custom:person-history-map-card-v14` et `custom:person-rich-card-v34`; la version est portée par la release et le diagnostic, pas par le nom affiché.

## Mettre à jour un futur lot

Noter release installée, SHA/empreinte, ressource et résultats de recette. Installer la nouvelle release issue du SHA intégré testé, recharger complètement, vérifier la version exécutée, l’absence de double ressource, puis exécuter la recette ciblée et les invariants des cartes existantes. Une CI verte ne prouve pas cette étape.

Le lot localisation #8 est clos avec `v0.1.2-rc.1` et la recette ciblée publiée. L’ancien U3 n’est pas livré : il a été écarté au profit du backlog #10. Les lots suivants partent de cette base validée, conservent les types YAML existants et prévoient la migration de chaque ressource avant toute installation.

## Retour arrière historique Personnes

Cette voie historique concerne le lot Personnes seul. Elle ne s’applique pas à la bascule météo et ne doit pas retirer une carte installée ultérieurement. Voie HACS à qualifier avant stable : ouvrir HA-BOARD, **Retélécharger**, sélectionner explicitement `v0.1.1-rc.1`, recharger, vérifier la version exécutée et refaire la recette ciblée.

Fallback conservé : désactiver la ressource HACS, réinscrire exactement les deux ressources originales sauvegardées, puis recharger. Ne jamais charger simultanément bundle HACS et originaux. Vérifier les empreintes indiquées dans `source-manifest.json` avant usage.

## Règles pour les futures cartes

Chaque lot inventorie son ou ses composants avant de choisir une ressource. Préserver l’original et son SHA256, utiliser des exemples fictifs, éviter les dépendances globales, maintenir éditeur visuel/catalogue/noms sans version/bouton HACS, construire depuis le SHA intégré et documenter migration et rollback par composant. Une nouvelle carte ne doit pas alourdir ou casser les deux cartes déjà installées.

## Effet d’une fusion documentaire

Le workflow `poc-contracts.yml` exécute aussi `candidate-release` après un push sur `main`, même documentaire. `publish_candidate.py` vérifie alors que le tag existant est un ancêtre du SHA intégré et que le bundle publié est identique : dans ce cas il termine sans créer de release ni écraser un tag ou un asset. Un échec de lecture ou des octets différents arrêtent la publication. Une mise à jour documentaire sans changement d’artefact ne justifie donc pas une nouvelle version ; toute fusion reste une décision explicite et son run doit être vérifié.

## Migration météo 0.2.0-rc.1

`hacs.json` garde `filename: ha-board.js`. Le fichier Personnes reste strictement identique à 0.1.2-rc.1. La météo constitue un **deuxième asset autonome**, `weather-combined-forecast-card.js`, sans import runtime, enregistré uniquement lorsqu’on charge sa ressource dédiée.

Le code HACS **effectivement installé**, relu via HA-MCP le 9 septembre (`repositories/plugin.py` et `repositories/base.py`), choisit l’asset `ha-board.js` comme entrée, puis `release_contents(version)` retourne **tous** les assets de la release. `download_content` les télécharge ; `content.single` règle leur destination, il ne limite pas cette liste à un fichier. La ressource automatique reste celle de l’entrée Personnes. Le publisher joint donc les deux JS, `manifest.json`, `provenance.json`, `THIRD-PARTY-NOTICES.md` et la copie Apache-2.0 à la même release. Le manifeste recense et contrôle les deux JS et les deux notices ; les JSON sont des preuves sans import runtime. La documentation générale HACS seule ne suffit pas à démontrer ce parcours de version installée.

Le contrôle d’une version déjà publiée relit tous les artefacts, notices, manifeste et provenance ; une différence ou une lecture impossible interdit tout écrasement. Le gate de provenance exige la revue `verified` reliée aux notices distribuées. Une future fusion requiert toujours une revue explicite du job de publication.

### Bascule initiale — exécutée le 9 septembre 2026

La [preuve d’installation](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602574417) consigne cette bascule exécutée. Les étapes suivantes décrivent la migration initiale depuis l’original local ; ne pas les rejouer sur une installation déjà migrée.

1. Après acceptation supervision, publication autorisée et avant tout téléchargement/mise à jour HACS, appeler `ha_config_list_dashboard_resources`. Exiger exactement une entrée Personnes `/hacsfiles/ha-board/ha-board.js…` et une météo `/local/weather-combined-forecast-card-v1.17.10.js`, toutes deux `module`. Sauvegarder leurs identifiants, URLs et l’ordre complet. Relire l’original météo et son SHA256 `da5a13fce2b78fe7109394918a1fb80861955ff9d2319d22be1f66197df74f1b` ; comparer toute dérive.
2. Si Personnes précède déjà météo, ne modifier aucun ordre. Dans l’ordre observé le 9 septembre, météo précède Personnes : supprimer **uniquement** la ressource météo avec `ha_config_delete_dashboard_resource`, puis la recréer immédiatement avec `ha_config_set_dashboard_resource(url="/local/weather-combined-forecast-card-v1.17.10.js", resource_type="module")`. La création l’ajoute après Personnes. Relister et exiger Personnes avant météo, une seule occurrence de chacune et l’ordre relatif inchangé de toutes les autres ressources. Si la création échoue, reprendre par la recréation de cette même URL originale ; ne pas lancer HACS tant que ce contrôle n’est pas vert.
3. Autoriser alors le téléchargement HACS de la candidate publiée. La méthode installée `update_dashboard_resources` rencontre Personnes en premier et ne peut plus remplacer l’URL météo. Vérifier les deux JS, les deux notices et les JSON téléchargés contre `dist/manifest.json`, puis relister : Personnes doit porter l’URL/version HACS attendue, météo doit encore pointer sur l’original local.
4. Mettre à jour **la seule ressource météo**, par son nouvel identifiant relu, avec `ha_config_set_dashboard_resource(url="/hacsfiles/ha-board/weather-combined-forecast-card.js?v=0.2.0-rc.1", resource_type="module", resource_id=…)`. Relister et vérifier Personnes avant météo, URL météo exacte et absence de double ressource. Aucun fichier `.storage`, patch HACS ou réordonnancement d’une autre ressource n’intervient.
5. Recharger complètement le navigateur ; vérifier le fichier réellement chargé, son hash et l’unicité du type. Contrôler météo actuelle, min/max daily, heures/changement de jour, pluie/probabilité, soleil, vent/orientation, risques, en-tête, édition et navigation. Les éventuelles actions réelles restent interdites sans mandat distinct.

Le plan JSON reproductible est produit par `scripts/weather_resource_migration.py` depuis un export expurgé de `ha_config_list_dashboard_resources`. Les tests exécutent le corps exact de la méthode HACS installée avec des ressources fictives dans les deux ordres, puis une mise à jour HACS ultérieure. Ils prouvent que seule l’entrée Personnes est mise à jour et que l’URL météo reste distincte ; ils ne constituent pas une recette HA.

### Rollback météo seul, non exécuté

Après activation, mettre à jour par identifiant cette même ressource vers `/local/weather-combined-forecast-card-v1.17.10.js`, après vérification de l’empreinte originale. Relister, recharger complètement et refaire la recette ciblée. Pendant l’étape d’ordre, une interruption après suppression se reprend en recréant l’URL originale ; une interruption après recréation laisse déjà la météo originale active. Le rollback ne modifie ni Personnes ni aucune autre ressource. Aucun downgrade ou réinstallation Personnes n’est nécessaire : le bundle n’a pas changé. Si l’original n’est plus disponible, restaurer sa copie exacte privée avant de changer l’URL.

À chaque future version, vérifier Personnes avant météo **avant** la mise à jour HACS. Après téléchargement et contrôle du nouvel asset météo, mettre à jour explicitement le jeton de version/cache de son URL (`?v=<version>`). HACS n’automatise que l’URL Personnes. La bascule initiale a été exécutée et contrôlée dans HA le 9 septembre. Le cas d’une future mise à jour HACS reste testé sur ressources fictives ; il ne prouve pas une nouvelle mise à jour réelle.

Pour les futurs lots Lit : version exacte + lockfile committé et dépendance incorporée aux fichiers distribués. Aucune dépendance CDN implicite ni nécessité de charger une autre carte pour obtenir Lit.

## Migration Garage 0.3.0-rc.1

`hacs.json` garde `filename: ha-board.js` : Personnes reste l’entrée et doit rester la première ressource du namespace `/hacsfiles/ha-board`. Le package contient trois JS autonomes. Personnes et météo conservent respectivement **38 462** et **142 577 octets**, avec leurs SHA256 déjà validés. Garage ajoute `garage-control-card.js` et sa licence Lit ; il n’est importé par aucun autre module.

Le relevé en lecture seule du 9 septembre montre la ressource Garage locale placée avant Personnes, puis la météo HACS après Personnes. Cette position ne gêne pas tant que Garage reste sous `/local`, mais elle ferait de Garage la première ressource du namespace après son activation HACS et détournerait les mises à jour automatiques suivantes. La bascule commence donc par déplacer **Garage seul**, encore sur son URL originale, après les ressources HA-BOARD. Le plan reproductible est produit par `scripts/garage_resource_migration.py` depuis `examples/resources-garage-candidate.json`.

### Bascule Garage seule — à exécuter uniquement après autorisation

1. Relister les ressources. Exiger exactement une Personnes HACS, une météo HACS et une Garage locale, toutes `module`. Vérifier l’original Garage : 59 336 octets, SHA256 `5edd41a20a51f76998e282c9974cff211f631c7c31ea4c771d2cd173ae3c2f48`. Conserver identifiants, URLs et ordre complet.
2. Tant que Garage précède Personnes, supprimer **uniquement** sa ressource, puis la recréer immédiatement avec son URL originale `/local/garage-control-card.js?v=1.0.1`. Elle est ainsi ajoutée après Personnes/météo. Relister : Personnes doit être la première ressource du namespace, les trois ressources doivent être uniques et l’ordre relatif de toutes les ressources étrangères inchangé. En cas d’interruption après suppression, la seule reprise autorisée est de recréer cette même URL originale puis de relister.
3. Télécharger par HACS la release issue du SHA intégré et testé. Vérifier `ha-board.js`, `weather-combined-forecast-card.js`, `garage-control-card.js`, manifeste, provenance et notices contre `dist/manifest.json`. Relister et vérifier que HACS a changé uniquement l’entrée Personnes ; météo et Garage doivent encore conserver leurs URLs précédentes.
4. Relire l’identifiant Garage obtenu après l’étape 2, puis mettre à jour **cette seule ressource** vers `/hacsfiles/ha-board/garage-control-card.js?v=0.3.0-rc.1` avec `ha_config_set_dashboard_resource`. Relister et exiger Personnes première dans le namespace, trois modules uniques, météo inchangée et aucune variation d’ordre étrangère.
5. Recharger complètement le navigateur et vérifier le fichier réellement chargé, sa version et son empreinte. Recetter affichage, caméra A/B/A, hash/Escape, badges selon configuration (`show_motion_badge: false` reste faux), véhicules, images, état inconnu/indisponible et éditeur. Toute commande réelle ou ouverture physique reste exclue sans mandat spécifique.

Les tests exécutent la méthode HACS installée sur trois modules fictifs, y compris une mise à jour ultérieure : seul Personnes est mis à jour automatiquement. Ils ne modifient aucune ressource réelle et ne prouvent pas une installation HA.

### Rollback Garage seul — non exécuté

Après vérification de l’original, mettre à jour par identifiant la seule ressource Garage vers `/local/garage-control-card.js?v=1.0.1`. Relister, conserver Personnes en première position et la météo inchangée, recharger complètement, contrôler version/empreinte et vérifier l’affichage sans commande physique. Aucun downgrade HACS ni réinstallation Personnes/météo n’est requis. Si l’original actif n’est plus disponible ou dérive, arrêter avant le changement d’URL et restaurer sa copie exacte privée par le canal autorisé.

## Documentation à chaque livraison

1. **Dans la PR produit, avant publication**, aligner le README destiné au tag HACS, le catalogue, les modules/versions et les notes de livraison sur le manifeste candidat. Le README tagué décrit le contenu livré, sans statut transitoire « non publié » : installation et recette évolutives renvoient à une preuve datée et au STATUS courant. Le contrôle documentaire existant vérifie version de release, présence des modules et titre des notes ; les CI légères de PR restent autorisées normalement.
2. **Après publication**, contrôler SHA/tag/assets et les notes de la release ; actualiser les informations HACS par l’action supportée « Mettre à jour les informations ». Cela ne réinstalle pas le produit.
3. **Après installation et essais**, consigner les preuves dans la PR, puis aligner STATUS, ACCEPTANCE et la roadmap. Relire la fiche effectivement renvoyée par HACS, rouvrir la fiche côté navigateur si nécessaire et comparer version, cartes et liens au README courant. Une version installée correcte ne prouve pas une documentation rafraîchie. HACS installé lit le README de la version installée : comparer au tag correspondant, puis distinguer les corrections plus récentes de `main`.
4. Si la fiche reste ancienne, relever l’écart et sa source (README courant, référence taguée ou cache) avant une correction ciblée. Ne pas déplacer un tag ni remplacer des assets pour un texte périmé. Une clôture documentaire seule suit la règle de [fusion sans nouvelle release](#effet-dune-fusion-documentaire).

Le 9 septembre, la méthode `get_documentation` du HACS installé a confirmé la lecture de `installed_version` pour un dépôt installé. Actualiser les informations peut purger le cache ancien mais ne remplace pas le README immuable du tag `v0.2.0-rc.1` par celui de `main`. La correction complète sera donc visible dans HACS avec la prochaine version autorisée ; le README courant et les preuves GitHub sont la référence actualisée.

Origine de ce contrôle : [retour de recette du 9 septembre 2026](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). Cette règle locale de livraison n’ajoute aucun audit global ni dépendance à une nouvelle version du playbook.
