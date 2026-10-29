# Plan familial — exploration du 25 octobre 2026

## Plan — signalements du 29 octobre 2026

Le candidat autonome **Plan de la maison 0.3.0-rc.1** organise les priorités, la maintenance et les informations d’activité par équipement, pièce et niveau. Les détecteurs au repos sont masqués sur le plan ; un mode Art confirmé n’est pas une TV en service. Jauges et centrage des icônes corrigés, illustrations des volets conservées et préférence consignée. Les positions modifiées par l’utilisateur sont préservées. Géométrie, associations et règles domestiques restent privées. Un seul appareil change de zone conformément à la demande. Contrats purs raccordés au workflow existant et banc navigateur local sur services simulés ; aucun moteur actionné. Voir `HOME-PLAN.md` et la preuve du lot. Installé ; fichiers et configuration relus à l’identique, autre configuration et 43 ressources conservées. Chargement utilisateur de cette révision non revendiqué. Preuve : `../evidence/home-plan-notifications-2026-10-29.json`. Pas de changement du package HACS, fusion ou release.

## État courant

Le retour utilisateur du 29 octobre confirme le premier rendu et précise quinze améliorations. Le candidat autonome **0.2.0-rc.2** est installé sur la carte existante : plan et repères corrigés dans un nouveau modèle privé, choix explicite de température ambiante, icônes natives, équipements regroupés, commandes de volets pièce/niveau, écran distinct limité et placement visuel des repères. Trois nouveaux fichiers relus à l’identique, une ressource remplacée et un seul bloc actualisé ; les 43 autres ressources et le reste du dashboard sont conservés. Aucun moteur ni registre global n’a été modifié. Tests et aperçu interactif locaux sur le bundle figé ; chargement utilisateur de cette nouvelle révision et essais physiques restent distincts. Utilisation : `HOME-PLAN.md`. Preuve : `../evidence/home-plan-usability-2026-10-29.json`.

## Référence géométrique reçue

L’utilisateur demande une refonte du widget plan de l’accueil, familiale, lisible et efficace. Il précise ensuite que **le dessin installé n’est pas du tout correct**. Cette correction est autoritaire : le dessin est exclu de la reconstruction et de la validation géométrique. La comparaison privée préparée à partir de ce dessin a été retirée ; elle ne doit pas être présentée comme une proposition fidèle.

L’utilisateur a ensuite fourni le calque de référence V4, sa source PNG annotée, son archive et les photos du RDC. La source SVG V4 contient une image incorporée, pas un réseau de murs déjà vectorisés. La nouvelle préparation utilise directement les annotations de la source fournie. Aucun actif domestique ou inventaire réel n’est incorporé à ce dépôt public.

Le premier tracé conservait la couverture exacte des pixels annotés (`scripts/trace_plan_annotations.py`). L’utilisateur apprécie l’interface mais corrige ce principe : les traits à main levée ne décrivent pas des murs irréguliers. La proposition suivante utilise des segments horizontaux et verticaux, avec uniquement les pans coupés explicitement indiqués, et déplace l’ouverture demandée. Le tracé brut reste une preuve de lecture de la référence, pas la géométrie à installer. Les surfaces fonctionnelles, libellés, bassin et repères d’escaliers sont schématiques ; aucune mesure architecturale n’est revendiquée. La vue Calque conserve la comparaison avec l’original fourni.

## Travail réutilisable

`examples/home-plan-family.fragment.html` est une exploration d’interface contenant une **fixture entièrement fictive**, distincte de l’habitation. Elle propose un plan sobre à proportions configurables, une vue Pièces, la sélection d’une pièce, un volet de commandes, des repères d’éclairage et un accès aux ouvertures. Elle accepte facultativement des photos locales incorporées, un raccourci photo et une référence de comparaison ; la fixture publique n’en contient pas. Les valeurs, états et commandes sont simulés localement ; aucun appel de service ou réseau n’est effectué. Les pictogrammes sont fournis par l’hôte d’aperçu, sans incorporation d’une nouvelle bibliothèque.

Le prototype accepte plusieurs volets indépendants par pièce et des ouvertures positionnées sur le plan. Un appui sur une fenêtre, son tracé ou son bouton tactile ouvre un accès court Ouvrir/Arrêter/Fermer et la position. Une ouverture sans association prouvée propose les volets de sa pièce séparément. Les contacts physiques restent distincts des commandes et positions des volets : une commande ne change jamais le contact. L’orange signale les contacts ouverts, le bleu les volets ; les noms, états et pourcentages complètent les couleurs. Le mode Volets expose les valeurs, les autres modes conservent des repères compacts.

Les sept pièces photographiées de la proposition privée ont une illustration dérivée de leur photo ; le choix Photo/Illustration et les autres angles originaux restent accessibles dans la fiche. Ces images restent illustratives, sans valider les positions ou dimensions architecturales. Les photos de sanitaires dont le rattachement n’est pas établi restent non attribuées.

Le fichier n’est ni une custom card livrable, ni une configuration Lovelace, ni un module distribué. Les plans, photos, illustrations, configurations et identités domestiques ne sont pas inclus. Cette phase de maquette n’avait modifié aucun dashboard, module ou ressource HA ; elle est suivie de la carte native ci-dessus. La météo et les autres composants restent dans leurs lots respectifs.

## Validation et limites

La fixture fictive et la proposition privée ont été exercées dans Chromium : 320/390/736 px, clair/sombre, absence de débordement horizontal, sélection de pièce, modes, éclairage, position de volet, arrêt, détails, clavier et défilement tactile vertical. Le clic sur le tracé réel de la fenêtre, l’accès court, l’indépendance entre deux volets et entre volet/contact physique sont vérifiés. Les cibles de 44 px ne se recouvrent pas entre ouvertures dans la matrice contrôlée ; la fiche reste au-dessus de ces cibles. Photos, illustrations et comparaison avec le calque ont été vérifiées dans la proposition privée. Preuve expurgée : `evidence/home-plan-ux-exploration-2026-10-25.json`. Ces contrôles ne constituent pas une acceptation de la géométrie par l’utilisateur ni une recette native HA/iPhone.

Les données du prototype sont des fixtures explicites ; la carte native gère séparément les indisponibilités, positions inconnues, capacités, retours d’état et identités stables. Les contacts physiques restent en lecture seule et ne changent pas après une commande de volet.

## Suite

La première version native est installée et sa configuration relue. La prochaine étape est la recette d’affichage et de commande par l’utilisateur après actualisation de l’accueil. La capture indisponible ne vaut ni un échec de la carte ni une validation visuelle. La publication HACS et la fusion restent des étapes ultérieures.
