# Plan familial — exploration du 25 octobre 2026

## État courant

La demande d’intégrer la première version est exécutée : `custom:home-plan-card` candidat autonome **0.1.0-rc.2** installé sur l’accueil. Les ouvertures et détecteurs précisés sont pris en compte ; associations HA corrigées et relues. Un seul bloc et une seule nouvelle ressource, autres ressources inchangées. Les contrôles du bundle sont locaux et simulés ; le moteur de capture natif est indisponible, la recette utilisateur reste attendue. Utilisation et éditeur : `HOME-PLAN.md`. Preuve expurgée : `../evidence/home-plan-native-2026-10-25.json`.

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
