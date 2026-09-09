# Livraison HACS — Dashboard

HA-BOARD est un dépôt HACS personnalisé de catégorie **Dashboard**, pas une intégration `custom_components`.

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=smornierHA&repository=ha-board&category=plugin)

## État réellement atteint

- [`v0.1.2-rc.1`](https://github.com/smornierHA/ha-board/releases/tag/v0.1.2-rc.1) est publiée sur `21c8212f8ae47fb3ff7d86131dd7c821c688b46e`.
- [HACS et bundle contrôlés](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597510216) : version installée `v0.1.2-rc.1`, sans mise à jour en attente ; bundle relevé de 38 462 octets. Empreinte attendue du bundle publié : SHA256 `80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6`. L’empreinte déclarée est cohérente avec cette référence ; le rapport d’installation n’a pas recalculé le hash des octets installés.
- Une seule ressource est active sous `/hacsfiles/ha-board/ha-board.js` ; aucune double inscription `/local`.
- Le chargement navigateur après rafraîchissement forcé et la recette HA ciblée ont été [confirmés par l’utilisateur le 9 septembre 2026](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326).
- Le rollback `v0.1.1-rc.1` reste disponible. Aucun downgrade n’a été rejoué dans ce lot ; le fallback original reste distinct.

## Installer

1. Dans HACS, ouvrir ⋮ puis **Dépôts personnalisés**.
2. Ajouter `https://github.com/smornierHA/ha-board`, catégorie **Dashboard**.
3. Activer l’affichage des préreleases si nécessaire, sélectionner explicitement `v0.1.2-rc.1`, télécharger et recharger complètement le navigateur.
4. Vérifier la version réellement exécutée et qu’une seule ressource existe sous `/hacsfiles/ha-board/ha-board.js`.
5. Exécuter les contrôles applicables de ACCEPTANCE.md.

Les types restent `custom:person-history-map-card-v14` et `custom:person-rich-card-v34`; la version est portée par la release et le diagnostic, pas par le nom affiché.

## Mettre à jour un futur lot

Noter release installée, SHA/empreinte, ressource et résultats de recette. Installer la nouvelle release issue du SHA intégré testé, recharger complètement, vérifier la version exécutée, l’absence de double ressource, puis exécuter la recette ciblée et les invariants des cartes existantes. Une CI verte ne prouve pas cette étape.

Le lot localisation #8 est clos avec `v0.1.2-rc.1` et la recette ciblée publiée. L’ancien U3 n’est pas livré : il a été écarté au profit du backlog #10. Les lots suivants partent de cette base validée, conservent les types YAML existants et prévoient la migration de chaque ressource avant toute installation.

## Retour arrière

Voie HACS à qualifier avant stable : ouvrir HA-BOARD, **Retélécharger**, sélectionner explicitement `v0.1.1-rc.1`, recharger, vérifier la version exécutée et refaire la recette ciblée.

Fallback conservé : désactiver la ressource HACS, réinscrire exactement les deux ressources originales sauvegardées, puis recharger. Ne jamais charger simultanément bundle HACS et originaux. Vérifier les empreintes indiquées dans `source-manifest.json` avant usage.

## Règles pour les futures cartes

Chaque lot inventorie son ou ses composants avant de choisir une ressource. Préserver l’original et son SHA256, utiliser des exemples fictifs, éviter les dépendances globales, maintenir éditeur visuel/catalogue/noms sans version/bouton HACS, construire depuis le SHA intégré et documenter migration et rollback par composant. Une nouvelle carte ne doit pas alourdir ou casser les deux cartes déjà installées.

## Effet d’une fusion documentaire

Le workflow `poc-contracts.yml` exécute aussi `candidate-release` après un push sur `main`, même documentaire. `publish_candidate.py` vérifie alors que le tag existant est un ancêtre du SHA intégré et que le bundle publié est identique : dans ce cas il termine sans créer de release ni écraser un tag ou un asset. Un échec de lecture ou des octets différents arrêtent la publication. Une mise à jour documentaire sans changement d’artefact ne justifie donc pas une nouvelle version ; toute fusion reste une décision explicite et son run doit être vérifié.

## Pilote météo 0.2.0-rc.1 — préparation seulement

`hacs.json` garde `filename: ha-board.js`. Le fichier Personnes reste strictement identique à 0.1.2-rc.1. La météo constitue un **deuxième asset autonome**, `weather-combined-forecast-card.js`, sans import runtime, enregistré uniquement lorsqu’on charge sa ressource dédiée.

Le code HACS **effectivement installé**, relu via HA-MCP le 9 septembre (`repositories/plugin.py` et `repositories/base.py`), choisit l’asset `ha-board.js` comme entrée, puis `release_contents(version)` retourne **tous** les assets de la release. `download_content` les télécharge ; `content.single` règle leur destination, il ne limite pas cette liste à un fichier. La ressource automatique reste celle de l’entrée Personnes. Le publisher doit donc joindre les deux JS, `manifest.json` et `provenance.json` à la même release. Tous les JS du candidat sont explicitement recensés et contrôlés ; les deux JSON sont des preuves, sans import runtime. La documentation générale HACS seule ne suffit pas à démontrer ce parcours de version installée.

Le contrôle d’une version déjà publiée relit désormais tous les artefacts, le manifeste et la provenance ; une différence ou une lecture impossible interdit tout écrasement. Le publisher refuse une publication tant que la réserve de licence météo n’est pas levée. Une future fusion requiert donc une revue explicite du gate de provenance et du job de publication.

### Bascule préparée, non exécutée

1. Après acceptation supervision et autorisation de livraison, publier depuis le SHA intégré testé, puis autoriser le téléchargement HACS de cette candidate. Vérifier tous les fichiers téléchargés et leurs SHA256 ; vérifier que la ressource Personnes et ses octets sont toujours inchangés.
2. Relire la ressource météo active et l’empreinte de son original. Si elles ont changé, comparer le delta. Conserver la configuration privée et l’original exact hors Git.
3. Remplacer **la seule ressource météo existante** `/local/weather-combined-forecast-card-v1.17.10.js` par `/hacsfiles/ha-board/weather-combined-forecast-card.js?v=0.2.0-rc.1`, type module, sans changer son type YAML ni sa configuration. Ne jamais laisser les deux ressources actives en même temps.
4. Recharger complètement le navigateur ; vérifier le fichier réellement chargé, son hash et l’unicité du type. Contrôler météo actuelle, min/max daily, heures/changement de jour, pluie/probabilité, soleil, vent/orientation, risques, en-tête, édition et navigation. Les éventuelles actions réelles restent interdites sans mandat distinct.

### Rollback météo seul, non exécuté

Restaurer sur cette même ressource l’URL `/local/weather-combined-forecast-card-v1.17.10.js`, en vérifiant d’abord que ses octets correspondent à `da5a13fce2b78fe7109394918a1fb80861955ff9d2319d22be1f66197df74f1b`. Retirer toute autre ressource météo candidate, recharger complètement et refaire la recette ciblée. Aucun downgrade ou réinstallation Personnes n’est nécessaire : le bundle n’a pas changé. Si l’original n’est plus disponible, restaurer sa copie exacte privée avant de changer l’URL.

**Limite HACS à surveiller :** `update_dashboard_resources` s’arrête au premier élément du namespace `/hacsfiles/ha-board`. Après ajout manuel de la ressource météo, conserver l’entrée Personnes avant elle et recontrôler les deux URLs après chaque mise à jour HACS. Le comportement a été lu, pas exécuté sur la production dans ce lot. Une seule ressource par type reste exigée.

Pour les futurs lots Lit : version exacte + lockfile committé et dépendance incorporée aux fichiers distribués. Aucune dépendance CDN implicite ni nécessité de charger une autre carte pour obtenir Lit.
