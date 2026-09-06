# Livraison HACS — Dashboard

HA-BOARD est un dépôt HACS personnalisé de catégorie **Dashboard**, pas une intégration `custom_components`.

## Installer

1. Dans HACS, ouvrir ⋮ puis **Dépôts personnalisés**.
2. Ajouter `https://github.com/smornierHA/ha-board`, catégorie **Dashboard**.
3. Télécharger HA-BOARD et recharger complètement le navigateur.
4. Vérifier qu'une seule ressource est active sous `/hacsfiles/ha-board/ha-board.js`. Retirer les anciennes ressources `/local/person-history-map-card-v14.js` et `/local/person-rich-card-v34.js` seulement après avoir sauvegardé leur liste et validé le bundle.

Les types restent `custom:person-history-map-card-v14` et `custom:person-rich-card-v34`. Les exemples sont fictifs.

## Mettre à jour

Noter la release installée et sauvegarder la liste des ressources. Installer la nouvelle release depuis HACS, recharger complètement, vérifier la bannière de version du bundle, puis exécuter `docs/ACCEPTANCE.md`.

## Retour arrière

Dans HACS, ouvrir HA-BOARD, choisir **Retélécharger**, sélectionner la release précédente et recharger complètement. Vérifier la bannière et la recette. Si HACS est indisponible, rétablir les deux anciennes ressources `/local` sauvegardées et désactiver `/hacsfiles/ha-board/ha-board.js`; ne jamais charger les deux générations simultanément.

La CI contrôle bundle, syntaxe, empreintes et contrats simulés. Elle ne prouve ni installation HACS ni rendu réel HA.

## Accès direct et canal candidat

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=smornierHA&repository=ha-board&category=plugin)

Ce lien officiel ouvre la fiche HACS ; confirmer le téléchargement reste nécessaire. Il fonctionne aussi pour les dépôts personnalisés. Voir [My Home Assistant / HACS](https://www.hacs.xyz/docs/use/my/).

Les versions `-rc.N` sont des préreleases destinées à la recette. Activer l’affichage des versions bêta du dépôt dans HACS pour les sélectionner, selon l’interface HACS installée. Un commit téléchargé depuis main n’est pas une release. Le pipeline publie seulement les candidats, après les contrats du SHA réellement intégré ; une version stable exige la recette HA documentée et une publication distincte. Les noms du catalogue restent sans version.
