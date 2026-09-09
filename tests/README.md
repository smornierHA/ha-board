# Validation locale du POC géolocalisation

Ce dossier contient un harnais de contrats appliqué aux **sources exportées sans modification** `person-history-map-card-v14.js` et `person-rich-card-v34.js`. Les sources originales sont lues dans `src` par défaut. Seuls les fichiers de résultats sont écrits.

## Exécution depuis la racine du projet

Prérequis : Node.js, modules natifs uniquement. Exécution vérifiée avec Node 24.19.0.

```bash
node tests/baseline.mjs
```

Pour utiliser les mêmes fichiers provenant d'un autre répertoire :

```bash
POC_SOURCE_DIR=/chemin/vers/les/sources POC_REPORT_DIR=/chemin/vers/les/resultats node tests/baseline.mjs
```

Les résultats sont `baseline-report.json` (détails structurés, empreintes, observations) et `baseline-report.md` (tableau synthétique). Le code de sortie **1** signifie que des contrats attendus échouent. Ce résultat constitue une preuve de défauts de la baseline, jamais une validation applicative verte. Aucun téléchargement ni accès réseau, HA ou GitHub n'est effectué.

## Résultat et portée

19 contrats exécutés : **7 satisfaits, 12 non satisfaits, aucune erreur du harnais**. Les interactions publiques `setConfig`, `hass`, clics et clavier sont exercées contre les classes exactes. `vm`, DOM, stockage et création de la carte native sont simulés ; les fonctions internes sont également interrogées pour rendre les observations inspectables.

Les tests de concurrence imposent volontairement des réponses dans un ordre défavorable. Ils prouvent l'absence de protection dans ces scénarios reproductibles. Ils ne prouvent ni leur fréquence en production ni qu'ils ont causé à eux seuls les anciennes erreurs de configuration observées dans HA.

Les fonctions préservées sont vérifiées au niveau contrat : délégation à `type: map`, durée historique, filtres multiples et couleurs stables, Tous/aucun et persistance de la sélection vide, séparation par `storage_key` explicite, bornes et indisponibilité des batteries, indicateur de charge, référence d'avatar, structure de batterie compacte, navigation clavier et événement `hass-more-info`. Leur aspect réel et le chargement des images restent à vérifier dans HA.

## Défauts démontrés et suites proposées

| Références | Observation | Correction à préparer après versionnement GitHub |
| --- | --- | --- |
| H05–H06 | Une création ancienne peut remplacer la configuration récente ; un filtre utilisé pendant le chargement n'est pas appliqué à la carte reçue. | Invalider les créations précédentes avec une génération ; vérifier la génération à chaque reprise asynchrone ; réappliquer la configuration courante au montage. |
| H07–H08 | Rejet du chargeur non géré ; montage encore effectué après détachement. | Capturer et afficher l'erreur, proposer une relance contrôlée ; invalider au détachement et définir le comportement de reconnexion. |
| H09 | La clé par défaut est globale. | Exiger ou dériver une identité d'instance stable ; migrer l'ancien stockage sans perdre une sélection vide. Les clés explicites distinctes fonctionnent déjà. |
| H10, R09 | Une mise à jour HA sans rapport remplace les éléments interactifs et leur fait perdre le focus. | Conserver le DOM et actualiser les valeurs utiles ; sélectionner les entités dépendantes et éviter les rendus inutiles. |
| R04 | Des attributs conservés d'une entité `unavailable` deviennent une localisation affichée comme actuelle. | Porter explicitement disponibilité et provenance ; afficher « dernière position connue » seulement si cette donnée est distinguée du courant. |
| R05–R06 | `null` et des coordonnées hors domaine sont considérés valides. | Rejeter null, chaîne vide et booléens ; vérifier latitude −90…90 et longitude −180…180. |
| R07 | « Position actuelle » est affiché sans horodatage du relevé de position. | Relever les champs réellement fournis et leur sémantique ; si aucun horodatage GPS fiable n'existe, afficher une fraîcheur inconnue. Ne jamais assimiler `last_updated` à l'heure du relevé GPS. |
| R08 | La précision fournie par `gps_accuracy` n'est pas exposée. | Montrer l'incertitude mesurée, avec son unité vérifiée, sans promettre une précision supérieure. |

## Limites à conserver dans la preuve de livraison

- Aucun test de la carte native HA elle-même, de la récupération réelle de l'historique ou du fournisseur de tuiles. Le correctif du filigrane reste un sujet distinct.
- Aucun navigateur ni rendu CSS réel : mobile/desktop, thèmes, chargement des Memoji, dimensions des batteries, navigation HA et refresh sont encore des recettes à faire.
- Aucun accès à des données personnelles ; noms, entités, chemins, lieu et coordonnées du jeu de tests sont fictifs.
- Aucun benchmark de temps ou mémoire. Le remplacement de DOM et la perte de focus sont observés ; un gain de performance chiffré ne peut pas encore être annoncé.
- Aucune modification du produit, aucun CI distant, merge, publication, déploiement ou contrôle de version réellement chargée n'est établi par ce dossier.

Les sources par défaut sont src/. La sortie par défaut est artifacts/ (ignorée par Git). evidence/ conserve le relevé daté initial, sans réécriture par les futurs tests.

## Régressions RC.2 sur l’artefact distribué
28 contrats au total : sept ajouts couvrent le composant natif non défini à froid, délai/retry, détachement/remontage, GPS à domicile, séparation géocodage/précision et schémas des deux éditeurs. `POC_BUNDLE="$PWD/dist/ha-board.js" POC_SOURCE_DIR="$PWD/src/candidate" node tests/contracts.mjs` exécute ces contrats sur le bundle HACS. Quatre tests Python refusent publication depuis PR, mauvais SHA, version stable automatique et artefact modifié. Cela ne prouve pas le rendu réel des formulaires HA.

## Lot #8

Le harnais strict compte désormais 39 contrats sur les sources et le bundle. Les nouveaux cas couvrent zone nommée, ville structurée/adresse, refus rue-pays-coordonnées/libellés techniques, durée hors domicile, affichage courant allégé, sources et dates dans le détail qualité, adresse ancienne avec ou sans date GPS, adresse antérieure à l’entrée dans la zone et états inconnus/indisponibles. L’adaptateur U3 non livré dispose de trois contrats séparés :

```bash
node tests/history-address-adapter.mjs
```

Ils couvrent deux points à deux adresses, absence d’adresse, cache borné, déduplication, réponse tardive, reconfiguration et détachement. Ils ne prouvent ni l’accès à une source historique réelle ni une bulle HA, car le frontend ciblé n’expose pas le point d’extension nécessaire.

## Pilote météo

`node tests/weather-contracts.mjs`, puis `WEATHER_SOURCE=dist/weather-combined-forecast-card.js node tests/weather-contracts.mjs` exécutent 22 contrats sur les deux fichiers, dont valeurs implicites, `false`/`0`, modification ciblée, retour au défaut et réouverture de l’éditeur. `python3 scripts/check_weather.py` vérifie intégrité, fermeture de distribution, notices et bundle Personnes inchangé. `python3 -m unittest tests/test_weather_resource_migration.py -v` exécute la méthode HACS installée sur ressources fictives dans les deux ordres et après une mise à jour suivante.

`node --experimental-websocket tests/weather-browser.mjs` utilise Chrome déjà installé (`CHROME_BIN` peut préciser son exécutable), Node avec WebSocket natif et zéro dépendance npm produit. Captures et rapport fictifs dans `artifacts/weather-browser/`. L’échec de disponibilité de Chrome arrête ce contrôle, sans prétendre vérifier le rendu. Servir la racine du dépôt avec `python3 -m http.server 8000 --bind 127.0.0.1`, puis ouvrir `/examples/weather-demo.html` pour une démonstration locale sans HA.
