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

## Candidat 1.4.1 / 3.4.4

Le candidat n'utilise toujours pas `last_updated` comme heure de mesure GPS. Sans horodatage source explicitement configuré, il affiche « Fraîcheur GPS non établie ». Les coordonnées nulles, vides, booléennes, non numériques ou hors bornes sont refusées. `unknown`/`unavailable` ne réutilisent pas silencieusement des attributs conservés. `gps_accuracy` est affiché en mètres ou kilomètres. Un attribut d'horodatage source peut être nommé par `position_timestamp_attribute` et un seuil optionnel par `position_stale_after_minutes`; un horodatage futur est signalé comme non fiable. Les tests utilisent uniquement des données fictives.

## RC.2 — défaut démontré par la recette

`home` renvoyait immédiatement « Domicile », avant toute lecture du tracker : coordonnées et précision disponibles étaient masquées. Un capteur de texte placé avant le tracker masquait également sa précision. Le candidat lit les coordonnées séparément de la présence et conserve l’adresse géocodée comme source distincte, sans lui prêter la date du tracker. Les derniers capteurs de trajet restent affichés avec une fraîcheur non établie. Le choix de la source de l’historique natif reste inchangé.

## Candidat 0.1.1-rc.1 — rapprochement lisible

- La zone HA nommée prime, puis les attributs structurés `city`, `locality`, `postal_town`, `municipality`, `town`, `village` ou `sub_locality`, puis une extraction d’adresse conservatrice.
- Rue, pays seul, coordonnées, valeur technique et état `not_home` ne sont pas acceptés comme ville. `unknown` et `unavailable` ne réutilisent pas leurs anciens attributs.
- L’adresse géocodée peut fournir sa propre date par `geocoded_timestamp_entity` ou `geocoded_timestamp_attribute`. Cette date reste distincte de la mesure GPS et de `last_updated` ; `geocoded_stale_after_minutes` fournit un seuil explicite, sans ancienneté inventée par défaut.
- Une adresse d’une autre ville, plus ancienne que la position ou munie de coordonnées distinctes n’est pas assemblée à la zone/position comme un même fait.
- Le panneau courant ne montre plus les coordonnées et le texte technique long. Le détail **Qualité** conserve coordonnées, précision, source et fraîcheur ; une indication courte reste visible lorsque les données sont anciennes, non fiables ou indisponibles.
- La durée de présence est affichée avec « Maison » seulement ; aucune durée hors domicile n’est attribuée à la ville extraite.

Pour l’historique, l’API frontend conserve les attributs `a` des états `person`/`device_tracker`, mais `hui-map-card` ne transmet à `ha-map` que coordonnées et instant. Ce constat ne permet pas d’associer une adresse sans une seconde source historique et un point d’affichage encapsulé. Voir HISTORY-ADDRESS-ADAPTER.md.
