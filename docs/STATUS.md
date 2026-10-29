# État courant — 9 septembre 2026

## Plan — usages tactiles et tâches du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.3.0-rc.2** sépare les cycles terminés dans **À récupérer**, conserve **Entretien** pour piles/filtres/consommables, et exclut les robots sur leur base du compteur actif. Lumières et Ouvertures mettent en évidence les pièces équipées même au repos. Les lumières se commandent par pièce ou niveau ; les autres niveaux suivent les associations natives HA. Retour haptique natif à l’envoi d’une action, distinct en cas d’échec, sans rafale par lampe pour un groupe ; recette physique iOS non revendiquée. Une association de zone est corrigée, la flèche de baie retirée, les illustrations et positions conservées. Tests purs et 11 groupes navigateur sur services simulés réussis. Géométrie et identités domestiques restent privées. Installé sur l’accueil ; module, modèle, guide et configuration relus à l’identique, 43 autres ressources conservées. Chargement de cette révision et vibration physique à confirmer dans l’app utilisateur. Preuve : `../evidence/home-plan-actions-2026-10-29.json`. Aucune fusion ni release HACS.


## Plan — signalements du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.3.0-rc.1** organise les priorités, la maintenance et les informations d’activité par équipement, pièce et niveau. Les détecteurs au repos sont masqués sur le plan ; un mode Art confirmé n’est pas une TV en service. Jauges et centrage des icônes corrigés, illustrations des volets conservées et préférence consignée. Les positions modifiées par l’utilisateur sont préservées. Géométrie, associations et règles domestiques restent privées. Un seul appareil change de zone conformément à la demande. Contrats purs raccordés au workflow existant et banc navigateur local sur services simulés ; aucun moteur actionné. Voir `HOME-PLAN.md` et la preuve du lot. Installé ; fichiers et configuration relus à l’identique, autre configuration et 43 ressources conservées. Chargement utilisateur de cette révision non revendiqué. Preuve : `../evidence/home-plan-notifications-2026-10-29.json`. Pas de changement du package HACS, fusion ou release.

## Plan familial — améliorations du 29 octobre 2026

Le retour utilisateur confirme le chargement du premier candidat et précise les corrections de géométrie/repères. Le candidat autonome **0.2.0-rc.2** ajoute le placement visuel des repères existants, les lumières sur le plan, les volets groupés par pièce/niveau, le traitement distinct des écrans avec limite de course, les équipements regroupés par appareil et la sélection explicite de température ambiante. Les icônes sont natives HA. Les originaux, géométrie et bindings domestiques restent hors Git public. Tests navigateur sur bundle figé et services simulés ; aucune commande physique de test. Installé sur la carte existante ; nouveaux fichiers et configuration relus à l’identique. Capture native expirée après 25 secondes, nouvelle recette utilisateur et mouvements physiques non revendiqués. État et limites : `HOME-PLAN.md`, preuve datée du lot. Le package HACS courant, les autres composants et les associations globales ne sont pas modifiés.

## Plan familial — préparation du 25 octobre 2026

**Plan de la maison 0.1.0-rc.2 installé comme candidat autonome sur l’accueil.** Module 91 363 octets, SHA256 `17c13bca30fb5f89922c5f60a22fbd6f023f960bb773e19309a1bfb30d211b75`, relu à l’identique. Un bloc remplacé et une ressource ajoutée ; 43 autres ressources et le reste du dashboard inchangés. Deux zones créées, deux appareils de détection et huit libellés corrigés ; huit associations héritées vérifiées sans renommage d’ID. Vingt-quatre nouveaux fichiers relus, dont le premier bundle candidat conservé. La géométrie, les photos et les associations réelles restent privées.

Contrôles Chromium locaux sur bundle figé, clair/sombre, 320/390/736 px, commandes ciblées simulées, inconnus/indisponibles, contacts indépendants, impulsion, héritage/actualisation des zones, éditeur et repères sur HTTP. Le moteur de capture HA échouait avant installation (HTTP 500) et reste indisponible après (connexion interrompue). **Chargement sur le navigateur utilisateur et recette physique non revendiqués.** Pas de fusion ni de release HACS du Plan. Détails : `HOME-PLAN.md`, preuve expurgée `../evidence/home-plan-native-2026-10-25.json`. La météo reste dans son lot PR #19.

**Distribution installée : `v0.2.0-rc.1`, météo et Personnes.** Le lot météo est clos après les essais natifs globalement concluants confirmés par l’utilisateur. [Décision de supervision](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067).

**Candidat Garage : `v0.3.0-rc.1`, préparation de #13.** Source 1.0.1 relue sans dérive via HA-MCP ; export public expurgé et source maintenue 1.1.0 distincts. Le candidat corrige G1, les réponses tardives et le cycle de vie caméra à la reconnexion/reconfiguration, incorpore Lit, ajoute l’éditeur natif et prépare une bascule/rollback Garage seuls. Les contrats Node et comparaisons Chrome utilisent des doubles et doivent être rattachés à la CI exacte de la PR. État : préparé et testé par simulation ; non accepté, non fusionné, non publié, non installé, non chargé, non recetté dans HA. Aucun service réel n’a été appelé.

| Étape météo | État prouvé | Référence |
|---|---|---|
| Préparé, testé, accepté | PR #16 ; 22 contrats météo et 43 Personnes sur sources et distributions, 16 tests Python et rendu fictif | [Revue finale](https://github.com/smornierHA/ha-board/pull/16#pullrequestreview-5154581535) |
| Fusionné et publié | `v0.2.0-rc.1`, SHA `a9c885419cea031fb307623076100b04feb78e98` | [CI intégrée réussie](https://github.com/smornierHA/ha-board/actions/runs/34354484728), [release](https://github.com/smornierHA/ha-board/releases/tag/v0.2.0-rc.1) |
| Installé | HACS `v0.2.0-rc.1`, aucune mise à jour en attente ; fichiers et ressources contrôlés | [Preuve d’installation](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602574417) |
| Chargé et recette HA ciblée | Confirmation utilisateur du 9 septembre, tests globalement concluants | [Clôture](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067) |
| Rollback météo | Original et procédure disponibles ; non exécuté | [Procédure ciblée](HACS.md#rollback-météo-seul-non-exécuté) |

Météo distribuée/installée : **142 577 octets**, SHA256 `f853e1d46c887209ed3dad4c56d592a79bc9e769102654095ea2a7c6f6edc093`. Personnes : **38 462 octets**, SHA256 `80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6`, inchangé depuis `v0.1.2-rc.1` (Person Rich 3.4.7, Person History Map 1.4.2). Les empreintes des fichiers installés ont été recalculées lors de l’installation météo.

La remarque mineure sur la documentation HACS conduit à aligner README/catalogue/état et à contrôler la documentation avant publication puis après déploiement. Aucune anomalie fonctionnelle nouvelle signalée ; aucune matrice exhaustive éditeurs/thèmes/mobile ni promotion stable n’est déduite de la recette ciblée. Le banc de capture indisponible ne remet pas en cause les essais natifs de l’utilisateur.

**Prochaine étape : revue consolidée de la PR draft Garage #13**, puis décision séparée de fusion/publication. Portail #14 et historique #10 restent séparés. La maintenance du socle RC.8 ne bloque pas ces lots et son adoption complète n’est pas revendiquée.

## Historique clos : Personnes `v0.1.2-rc.1`

Le lot `v0.1.2-rc.1` est **publié, installé via HACS, chargé dans le navigateur et validé par la recette Home Assistant ciblée de l’utilisateur**. La [clôture de supervision](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) consolide les preuves techniques et la confirmation reçue le 9 septembre après rafraîchissement de la vue Personnes.

| Étape | État prouvé | Référence |
|---|---|---|
| Code | Fusionné sur `main` par la [PR #11](https://github.com/smornierHA/ha-board/pull/11) | `21c8212f8ae47fb3ff7d86131dd7c821c688b46e`, arbre `c6148511137da9ddef61d34384df3de052fe0d1b` |
| CI intégrée | Réussie ; 43/43 contrats sources et bundle, régression ville incluse | [run 34258176907](https://github.com/smornierHA/ha-board/actions/runs/34258176907) |
| Publication | Candidate publiée | [v0.1.2-rc.1](https://github.com/smornierHA/ha-board/releases/tag/v0.1.2-rc.1), [preuves de livraison](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5589311573) |
| Artefact | Bundle identifié | `ha-board.js`, 38 462 octets, SHA256 `80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6` |
| Installation HACS | `v0.1.2-rc.1`, aucune mise à jour en attente | [contrôles techniques](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597510216) |
| Chargement navigateur | Confirmé par l’utilisateur après rafraîchissement forcé | [confirmation du 9 septembre](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) |
| Recette HA ciblée | Compact/détail et navigation confirmés par l’utilisateur, sans anomalie signalée | [confirmation du 9 septembre](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) |
| Retour arrière | `v0.1.1-rc.1` reste disponible ; downgrade non rejoué dans ce lot | [procédure HACS](HACS.md) |
| Stable | Non promue | critères S2–S4 et décision S5 de la [roadmap](ROADMAP.md) distincts |

Composants livrés : Person Rich 3.4.7 et Person History Map 1.4.2. La réserve du banc de capture automatique Puppet ne remet pas en cause la vérification effectuée dans le navigateur utilisateur authentifié. Elle ne constitue pas non plus une preuve de campagne visuelle automatisée complète.

## Résultat du correctif visuel

`v0.1.2-rc.1` conserve les contrôles internes de provenance, date, cohérence des sources et séparation d’adresse, mais retire de l’affichage Person Rich :

- le bandeau de présence / dernière position ;
- le dépliant de qualité et tout son contenu ;
- la note de fraîcheur sous Proximité / Trajet / Destination.

Le libellé compact et détaillé utilise la zone HA nommée en priorité, sinon le nom de ville seul. Une rue, un code postal, un pays ou une donnée future/incohérente ne deviennent pas le libellé courant. La ligne d’adresse distincte reste affichée lorsqu’elle est rapprochable. La durée n’est accolée qu’à `Maison`, jamais à une ville hors domicile.

Les originaux dans `src/`, les types YAML, Person History Map, Memoji, batteries, équipements, navigation et blocs de trajet sont préservés.

## U3 et suites

L’ancien U3 « adresse dans les bulles historiques natives » est **écarté par décision utilisateur et non livré**. Aucun prototype supplémentaire n’est lancé. Son remplacement est le backlog [#10](https://github.com/smornierHA/ha-board/issues/10) : graphe historique durée + position dans chaque vignette Person Rich. Ce backlog reste séparé.

Le lot localisation [#8](https://github.com/smornierHA/ha-board/issues/8) est clos sur ce périmètre. Le lot météo #12 est également clos. Garage #13 puis Portail #14 suivent la [roadmap](ROADMAP.md) ; aucune modification Core/OS/NAS/Livebox/Frigate n’est incluse.
