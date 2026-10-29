# Projet HA-BOARD

## Plan — niveaux et repères compacts du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.5.0-rc.1** ajoute plusieurs plans dans une même carte, avec sélection du niveau, commandes et placement séparés. Les repères d’appareil et de lumière passent à 24 px, pictogramme de 14 px et cible tactile de 44 px ; les repères sans rapport avec le focus s’atténuent. Le modèle du second niveau vient du plan fourni, avec contacts, volets, zones natives et cinq illustrations ; tous ces éléments domestiques restent privés. Les températures de chauffage utilisent explicitement `current_temperature`, jamais la consigne. Les diagnostics pertinents suivent le niveau affiché en périmètre plan. Les illustrations de volets/écran, positions existantes et suivi natif de récupération sont conservés. Quatorze groupes de preuves navigateur locaux réussissent, dont deux privés ; douze groupes fictifs sont désormais raccordés au workflow CI existant, avec Playwright Core verrouillé. Installé sur l’accueil : 19 fichiers et configuration relus, 43 autres ressources inchangées. Aucun équipement physique commandé ; chargement de cette révision dans l’app utilisateur non revendiqué. Preuve : `evidence/home-plan-levels-2026-10-29.json`. Aucune fusion ni release HACS.

## Plan — récupération et repères d’appareil du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.4.0-rc.1** lit un suivi natif persistant de récupération : fin de programme puis ouverture réelle ultérieure de la porte, sans réapparition après reconnexion. Deux sources programme/porte vérifiées sont raccordées ; un appareil sans porte disponible reste hors de cette automatisation. Les signalements d’un même appareil partagent un seul repère, coloré selon le plus prioritaire, avec compteur et détail ordonné ; filtres indépendants et piles dédupliquées restent distincts. **Piles** devient une catégorie dédiée. Repères déplaçables, masqués sans signalement et accessibles au placement ; activité discrète et illustrations conservées. Géométrie, photos, états et identités domestiques restent privés. Automatisations créées et relues ; contrats purs et banc navigateur local sur services simulés, 12 groupes réussis. Module installé sur l’accueil, fichiers et configuration relus à l’identique ; une carte/ressource actualisée et 43 autres ressources conservées. Aucun appareil physique commandé, chargement utilisateur de cette révision et cycle complet non revendiqués. Preuve : `evidence/home-plan-collection-2026-10-29.json`. Aucune fusion/release HACS. Voir `docs/HOME-PLAN-COLLECTION.md` et `docs/HOME-PLAN.md`.


## Plan — usages tactiles et tâches du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.3.0-rc.2** sépare les cycles terminés dans **À récupérer**, conserve **Entretien** pour piles/filtres/consommables, et exclut les robots sur leur base du compteur actif. Lumières et Ouvertures mettent en évidence les pièces équipées même au repos. Les lumières se commandent par pièce ou niveau ; les autres niveaux suivent les associations natives HA. Retour haptique natif à l’envoi d’une action, distinct en cas d’échec, sans rafale par lampe pour un groupe ; recette physique iOS non revendiquée. Une association de zone est corrigée, la flèche de baie retirée, les illustrations et positions conservées. Tests purs et 11 groupes navigateur sur services simulés réussis. Géométrie et identités domestiques restent privées. Installé sur l’accueil ; module, modèle, guide et configuration relus à l’identique, 43 autres ressources conservées. Chargement de cette révision et vibration physique à confirmer dans l’app utilisateur. Preuve : `evidence/home-plan-actions-2026-10-29.json`. Aucune fusion ni release HACS.


## Plan — signalements du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.3.0-rc.1** organise les priorités, la maintenance et les informations d’activité par équipement, pièce et niveau. Les détecteurs au repos sont masqués sur le plan ; un mode Art confirmé n’est pas une TV en service. Jauges et centrage des icônes corrigés, illustrations des volets conservées et préférence consignée. Les positions modifiées par l’utilisateur sont préservées. Géométrie, associations et règles domestiques restent privées. Un seul appareil change de zone conformément à la demande. Contrats purs raccordés au workflow existant et banc navigateur local sur services simulés ; aucun moteur actionné. Voir `docs/HOME-PLAN.md` et la preuve du lot. Installé ; fichiers et configuration relus à l’identique, autre configuration et 43 ressources conservées. Chargement utilisateur de cette révision non revendiqué. Preuve : `evidence/home-plan-notifications-2026-10-29.json`. Pas de changement du package HACS, fusion ou release.

## Plan familial — améliorations du 29 octobre 2026

Le retour utilisateur confirme le chargement du premier candidat et précise les corrections de géométrie/repères. Le candidat autonome **0.2.0-rc.2** ajoute le placement visuel des repères existants, les lumières sur le plan, les volets groupés par pièce/niveau, le traitement distinct des écrans avec limite de course, les équipements regroupés par appareil et la sélection explicite de température ambiante. Les icônes sont natives HA. Les originaux, géométrie et bindings domestiques restent hors Git public. Tests navigateur sur bundle figé et services simulés ; aucune commande physique de test. Installé sur la carte existante ; nouveaux fichiers et configuration relus à l’identique. Capture native expirée après 25 secondes, nouvelle recette utilisateur et mouvements physiques non revendiqués. État et limites : `docs/HOME-PLAN.md`, preuve datée du lot. Le package HACS courant, les autres composants et les associations globales ne sont pas modifiés.

## Exploration du plan familial — 25 octobre 2026

Lot autonome séparé de la météo, issu de `main`. Dépôt public vérifié avec droit d’écriture ; seuls code, tests, documentation et fixture fictive sont versionnés. La correction utilisateur impose des murs droits, les seuls pans coupés indiqués et des ouvertures correctement placées. La première carte native **Plan de la maison 0.1.0-rc.2** est installée sur l’accueil ; un seul bloc remplacé, 43 ressources existantes inchangées. Deux appareils de détection et leurs diagnostics sont réassociés aux zones précisées, sans changement d’ID. Fichiers et configuration relus ; contrôles locaux réussis. Capture native indisponible avant et après modification ; recette utilisateur et essais physiques restent distincts. Aucun actif domestique ni configuration réelle ne rejoint ce dépôt. Voir `docs/HOME-PLAN.md` et `docs/HOME-PLAN-PREVIEW.md`.

| Champ | Valeur |
|---|---|
| Dépôt vérifié le 6 septembre 2026 | [smornierHA/ha-board](https://github.com/smornierHA/ha-board), accessible avec droits d'administration et d'écriture |
| Visibilité observée | Public ; code, documentation expurgée et exemples fictifs uniquement |
| Branche initialisée | main, README uniquement, SHA `ff9cd91848ad8548be0b5ef6b70add8d45f56669` relu |
| Protections observées | `protected:false` ; checks requis vides ; rulesets vides |
| Conservation privée | project-archives privé ; petite archive familiale à chiffrer côté client, clé hors GitHub ; aucun envoi effectué |
| Coffre NAS | Volume 3 reporté pour les petites archives ; sauvegarde HA réelle distincte toujours requise avant Core |
| Profil | Home Assistant ; complément MCP pour livraison assistée |
| Socle | Exigences HA de RC.6 partiellement adoptées ; RC.7 disponible sur `4c20e6361dbe6320f17c380fff050010ef7a7a40`, sans adoption complète revendiquée |
| Responsable | Propriétaire du dépôt |
| Produit | Cartes frontend locales et configuration Lovelace expurgée |
| Base observée au cycle initial | Core 2026.8.3 ; Person History 1.4.0 ; Person Rich 3.4.3 |
| Cible officielle MAP | Core 2026.9.1 ; préconditions non toutes levées |
| Données exclues du dépôt public | Noms/entités domestiques, positions, historiques, images réelles, sauvegardes, secrets |
| Livraison | Bundle immuable + SHA/empreinte, ressources ciblées, recette HA |

Preuve d'amorçage : `evidence/github-bootstrap-2026-09-06.json`. Le socle est dans project-playbook privé ; project-archives est également privé. Leur accès ne prouve ni l'import des préparatifs ni la disponibilité d'une sauvegarde.

Une version de socle disponible ou préparée n'est pas adoptée tant que son diff projet n'est pas intégré. La révision RC.4 reste historique et n’est pas réimportée. La maintenance mensuelle existante n'est pas dupliquée.

## Cycle pilote météo #12

Le 9 septembre, le dépôt public est relu via GitHub avec droits push/admin ; la préparation a été réalisée sur branche dédiée. Sources privées météo et configuration ciblée conservées hors Git ; seules les références expurgées et données fictives sont admises ici. Le profil HA et la coordination RC.8 ont été relus et appliqués aux parties concernées, sans adoption complète. Package 0.2.0-rc.1 désormais publié, installé, chargé et accepté en recette HA ciblée le 9 septembre ; Personnes 0.1.2-rc.1 inchangé. Statut et preuves courants dans STATUS ; provenance dans WEATHER-PROVENANCE. La documentation affichée par HACS est contrôlée à chaque livraison selon docs/HACS.md.

## Préparation Garage #13

Le lot Garage est préparé sur une branche dédiée à partir du `main` observé après #17. L’original actif et son rollback restent hors Git public ; seuls un export expurgé, des fixtures fictives, la source candidate et le module autonome sont versionnés. Le candidat package `0.3.0-rc.1` ajoute Garage `1.1.0` sans modifier les octets Personnes/météo. Son statut reste **préparé et testé**, pas fusionné, publié, installé, chargé ni accepté en recette HA. La bascule et le rollback Garage seuls sont décrits dans `docs/HACS.md` mais ne sont pas exécutés dans ce lot.
