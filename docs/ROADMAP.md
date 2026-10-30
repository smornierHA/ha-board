## Plan — lumière et définition du 30 octobre 2026

Le candidat autonome **0.12.0-rc.1** remplace l’éclairage fixe par une ambiance suivant le soleil HA et la position du volet. Les sources actives projettent couleur et intensité sur les surfaces proches, avec davantage de contraste dans l’obscurité. Les groupes de même entité sont dédupliqués, les sources sont limitées à huit et les états inconnus restent neutres. La définition du dessin et des ombres augmente sur ordinateur, avec un budget graphique tactile conservé ; les changements de densité d’écran sont suivis sans timer. Aucun polling ni abonnement HA ajouté. Tests purs, comparaison des pixels jour/nuit/volet/RGB/intensité, budgets, sélection/placement, 17 groupes existants et nettoyage réussis. Installé : deux fichiers relus, ressource remplacée en place et seul lien de guide modifié ; modèles, positions, associations et 43 autres ressources conservés. Code public, données domestiques privées. Preuve : `evidence/home-plan-lighting-2026-10-30.json`. Pas de fusion, release HACS ni recette physique iOS revendiquée.

## Plan — placement des équipements du 30 octobre 2026

Le candidat autonome **0.11.0-rc.1** ajoute l’écran natif **Équipements 2D** : tous les repères représentés sont visibles, sélectionnables par carte ou liste, déplaçables à la souris/au doigt, au clavier (5 cm, Maj 1 cm) ou par coordonnées. Leur position 2D est enregistrée indépendamment des meubles et des attaches de sélection 3D ; un bouton rétablit le suivi automatique de l’objet. Annulation, rechargement et conservation du zoom sont vérifiés, sans commande d’appareil. Le modèle privé masque aussi le dressing entier depuis l’arrière. Tests existants, contrat de placement et essai tactile simulé réussis, formats 320–1150 px et nettoyage contrôlés. Trois fichiers natifs et configuration relus, 43 autres ressources et positions existantes conservées. Code/fixtures publics, données domestiques privées ; preuve `evidence/home-plan-markers-2026-10-30.json`. Aucune fusion, release HACS ou recette physique iOS revendiquée.

## Plan — cadrage et vue initiale du 30 octobre 2026

Le candidat autonome **0.10.0-rc.1** masque entièrement les murs proches de la caméra et simplifie la scène privée en retirant les pans mansardés. Le cadrage 2D est centré sans découpe, avec commandes en haut à droite et chaise proportionnée ; le zoom 3D initial est distinct du zoom 2D et conservable dans l’éditeur. Chaque pièce peut choisir Illustration, Plan 2D ou Vue 3D à l’ouverture, avec repli si la représentation manque. Les corrections de dressing et de retour lumineux sont dans le modèle privé. 17 groupes existants, sélection/occlusion, comparaison mur masqué contre scène sans mur, trois vues initiales, édition, animations et nettoyage contrôlés ; cadrage privé sur quatre largeurs. Trois fichiers natifs et configuration relus, 43 autres ressources et positions conservées. Code public fictif ; géométrie, photos et associations privées. Preuve : `evidence/home-plan-framing-2026-10-30.json`. Pas de fusion, release HACS ni recette physique iOS revendiquée.

## Plan — reconstitution et murs adaptatifs du 30 octobre 2026

Le candidat autonome **0.9.0-rc.1** ajoute l’effacement des murs selon l’angle de caméra, avec retour aux murs pleins. La sélection GPU traverse les parois effacées et respecte les murs opaques. Les écrans de bureau séparés affichent un jeu spatial original lorsque leur signal PC est actif, indépendamment de l’éclairage et de la TV ; rendu commun borné à 10 images/s, interrompu hors visibilité, en édition et en réduction des animations. Le modèle privé est recalé sur huit nouvelles photos : façade, mansarde, mobilier et motifs lumineux. Les dimensions restent une reconstitution visuelle. Code et fixtures fictives publics ; photos, géométrie et associations domestiques privées. Installation ciblée et preuve dans `evidence/home-plan-photo-layout-2026-10-30.json`. Pas de fusion, release HACS ni recette physique iOS revendiquée.

## Plan — objets interactifs et éditeur de pièce du 30 octobre 2026

Le candidat autonome **0.8.0-rc.1** sélectionne directement la géométrie des objets en 3D, sans pictogrammes flottants. Ajoute un éditeur de pièce natif accessible après le choix du niveau et de la pièce : déplacement en 2D, groupes, clavier, dimensions, rotation, couleur, cadrage, associations et états actifs. Les écrans du PC et la lampe restent indépendants ; une détection réseau conserve son libellé de détection, sans prétendre mesurer l’alimentation. L’écran TV affiche une animation originale de style manga, bornée à 10 images/s, arrêtée hors visibilité et en réduction des animations. Le mobilier et la fenêtre sont reconstruits dans le modèle privé selon l’annotation et les photos. Code et tests fictifs restent publics ; photos, annotation, géométrie et associations domestiques sont exclus de Git. Pas de release HACS ni fusion ; installation ciblée et preuve dans `evidence/home-plan-objects-2026-10-30.json`.

# Roadmap HA-BOARD — base candidate validée v0.2.0-rc.1

## Plan — alignements et activation du chauffage du 29 octobre 2026

Le candidat autonome **0.6.0-rc.2** reprend le format de vignette du premier niveau sans réduire le plan existant. Boutons et jauges du second niveau sont espacés selon la référence du premier ; les placards sont alignés aux murs et aux baies, avec quatre vantaux pour les deux grands et deux pour les autres. Une cloison séparative manquante est rétablie dans le modèle privé. Le mode HVAC définit l’activation : **Chauffage = Activé**, **off = Éteint** ; l’activité est séparée (**En chauffe / Au repos**). Le profil STOP ne désactive pas un thermostat en mode Chauffage et ne crée plus de fausse alerte. Les commandes natives Chauffage/Éteint sont directement accessibles ; les profils distincts restent dans un volet secondaire. L’aperçu compte activés et en chauffe séparément. Les consignes demandées et confirmations natives restent distinctes. Dix-sept groupes navigateur locaux réussis, dont trois privés ; 14 groupes fictifs pour la CI existante. Géométrie, images et identités réelles restent hors Git public. Miniatures des volets et réglages des appareils conservés. Installé de façon ciblée : trois fichiers et configuration relus, 43 autres ressources conservées. Aucune commande réelle envoyée ; chargement utilisateur de cette révision non encore vérifié. Preuve : `evidence/home-plan-alignment-2026-10-29.json`.

## Plan — chauffage par pièce du 29 octobre 2026

Le candidat autonome **0.6.0-rc.1** ajoute le chauffage aux pièces équipées : température ambiante, consigne et activité signalée sur le plan ; thermostat compact, profils natifs et aperçu du niveau. La commande collective est repliée et exige un choix puis Appliquer. Les consignes demandées restent distinctes du retour HA ; confirmation native, absence de retour après 15 s, bornes/pas, indisponibilité, erreurs partielles et nettoyage sont gérés. Une chauffe n’est jamais déduite du mode ou de la différence de température ; un retour Arrêt + chauffe est signalé à vérifier. Six zones natives sont raccordées. Dix-sept groupes navigateur locaux et contrats purs réussissent sur doubles ; 14 groupes fictifs sont exécutables en CI. Installé de façon ciblée : deux fichiers et configuration relus, 43 autres ressources conservées. Géométries, positions, volets, premier niveau et automatismes conservés ; aucune consigne réelle modifiée. Chargement utilisateur et réponse physique non revendiqués. Preuve : `evidence/home-plan-climate-2026-10-29.json`. Aucune fusion/release HACS.

## Plan — corrections de géométrie du 29 octobre 2026

Le candidat autonome **0.5.0-rc.2** applique les corrections annotées par l’utilisateur au modèle privé du second niveau : passages, double porte coulissante, placards intégrés, deuxième escalier, garde-corps fin, façade et suppressions de faux murs/traits. L’annotation utilisateur prime sur le permis ancien. Une option générique `shutter_offset` place les barres de progression des volets du côté extérieur choisi ; son absence préserve la convention existante. Positions d’équipements, associations, miniatures et premier niveau sont conservés. Quatorze groupes navigateur locaux réussis, dont le contrat fictif de progression hors mur ; aucun appareil réel actionné. Deux nouveaux fichiers et configuration relus après installation ciblée ; 43 autres ressources inchangées. Capture utilisateur de cette révision non encore reçue. Géométrie et annotation exclues du dépôt public. Preuve : `evidence/home-plan-geometry-2026-10-29.json`. Aucune fusion ni release HACS.

## Plan — niveaux et repères compacts du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.5.0-rc.1** ajoute plusieurs plans dans une même carte, avec sélection du niveau, commandes et placement séparés. Les repères d’appareil et de lumière passent à 24 px, pictogramme de 14 px et cible tactile de 44 px ; les repères sans rapport avec le focus s’atténuent. Le modèle du second niveau vient du plan fourni, avec contacts, volets, zones natives et cinq illustrations ; tous ces éléments domestiques restent privés. Les températures de chauffage utilisent explicitement `current_temperature`, jamais la consigne. Les diagnostics pertinents suivent le niveau affiché en périmètre plan. Les illustrations de volets/écran, positions existantes et suivi natif de récupération sont conservés. Quatorze groupes de preuves navigateur locaux réussissent, dont deux privés ; douze groupes fictifs sont désormais raccordés au workflow CI existant, avec Playwright Core verrouillé. Installé sur l’accueil : 19 fichiers et configuration relus, 43 autres ressources inchangées. Aucun équipement physique commandé ; chargement de cette révision dans l’app utilisateur non revendiqué. Preuve : `evidence/home-plan-levels-2026-10-29.json`. Aucune fusion ni release HACS.

## Plan — récupération et repères d’appareil du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.4.0-rc.1** lit un suivi natif persistant de récupération : fin de programme puis ouverture réelle ultérieure de la porte, sans réapparition après reconnexion. Deux sources programme/porte vérifiées sont raccordées ; un appareil sans porte disponible reste hors de cette automatisation. Les signalements d’un même appareil partagent un seul repère, coloré selon le plus prioritaire, avec compteur et détail ordonné ; filtres indépendants et piles dédupliquées restent distincts. **Piles** devient une catégorie dédiée. Repères déplaçables, masqués sans signalement et accessibles au placement ; activité discrète et illustrations conservées. Géométrie, photos, états et identités domestiques restent privés. Automatisations créées et relues ; contrats purs et banc navigateur local sur services simulés, 12 groupes réussis. Module installé sur l’accueil, fichiers et configuration relus à l’identique ; une carte/ressource actualisée et 43 autres ressources conservées. Aucun appareil physique commandé, chargement utilisateur de cette révision et cycle complet non revendiqués. Preuve : `../evidence/home-plan-collection-2026-10-29.json`. Aucune fusion/release HACS. Voir `HOME-PLAN-COLLECTION.md` et `HOME-PLAN.md`.


## Plan — usages tactiles et tâches du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.3.0-rc.2** sépare les cycles terminés dans **À récupérer**, conserve **Entretien** pour piles/filtres/consommables, et exclut les robots sur leur base du compteur actif. Lumières et Ouvertures mettent en évidence les pièces équipées même au repos. Les lumières se commandent par pièce ou niveau ; les autres niveaux suivent les associations natives HA. Retour haptique natif à l’envoi d’une action, distinct en cas d’échec, sans rafale par lampe pour un groupe ; recette physique iOS non revendiquée. Une association de zone est corrigée, la flèche de baie retirée, les illustrations et positions conservées. Tests purs et 11 groupes navigateur sur services simulés réussis. Géométrie et identités domestiques restent privées. Installé sur l’accueil ; module, modèle, guide et configuration relus à l’identique, 43 autres ressources conservées. Chargement de cette révision et vibration physique à confirmer dans l’app utilisateur. Preuve : `../evidence/home-plan-actions-2026-10-29.json`. Aucune fusion ni release HACS.


## Plan — signalements du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.3.0-rc.1** organise les priorités, la maintenance et les informations d’activité par équipement, pièce et niveau. Les détecteurs au repos sont masqués sur le plan ; un mode Art confirmé n’est pas une TV en service. Jauges et centrage des icônes corrigés, illustrations des volets conservées et préférence consignée. Les positions modifiées par l’utilisateur sont préservées. Géométrie, associations et règles domestiques restent privées. Un seul appareil change de zone conformément à la demande. Contrats purs raccordés au workflow existant et banc navigateur local sur services simulés ; aucun moteur actionné. Voir `HOME-PLAN.md` et la preuve du lot. Pas de changement du package HACS, fusion ou release.

## Plan familial — améliorations du 29 octobre 2026

Le retour utilisateur confirme le chargement du premier candidat et précise les corrections de géométrie/repères. Le candidat autonome **0.2.0-rc.2** ajoute le placement visuel des repères existants, les lumières sur le plan, les volets groupés par pièce/niveau, le traitement distinct des écrans avec limite de course, les équipements regroupés par appareil et la sélection explicite de température ambiante. Les icônes sont natives HA. Les originaux, géométrie et bindings domestiques restent hors Git public. Tests navigateur sur bundle figé et services simulés ; aucune commande physique de test. Installé sur la carte existante ; nouveaux fichiers et configuration relus à l’identique. Capture native expirée après 25 secondes, nouvelle recette utilisateur et mouvements physiques non revendiqués. État et limites : `HOME-PLAN.md`, preuve datée du lot. Le package HACS courant, les autres composants et les associations globales ne sont pas modifiés.

## Plan familial — 25 octobre 2026

Première carte native préparée, testée et installée comme candidat autonome `0.1.0-rc.2` après les corrections utilisateur. Les états réels, actions, associations de zones et éditeur visuel sont intégrés. Étape courante : confirmer l’affichage et l’usage depuis le navigateur utilisateur ; les commandes physiques ne sont pas exécutées par le banc de tests. Stabiliser ensuite le lot et sa CI portable avant toute fusion ou distribution HACS. La commande d’une porte reste distincte de son état physique. Aucun autre module distribué n’est modifié.

La distribution courante `v0.2.0-rc.1` ajoute la météo et conserve Personnes `v0.1.2-rc.1` octet pour octet. Elle est publiée, installée, chargée et sa [recette HA ciblée est confirmée le 9 septembre 2026](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). Localisation #8 et météo #12 sont clos ; **Garage #13 est préparé pour revue**, puis Portail #14 reste hors périmètre.

## Avant une éventuelle promotion stable

| Priorité | Résultat attendu | Critère de fin |
|---|---|---|
| S1 | Chargement navigateur confirmé | confirmation utilisateur du 9 septembre après rafraîchissement forcé, rapprochée des contrôles techniques du bundle |
| S2 | Éditeurs réels vérifiés | ouverture, modification, sauvegarde et réouverture pour les deux cartes |
| S3 | Matrice visuelle minimale | refresh/navigation desktop + mobile, clair + sombre, résultats consignés |
| S4 | Retour arrière éprouvé | downgrade HACS exécuté, ou fallback original exécuté et limites motivées |
| S5 | Décision stable | revue des preuves ; nouveau SHA/tag stable distinct si décision positive |

S1 et la recette ciblée du correctif sont confirmés. Les preuves S2–S4 ne sont pas déduites de ce seul retour ; elles restent à compléter avant une éventuelle décision S5. Aucune promotion stable n’est incluse dans cette clôture.

## Lots issus de #6

L’inventaire du 9 septembre est consigné dans les tickets dédiés. Ordre de migration retenu : **M2 météo [#12](https://github.com/smornierHA/ha-board/issues/12) → M4 garage [#13](https://github.com/smornierHA/ha-board/issues/13) → M3 portail SIP [#14](https://github.com/smornierHA/ha-board/issues/14)**. Chaque lot reprend son inventaire et préserve les options réellement configurées ; aucune installation ou commande physique n’est déduite de cette préparation.

### M1 — Maintenance des deux cartes du POC

- Objectif : traiter uniquement les défauts ou améliorations démontrés de Person History Map et Person Rich Card, sans réécrire la base fonctionnelle.
- Dépendances : `v0.1.2-rc.1`, API frontend native, HACS Dashboard, types YAML existants, composants natifs réellement utilisés.
- Sources à inventorier au démarrage : issue et captures expurgées, versions Core/frontend/HACS, ressources actives, configuration fictive équivalente, code `src/candidate`, bundle installé, CARDS/ACCEPTANCE, originaux et empreintes.
- Invariants/recette : historique, filtres multiples et Tous/aucun, couleurs, Memoji, batteries iOS/charge, localisation, navigation, éditeurs, sauvegarde/réouverture, froid/retry, mobile/thèmes et plusieurs instances.
- Migration/rollback HACS : release SemVer proportionnée depuis le SHA intégré, mise à jour avec ressource unique, version navigateur relue ; downgrade vers la version antérieure validée du lot (actuellement `v0.1.1-rc.1`) ou fallback des deux originaux, sans double chargement.

État du correctif post-installation : `v0.1.2-rc.1`, publié, installé, chargé et accepté en recette ciblée, retire de Person Rich les trois éléments techniques signalés par l’utilisateur, conserve zone → ville seule comme libellé, garde l’adresse distincte lorsqu’elle est cohérente et préserve les contrôles temporels internes sans avertissement visible. Person History Map reste inchangée.

L’ancien U3 de #8 (« adresse dans les bulles historiques natives ») est **écarté par décision utilisateur, sans être déclaré livré**. Aucun prototype supplémentaire n’est à lancer. Son remplacement est le backlog [#10](https://github.com/smornierHA/ha-board/issues/10) : graphe historique combinant durée et position (zone ou adresse historique) dans chaque vignette Person Rich. #10 reste un lot séparé et n’est pas développé dans `0.1.2-rc.1`.

### M2 — Carte(s) météo — #12 clos

- Objectif : inventorier puis intégrer le ou les composants météo réellement visés ; aucune ressource n’est choisie avant cet inventaire.
- Dépendances : entités/providers météo observés, éventuels composants frontend, licences, assets, services et stratégie de rafraîchissement. Charger les dépendances optionnelles sans pénaliser les cartes Personnes.
- Sources à inventorier au démarrage : dashboard/configuration expurgés, liste des ressources et versions, dépôts/licences upstream, options visuelles, usages desktop/mobile, commandes éventuelles, original de chaque composant et SHA256.
- Invariants/recette : informations météo existantes, unités/localisation, prévisions et alertes réellement utilisées, états unavailable, éditeur visuel complet, thèmes, responsive, froid/navigation, absence d’appel ou ressource dupliqué.
- Migration/rollback HACS : décider un composant ou groupe justifié après inventaire ; conserver les originaux, migrer une ressource à la fois, vérifier le bundle installé et permettre downgrade/fallback par composant.

### M3 — Carte portail

- Objectif : intégrer la carte portail en préservant affichage et commandes existantes, sans déclencher d’action physique lors d’une recette documentaire.
- Dépendances : composant actuel, entités et scripts HA, SIP/appel, webhook `answered_by`, navigation et droits de service ; endpoints/identifiants restent hors Git.
- Sources à inventorier au démarrage : code/original/SHA256, YAML expurgé, liste des entités/services/automatisations consommateurs, versions HA/HACS, dépendances SIP, procédures de commande manuelle et preuves privées ciblées.
- Invariants/recette : préservation de `call_buttons_mode` configuré (`contextual` observé, `always` disponible), destinataires/configuration fictifs, statut/retour d’appel, confirmation et erreurs, clavier/tactile, éditeur, thèmes/mobile, commandes mockées puis essai réel séparément autorisé.
- Migration/rollback HACS : release isolée, configuration/endpoints injectés hors bundle, ressource unique, vérification sans commande réelle puis recette autorisée ; downgrade ou réactivation de l’original avec empreinte.

### M4 — Carte garage

- Objectif : intégrer la carte garage sans altérer les garde-fous des ouvertures ni les retours d’état.
- Dépendances : composant actuel, entités porte/mouvement/allée, scripts/services, permissions et protections contre double commande.
- Sources à inventorier au démarrage : original/SHA256, configuration expurgée, consommateurs, états et transitions, icônes/assets/licences, version HA/HACS et procédure de récupération.
- Invariants/recette : préservation de `show_motion_badge` configuré (`false` observé) et du feedback mouvement lorsque l’option est activée, dernière personne si source fiable, icône allée, états inconnu/indisponible, commandes protégées/idempotentes, éditeur, mobile/thèmes ; tests simulés avant toute commande réelle explicitement autorisée.
- Migration/rollback HACS : release par composant, une ressource active, vérifier version et transitions ; downgrade ou restauration de l’original/configuration sauvegardée, puis contrôle d’état sans action physique non mandatée.

État de préparation #13 : candidat `0.3.0-rc.1` / composant 1.1.0 sur PR draft dédiée. G1, réponses tardives, Lit incorporé, éditeur, tests simulés, comparaison visuelle fictive et plan trois modules sont inclus. La ressource Garage locale doit être replacée après Personnes avant son activation HACS afin que Personnes reste la première ressource du namespace lors des mises à jour futures. Aucune fusion, publication, installation, ressource HA ou commande physique n’est incluse dans cette étape.

## Règles communes aux lots

Préserver originaux et SHA256 avant modification, données privées hors Git, exemples fictifs, identités et fonctions existantes. Chaque carte conserve éditeur visuel, catalogue, nom sans version, `documentationURL` et bouton HACS. Tester le bundle réellement installé, les dépendances optionnelles et l’absence de doublons/imports manquants. Release/artefact proviennent du SHA intégré et chaque migration dispose d’un rollback ciblé.

Les lots sont séparés par composant ou groupe justifié. Un ajout de carte appelle normalement une version mineure ; un correctif compatible peut être un patch. La décision finale suit le delta réel. La maintenance mensuelle du socle existe déjà et n’est pas dupliquée.

Le chantier MAP/Core, Livebox (`smornierHA/hass-livebox-component`, branche `livebox-l2.17c`), NAS et Frigate restent séparés.

## Clôture du pilote météo #12 — 9 septembre 2026

- PR #16 fusionnée ; `v0.2.0-rc.1` publiée depuis `a9c885419cea031fb307623076100b04feb78e98`, CI intégrée réussie.
- HACS et bascule exécutés ; [recette native ciblée confirmée](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). W1, éditeur, provenance et notices traités ; bundle Personnes inchangé.
- [Migration et rollback ciblés](HACS.md#migration-météo-020-rc1) : conserver Personnes avant météo, une ressource par module. Rollback disponible, non exécuté.
- Documentation de distribution à aligner avant publication ; informations HACS et recette à relire après déploiement selon [HACS.md](HACS.md#documentation-à-chaque-livraison).
- Suite : #13 Garage puis #14 Portail. #10 reste au backlog ; aucune adoption complète du socle RC.8.
