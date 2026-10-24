# Proposition météo iOS fine

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
