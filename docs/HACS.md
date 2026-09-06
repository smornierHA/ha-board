# Livraison HACS — Dashboard

HA-BOARD est un dépôt HACS personnalisé de catégorie **Dashboard**, pas une intégration `custom_components`.

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=smornierHA&repository=ha-board&category=plugin)

## État réellement atteint

- `v0.1.0-rc.2` est publiée sur `eeb56c9b66346b90275820a6d6fb4ca0fb94cebe`.
- La mise à jour depuis l’installation `c164258` a été exécutée par HACS.
- HACS relu : `installed_version=v0.1.0-rc.2`, `pending_upgrade=false`.
- Le fichier installé est identique à l’artefact publié (SHA256 `79df079bdc2c752956e808df2c492791213eaebe36fe854f60bfecb0061160c8`).
- Une seule ressource est active sous `/hacsfiles/ha-board/ha-board.js`; aucune double inscription `/local`.
- Le downgrade HACS vers une version antérieure n’a pas été testé. Le fallback vers les originaux est prêt mais non rejoué.

## Installer

1. Dans HACS, ouvrir ⋮ puis **Dépôts personnalisés**.
2. Ajouter `https://github.com/smornierHA/ha-board`, catégorie **Dashboard**.
3. Activer l’affichage des préreleases si nécessaire, sélectionner explicitement `v0.1.0-rc.2`, télécharger et recharger complètement le navigateur.
4. Vérifier la version réellement exécutée et qu’une seule ressource existe sous `/hacsfiles/ha-board/ha-board.js`.
5. Exécuter les contrôles applicables de ACCEPTANCE.md.

Les types restent `custom:person-history-map-card-v14` et `custom:person-rich-card-v34`; la version est portée par la release et le diagnostic, pas par le nom affiché.

## Mettre à jour un futur lot

Noter release installée, SHA/empreinte, ressource et résultats de recette. Installer la nouvelle release issue du SHA intégré testé, recharger complètement, vérifier la version exécutée, l’absence de double ressource, puis exécuter la recette ciblée et les invariants des cartes existantes. Une CI verte ne prouve pas cette étape.

## Retour arrière

Voie HACS à qualifier avant stable : ouvrir HA-BOARD, **Retélécharger**, sélectionner la release précédente, recharger, vérifier la version exécutée et refaire la recette ciblée.

Fallback conservé : désactiver la ressource HACS, réinscrire exactement les deux ressources originales sauvegardées, puis recharger. Ne jamais charger simultanément bundle HACS et originaux. Vérifier les empreintes indiquées dans STATUS.md avant usage.

## Règles pour les futures cartes

Chaque lot inventorie son ou ses composants avant de choisir une ressource. Préserver l’original et son SHA256, utiliser des exemples fictifs, éviter les dépendances globales, maintenir éditeur visuel/catalogue/noms sans version/bouton HACS, construire depuis le SHA intégré et documenter migration et rollback par composant. Une nouvelle carte ne doit pas alourdir ou casser les deux cartes déjà installées.
