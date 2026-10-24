# Proposition météo iOS fine

## Révision alignement et hauteur stable — 25 octobre 2026, proposition courante

Référence courante : `examples/weather-ios-fixed.fragment.html`. Cette révision remplace le bandeau supérieur et la croissance du graphe de la proposition précédente, conformément au nouveau retour utilisateur.

- Icône principale et température partagent la même dimension responsive : 44 px à 320 px, 48 px à 390 px, 52 px dans le banc large, avec centres verticaux identiques. Les pictogrammes horaires ont un cadre commun ; les petites flèches ont leur propre cadre centré.
- Toutes les alertes restent dans le footer de 52 px. Les niveaux important/critique modifient sa teinte et son libellé, sans ajouter de bandeau ni de hauteur. Le volet conserve le tri par gravité, les alertes actives et l’accès à tous les états.
- La même trame horaire réserve 48 px au pictogramme ou au graphe, dans les trois vues. Le graphe vent/rafales utilise cette zone ; hauteur du wrapper et position du footer restent identiques lors des changements de vue et de gravité.
- Valeurs et courbes du vent partagent les couleurs de seuil. La maquette reprend les références 35 km/h pour le vent et 45 km/h pour les rafales, avec les ratios 1,10/1,30 du composant existant : orange au-delà de 38,5/49,5 km/h et rouge au-delà de 45,5/58,5 km/h. Le trait plein/pointillé continue de distinguer vent et rafales.
- Repères visuels complémentaires : température bleue à 5 °C ou moins, orange au-dessus de 20 °C, rouge au-dessus de 27 °C ; cumul horaire de pluie orange dès 2 mm, rouge dès 5 mm. Ces plages servent à la proposition visuelle ; elles ne créent pas de règle d’alerte HA. Les seuils et statuts textuels sont consultables dans les détails, sans ajouter de ligne à la carte.

Vérification : trois vues × 320/390/736 px × clair/sombre, valeurs non coupées, graphes et détails, légende, clavier, position horaire et filtres. Le banc mesure la même hauteur entre les vues et les quatre niveaux d’alerte ; sur 390 px : wrapper 365,375 px, footer 52 px. Les valeurs orange/rouges sont distinctes et leur statut figure aussi dans le libellé accessible. Preuve : `evidence/weather-ios-fixed-2026-10-25.json`. Maquette et valeurs fictives uniquement ; source, bundle, version et instance HA inchangés.

## Révision pictogrammes, vent et alertes — 25 octobre 2026, référence précédente

La direction à trois vues est appréciée. La référence courante devient `examples/weather-ios-refined.fragment.html`, qui applique les quatre nouvelles remarques :

- Pictogrammes météo pleins et colorés : nuages clairs, pluie bleue, soleil doré et lune douce. Composition et style à partir des icônes Lucide fournies par l’hôte ; aucun SF Symbol ni artwork Apple embarqué.
- Graphe directement dans la vue Vent : vent moyen en trait plein, rafales en pointillés, alignés sur les 25 positions horaires du même rail natif. Vitesse, rafales et direction relative à la maison restent accessibles ; les détails au toucher sont conservés.
- Icône météo principale immédiatement à gauche de la température ; jauge mini/maxi graduée de 9 à 17 °C avec un repère à 14 °C sur la fixture.
- Footer et volet des risques conservés. Les alertes importantes ou critiques obtiennent un bandeau directement visible : orange ou rouge, texte de gravité explicite pour le critique et noms des alertes concernées. Les risques du volet sont triés par gravité. Un niveau faible conserve seulement le footer ; zéro alerte reste zéro et le bouton Tout permet de consulter les états normaux.

L’exemple contient une **alerte orange simulée**, cohérente avec un profil fictif de rafales culminant à 72 km/h ; aucune alarme domestique réelle n’a été consultée ou modifiée. Le bandeau et son détail sont conditionnels à la gravité. Le graphe augmente uniquement la vue Vent de 41 px ; le bandeau s’ajoute seulement lorsqu’une alerte importante existe. La vérification distingue donc les hauteurs selon la situation, sans reprendre l’ancienne promesse de hauteur identique entre les trois vues.

Vérifié en Chromium, pointeur tactile, 320/390/736 px en clair/sombre : icône adjacente, jauge accessible, deux séries du graphe non coupées, conservation de l’heure, détails, clavier, footer et filtres. Scénarios complémentaires : critique rouge, risques faibles sans bandeau, zéro alerte avec cinq états encore consultables. Preuve : `evidence/weather-ios-refined-2026-10-25.json`. **Maquette uniquement : aucun changement du bundle ou de l’instance HA**. La source et la distribution installées restent `0.3.1-rc.2` ; la recette native iPhone reste distincte.

## Révision lisibilité — référence précédente

La première maquette a été jugée trop dense : températures, courbe, cumuls, probabilités, vent, rafales et cinq risques se superposaient dans le même espace. La proposition courante est désormais `examples/weather-ios-readable.fragment.html`. La première reste une référence historique, pas un design accepté.

La référence consultée est le [guide Météo iOS 27 d’Apple](https://support.apple.com/fr-fr/guide/iphone/iph1ac0b35f/ios), ainsi que ses deux captures officielles (météo principale et détails). Le guide décrit une bascule conditions/précipitations/vent et l’ouverture des graphiques au toucher. Les [principes de mise en page](https://developer.apple.com/design/human-interface-guidelines/layout) et les [matériaux](https://developer.apple.com/design/human-interface-guidelines/materials) motivent la divulgation progressive et la retenue des effets de verre. Aucun artwork Apple n’est incorporé à la maquette. La liste des versions de sécurité distingue iOS 27.0.1 courant de la version propre à l’iPhone Duo et des RC développeur ; aucune fonction n’est déduite d’une RC.

| Accès | Proposition courante |
|---|---|
| Immédiat | Température actuelle, condition, mini/maxi et chronologie météo simple |
| Trois boutons nommés | Météo / Pluie / Vent ; une seule famille de données visible à la fois |
| Pluie | Barres de cumul, probabilités et valeurs en mm |
| Vent | Direction relative à la maison, moyenne et rafales en km/h |
| Toucher une heure | Courbe dédiée et valeurs météo, pluie, vent/rafales de l’heure |
| Toucher l’en-tête | Météo actuelle, courbe et repères solaires |
| Une ligne d’alertes | Deux alertes fictives actives regroupées ; détail et bouton Tout pour les cinq risques |

Les 25 positions restent disponibles. Le passage d’une donnée à une autre conserve l’heure affichée et la hauteur de la carte. Les courbes passent dans le détail : elles sont conservées sans être toutes permanentes. Les icônes et polices sont plus grandes que dans la première proposition ; la hauteur de 343–344 px ne constitue pas une réduction de hauteur. Le gain recherché est la lecture, grâce à moins de valeurs et de traitements graphiques simultanés.

Vérification ciblée Chromium sur pointeur tactile : 320/390/736 px en clair/sombre, trois vues, valeurs non coupées, détails et courbes, position horaire conservée, filtres de risques, clavier et fermeture modale. Aucune modification de source, distribution, version ou configuration HA ; le correctif de défilement `0.3.1-rc.2` reste identique. L’aperçu ne vaut pas recette native Safari/iPhone ni intégration de la nouvelle disposition. Preuve : `evidence/weather-ios-readable-2026-10-24.json`.

## Première proposition — historique

Maquette du 24 octobre 2026 : `examples/weather-ios-fine.fragment.html`. Fragment autonome pour la prévisualisation de la conversation, qui fournit Lucide. Ce fichier n’est pas une nouvelle carte HA, n’est pas importé par le composant réel et n’est pas un package à installer. Aucun appel réseau, service HA, identifiant réel ou donnée domestique. Les textes et valeurs sont fictifs ; le runtime du composant et l’éditeur restent inchangés hors correction de défilement.

| Fonction actuelle | Présentation proposée |
|---|---|
| Météo courante, icône et température | En-tête compact avec un seul niveau de lecture principal |
| Minimum, maximum, position actuelle | Jauge fine et valeurs explicites |
| Prévisions horaires, heure courante et jour suivant | Rail de 25 positions : maintenant et 24 heures |
| Courbe de température et précipitations | Courbe fine et barres de cumul transparentes, valeurs en mm |
| Probabilités de pluie | Pourcentages alignés sous les cumuls |
| Vent, orientation maison, rafales et seuils | Flèche fine, vitesse et rafales ; couleur renforcée au seuil |
| Lever/coucher du soleil | Repères horaires dans la même chronologie |
| Vigilance, inondation, portail, pluie et volets | Boutons de risque lisibles, détail au toucher/clavier |
| Action de l’en-tête | Ouverture locale d’un détail simulé, représentative de la navigation configurée |
| Jour/nuit et fond animé | Ambiance discrète ; réduction des animations respectée |
| Éditeur et configurations historiques | À réutiliser lors d’une intégration, aucune migration requise pour le correctif seul |

Le défilement horizontal des heures et des risques reste natif ; le bouton suivant rend les heures accessibles sans glisser. La navigation et les détails de risques sont uniquement simulés. Les configurations avancées (autres sources, mode en-tête des risques, affichages masqués, actions de service) demeurent prises en charge par le composant réel ; la maquette illustre la disposition principale, pas tous les réglages simultanément.

Vérifications : largeurs 320/390/736 px, thèmes clair/sombre, 25 positions, absence de débordement de page, bouton suivant, détails/fermeture clavier, retour de focus, valeurs d’en-tête non tronquées. Hauteur environ 323–328 px dans le banc. Le prototype ne change pas le dashboard installé et n’a pas été exécuté dans Safari/iPhone.

Le correctif de geste fait partie du bundle `0.3.1-rc.2`. La décision d’intégrer cette nouvelle disposition est distincte ; les données, seuils, actions, options et identités devront rester identiques et être recettés sur le composant intégré.
