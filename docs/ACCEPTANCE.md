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

Ces contrôles restent nécessaires avant une stable ; le lot #8 ne les exécute pas sur l’installation HA. Les captures familiales et configurations réelles restent hors Git.

## Séquencement du candidat issue #8 / PR #9 — décisions séparées

Le candidat `0.1.1-rc.1` est actuellement préparé et contrôlé statiquement ; aucune étape ci-dessous ne constitue une autorisation. Les passages futurs sont distincts et doivent conserver leurs preuves propres :

1. **Candidat préparé et contrôlé statiquement** : sources/bundle déjà couverts par les preuves CI acquises ; U3 reste non livré.
2. **Décision éventuelle d’autoriser une recette isolée** : décision séparée, non prise dans ce lot.
3. **Recette isolée** : uniquement si elle reçoit un mandat séparé et si son environnement et ses préconditions sont établis. Aucun environnement isolé de recette ni mécanisme de chargement isolé du candidat n’est prouvé à ce stade ; la version frontend/navigateur, la procédure de retour arrière applicable à cet environnement et le protocole de preuve devront être établis avant exécution.
4. **Revue de supervision** : relire les preuves de la recette isolée si elle a été autorisée et exécutée ; ne déduire aucune autorisation de livraison de cette revue.
5. **Décision distincte de fusion/publication** : seulement après revue, par mandat explicite ; aucune fusion ou release automatique.
6. **Éventuelle installation HACS** : opération séparément autorisée, distincte de la publication et de la recette isolée.
7. **Recette après installation** : vérifier alors la version réellement chargée, la ressource unique, les fonctions du lot et le retour arrière selon la matrice ci-dessous.
8. **Décision éventuelle de promotion ultérieure** : seulement à partir des preuves précédentes ; elle reste indépendante de la PR candidate.

La PR #9 reste draft. Aucune recette HA réelle du candidat, fusion, publication, installation HACS ou promotion n’est autorisée par ce document.

## Recette ciblée du lot #8 / PR #9

Les contrats Node s’exécutent sur les sources maintenues puis sur le bundle reconstruit ; les contrats de l’adaptateur U3 sont séparés puisque cet adaptateur n’est pas livré. Ils ne cochent aucune case HA réelle.

| Besoin / invariant | Simulation attendue | Recette HA future — uniquement sous mandat séparé |
|---|---|---|
| Zone puis ville | domicile, zone nommée, ville structurée, adresse seule, ville absente ; rue/pays/coordonnées refusés | compact + détail, quatre personnes fictives ou données privées non publiées |
| Durée | durée visible avec Maison, absente de la ligne ville hors domicile | vérifier le sens du capteur de durée réel |
| Dernière position connue | adresse lisible ; coordonnées/précision et sources/dates distinctes de position, adresse et zone dans **Qualité** | ouvrir/fermer au clavier et au toucher, puis navigation et rechargement froid |
| Fidélité | `unknown`/`unavailable`, « Hors zone », adresse antérieure à l’entrée dans la zone, ville incohérente, timestamp futur, coordonnées distinctes | confirmer les libellés avec les sources réelles sans capture publique |
| Éditeur | date d’adresse et seuil d’ancienneté présents dans `getConfigForm` | modifier, sauvegarder, rouvrir ; vérifier conservation des clés YAML non éditées |
| Invariants | historique natif, filtres multiples/Tous-aucun, couleurs, Memoji, batteries/charge, navigation | desktop/mobile, clair/sombre, plusieurs instances |
| U3 | adaptateur : deux points/deux adresses, absence, cache, déduplication, réponse tardive, reconfiguration, détachement | non recettable dans ce lot ; U3 reste non livré et le remplacement du renderer n’est pas autorisé sans décision explicite et nouveau lot |

Rollback du futur candidat : dans HACS, retélécharger explicitement `v0.1.0-rc.2`, recharger complètement le navigateur, vérifier la version exécutée et la ressource unique, puis reprendre la recette des deux cartes. Le fallback vers les originaux reste la seconde voie, sans chargement simultané.
