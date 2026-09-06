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
