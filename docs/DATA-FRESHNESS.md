# Contrat de fidélité de la localisation

## Observations ciblées du 6 septembre 2026

Les quatre trackers téléphone exposent latitude, longitude et `gps_accuracy`. Aucun horodatage spécifique de mesure GPS n'a été trouvé parmi leurs attributs. Les états HA portent `last_updated` et `last_reported`, mais ces dates ne prouvent pas l'heure de la mesure GPS : une remontée de batterie peut mettre à jour l'entité. Les capteurs de texte GPS consultés n'exposent que leur nom comme attribut.

La carte native reçoit actuellement `person.*`. Le champ local `map_entity` existe dans la configuration mais n'est pas consommé par `mapConfig()`. Une personne est actuellement agrégée depuis un iPad alors que ce champ désigne son téléphone. Ne pas remplacer automatiquement `person.*` par ce champ : cela changerait la sémantique et la source de l'historique. Le futur choix doit rester explicite, documenté et testé.

## Contrat à implémenter dans la PR de fiabilisation

- Trois informations séparées : présence HA, dernière position connue, qualité de cette position. L'état `home` n'atteste pas à lui seul d'une mesure GPS actuelle.
- Utiliser « Dernière position connue » par défaut. Afficher « mesure du… » seulement si un horodatage de mesure fiable est fourni ; sinon « état HA actualisé le… », avec fraîcheur GPS non établie.
- `unknown`, `unavailable`, absence d'entité et coordonnées invalides restent explicitement indisponibles. Des attributs conservés d'une entité indisponible ne prouvent pas une position actuelle.
- Rejeter coordonnées nulles, vides, non numériques ou hors bornes avant conversion ; `Number(null)` vaut zéro et ne constitue pas une validation.
- Afficher la précision fournie en mètres ; ne pas en inventer une pour les capteurs qui n'en fournissent pas. L'âge maximal acceptable est une configuration nommée, avec seuil documenté, pas une vérité universelle.
- La ville issue d'un géocodage doit porter sa provenance/limite temporelle ; ne pas la présenter comme synchronisée au tracker sans preuve.
- L'historique conserve les positions passées ; un avertissement de fraîcheur ne doit pas effacer les déplacements ni falsifier les états transmis au composant natif.
- Aucun calendrier, timer ou rafraîchissement n'est laissé actif au détachement. Un mécanisme d'âge doit évoluer même sans nouvel événement hass et être nettoyé au démontage.

Les tests utilisent uniquement des noms, identifiants, villes et coordonnées fictifs. Aucun état de position familial n'est nécessaire pour démontrer ces contrats.
