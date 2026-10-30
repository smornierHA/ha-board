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

## Plan — exploration de pièce du 30 octobre 2026

Le candidat autonome **0.7.0-rc.2** ajoute une vue pièce qui conserve visuel et commandes ensemble, le glissement entre niveaux, le zoom/recentrage/déplacement du plan et un renderer meublé 2D/WebGL2 local à rendu ponctuel. Les repères sélectionnent une commande ciblée ; les services conservent haptique, capacités, indisponibilité et retour natif. Tests locaux : 17 groupes navigateur existants (14 fictifs et trois privés), quatre largeurs 320–1100 px, transitions 2D/3D, repli sans WebGL, commandes simulées, cache, 1 000 changements HA et nettoyage ; cycle existant de 100 montages/démontages réussi, aucun appareil physique actionné. La scène et les associations domestiques restent privées. Installation native et preuve dans `evidence/home-plan-room-explorer-2026-10-30.json`. Aucune fusion/release HACS ni recette utilisateur revendiquée.

## Météo — reprise limitée du 29 octobre 2026

Le candidat autonome **0.4.0-rc.3** corrige une amplification reproductible des tentatives après échec de l’abonnement quotidien : reprise au prochain état HA après 30/60/120/240/300 secondes, remise à zéro à la reconnexion ou au changement de source. Aucun timer supplémentaire ; nettoyage existant conservé. Source iOS figée reprise du module effectivement installé, sans changement visuel ; source historique corrigée également. 22 contrats historiques, trois groupes de reprise et contrôle du plan sur 1 000 états / 100 cycles réussis sur doubles. Ce défaut ne prouve pas la cause de la saturation mémoire observée. Installé : fichier relu à l’identique, ressource météo existante actualisée, 43 autres ressources conservées. Le chargement dans les clients déjà ouverts reste soumis au rechargement de leur vue. Preuve : `../evidence/weather-backoff-2026-10-29.json`.

# État courant — 9 septembre 2026

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
