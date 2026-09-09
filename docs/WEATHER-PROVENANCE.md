# Provenance du pilote météo #12

Collecte en lecture seule le **9 septembre 2026**, via HA-MCP exécuté avec succès. La ressource active et la configuration ciblée ont été relues. Le fichier est inchangé par rapport au ticket : 129 967 octets, SHA256 `da5a13fce2b78fe7109394918a1fb80861955ff9d2319d22be1f66197df74f1b`, en-tête `V1.9.4.2.10`, nom historique `weather-combined-forecast-card-v1.17.10.js`.

## Quatre états distincts

| État | Conservation et rôle |
|---|---|
| Original privé | Octets exacts + seule configuration de la carte, conservés hors Git dans une archive privée ; aucune modification HA |
| Export public immuable | `src/weather-combined-forecast-card.js` ; huit identifiants d’entités remplacés par des références fictives, commentaires compris ; pas un original brut |
| Candidat maintenu | `src/candidate/weather-combined-forecast-card.js` ; W1, éditeur/catalogue et contrôles ciblés |
| Distribution préparée | `dist/weather-combined-forecast-card.js`, copie exacte du candidat, version de package `0.2.0-rc.1` |

Les empreintes indépendantes, tailles et transformations sont dans `weather-provenance.json`, `source-manifest.json`, `candidate-manifest.json` et `dist/manifest.json`. Aucun export du dashboard familial, alias, adresse, endpoint privé ou capture réelle ne figure dans le dépôt. La conservation privée n’est ni une archive chiffrée transférée dans project-archives, ni une sauvegarde restaurable de HA ; ces opérations ne sont pas revendiquées.

Les options présentes dans la configuration active ont été rapprochées des options de l’éditeur sans exporter leurs valeurs. Les identifiants fictifs des valeurs par défaut doivent être remplacés dans la configuration privée. Le mode maison conserve son angle historique, les valeurs configurées restent prioritaires. La carte ne change aucune entité HA.

## Attribution et notices

Le fichier privé observé ne porte aucune licence globale ni identité d’auteur ; aucune licence globale HA-BOARD n’est donc inventée. La revue a isolé les portions effectivement reprises et les simples références fonctionnelles. Son résultat structuré est dans `weather-provenance.json`, `evidence/weather-provenance-review-2026-09-09.json` et `THIRD-PARTY-NOTICES.md`.

Les 16 tracés SVG de conditions météo correspondent à Home Assistant frontend, commit `18f79dfc919e2019102c4fde0606fdb449f4cc15`, `src/data/weather.ts`. Cette source est sous Apache-2.0. Le candidat et le fichier distribué signalent les modifications : assemblage conditionnel dans un SVG inline, classes, couleurs, tailles, groupes de conditions et échappement ajoutés par HA-BOARD. La notice et le texte Apache-2.0 sont des assets distribués, recensés avec taille et SHA256 dans `dist/manifest.json`.

Les phénomènes, sévérités, palettes et icônes de `weather_alert_pills` sont effectivement repris de la carte locale projet `weather-alert-pills-card-v3.js` fournie avec la source privée. Son attribution reste dans le code ; aucun import runtime ni origine tierce n’a été identifié. La comparaison ciblée avec `clock-weather-card` au commit `8fc1415dde5cf8d55d61c86ae2eb4a34b46e7732` ne trouve aucune ligne source non commentée identique d’au moins 40 caractères normalisés : le min/max et le gradient sont une inspiration fonctionnelle, avec fonctions, palette et rendu propres à HA-BOARD. Le fichier de test de la méthode HACS installée est attribué séparément sous MIT et n’entre dans aucun bundle JS.

`license_review: verified` est lié par contrôle automatique à ces preuves et aux deux notices distribuées. Il décrit cette revue ciblée ; il ne déclare pas une licence globale du dépôt.

## Diff produit proportionné

- Génération d’abonnement propre à chaque instance ; libération immédiate d’un résultat devenu obsolète, même lors d’un aller-retour A → B → A.
- Reconnexion DOM, remplacement de connexion HA et événements `disconnected`/`ready` ; nettoyage listeners/timers/frames et interactions au détachement.
- Éditeur `ha-form`, groupes en-tête/risques/actions et options avancées ; objets imbriqués et clés YAML inconnues conservés quand non modifiés.
- Validation numérique bornée : zéro et nombres avec unités usuelles restent valides ; booléens, objets et texte malformé sont absents, pas des mesures.
- Le CSS existant, la logique des risques, l’orientation et les points d’entrée Personnes sont conservés. Pas de refonte graphique.

Le socle RC.8 (`463d9fadd58cbb4a558e9224c336a4ed4e182053`) et son profil HA/coordination ont été lus. Application par diff des seules règles utiles, sans adoption complète revendiquée. Les enseignements à remonter au socle sont le téléchargement de tous les assets HACS, la distinction original/export/candidat/distribution et le test de résolution tardive après détachement ; aucun changement du dépôt privé du socle n’est inclus ici.
