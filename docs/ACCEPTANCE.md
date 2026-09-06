# Recette et critères avant une éventuelle stable

La CI et les contrats simulés ne cochent pas une recette Home Assistant réelle. Le retour favorable général prouve l’utilisabilité de la candidate comme base, sans détailler les cases ci-dessous.

| Contrôle | Preuve disponible au 2026-09-06 | Statut |
|---|---|---|
| Bundle intégré | 28/28 contrats sur sources et bundle, run `34044344961` | CI validée |
| Installation / mise à jour HACS | passage de `c164258` à `v0.1.0-rc.2`, fichier relu identique | Déployé et vérifié au niveau fichier |
| Ressource unique | une URL HACS, aucune double ressource `/local` | Vérifié |
| Fonctionnement général | retour utilisateur favorable | Validé globalement, détails non ventilés |
| Version réellement exécutée dans le navigateur | aucune preuve détaillée conservée | À établir avant stable |
| Refresh à froid et navigation aller-retour répétés | correction couverte en simulation ; résultat réel non détaillé | À établir |
| Éditeur Person History : modifier, sauvegarder, rouvrir | formulaire présent/contractuel | À établir |
| Éditeur Person Rich : modifier, sauvegarder, rouvrir | formulaire présent/contractuel | À établir |
| Conservation des clés YAML non éditées | schéma/contrats disponibles | À établir dans HA |
| Desktop et mobile | aucun résultat détaillé fourni | À établir |
| Thèmes clair et sombre | aucun résultat détaillé fourni | À établir |
| Fonctions familiales existantes | utilisateur satisfait globalement ; pas de matrice par fonction | À ventiler seulement si promotion stable |
| Downgrade HACS vers une release antérieure | procédure disponible | Non exécuté |
| Fallback vers les deux originaux | URLs et fichiers/empreintes préservés | Préparé, non exécuté dans ce cycle |

## Seuil de promotion stable

Une éventuelle version stable exige une décision explicite après :

1. preuve de la version exécutée par le navigateur après rechargement complet ;
2. recette ciblée des deux éditeurs avec sauvegarde/réouverture ;
3. refresh à froid/navigation sur desktop et mobile, en thèmes clair et sombre ;
4. au moins un retour arrière réellement exécuté : downgrade HACS de préférence, ou fallback original documenté si le downgrade n’est pas disponible ;
5. absence de régression sur les fonctions déclarées dans CARDS.md, avec une seule ressource active ;
6. release stable issue d’un nouveau SHA intégré et testé, sans déplacer ni écraser `v0.1.0-rc.2`.

Ces contrôles ne sont pas demandés dans la PR documentaire actuelle. Les captures familiales et configurations réelles restent hors Git.
