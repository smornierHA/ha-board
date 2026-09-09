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
