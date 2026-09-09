# Provenance du pilote météo #12

Collecte en lecture seule le **9 septembre 2026**, via HA-MCP exécuté avec succès. La ressource active et la configuration ciblée ont été relues. Le fichier est inchangé par rapport au ticket : 129 967 octets, SHA256 `da5a13fce2b78fe7109394918a1fb80861955ff9d2319d22be1f66197df74f1b`, en-tête `V1.9.4.2.10`, nom historique `weather-combined-forecast-card-v1.17.10.js`.

## Quatre états distincts

| État | Conservation et rôle |
|---|---|
| Original privé | Octets exacts + seule configuration de la carte, conservés hors Git dans une archive privée ; aucune modification HA |
| Export public immuable | `src/weather-combined-forecast-card.js` ; huit identifiants d’entités remplacés par des références fictives, commentaires compris ; pas un original brut |
| Candidat maintenu | `src/candidate/weather-combined-forecast-card.js` ; W1, éditeur/catalogue et contrôles ciblés |
| Distribution préparée | `dist/weather-combined-forecast-card.js`, copie exacte du candidat, version de package `0.2.0-rc.1` ; non publiée |

Les empreintes indépendantes, tailles et transformations sont dans `weather-provenance.json`, `source-manifest.json`, `candidate-manifest.json` et `dist/manifest.json`. Aucun export du dashboard familial, alias, adresse, endpoint privé ou capture réelle ne figure dans le dépôt. La conservation privée n’est ni une archive chiffrée transférée dans project-archives, ni une sauvegarde restaurable de HA ; ces opérations ne sont pas revendiquées.

Les options présentes dans la configuration active ont été rapprochées des options de l’éditeur sans exporter leurs valeurs. Les identifiants fictifs des valeurs par défaut doivent être remplacés dans la configuration privée. Le mode maison conserve son angle historique, les valeurs configurées restent prioritaires. La carte ne change aucune entité HA.

## Attribution et réserve de licence

Le fichier observé ne contient **aucune licence explicite ni identité d’auteur**. Il ne permet pas de déduire une licence MIT ou une autorisation upstream. Aucune licence globale n’est inventée dans ce lot. Le mandat utilisateur autorise la préparation de l’export public et de la PR ; la qualification de redistribution reste ouverte avant une release.

Les commentaires attribuent déjà les phénomènes, sévérités, palettes et icônes du mode `weather_alert_pills` à `weather-alert-pills-card-v3.js`. Ils sont conservés. Le fichier d’alertes a également été relu uniquement pour sa provenance : aucune notice de licence ou d’auteur n’y a été trouvée. Aucun import runtime de cette carte ni d’une autre carte météo n’est ajouté. Des commentaires citent aussi les conventions de `weather-wind-forecast-card` et `clock-weather-card` ; les SVG intégrés n’ont pas de notice de licence identifiable dans l’original. La supervision devra obtenir une référence d’auteur/licence pour les portions concernées ou décider leur remplacement avant publication. `license_review: pending` bloque explicitement le publisher, même après une fusion accidentelle.

## Diff produit proportionné

- Génération d’abonnement propre à chaque instance ; libération immédiate d’un résultat devenu obsolète, même lors d’un aller-retour A → B → A.
- Reconnexion DOM, remplacement de connexion HA et événements `disconnected`/`ready` ; nettoyage listeners/timers/frames et interactions au détachement.
- Éditeur `ha-form`, groupes en-tête/risques/actions et options avancées ; objets imbriqués et clés YAML inconnues conservés quand non modifiés.
- Validation numérique bornée : zéro et nombres avec unités usuelles restent valides ; booléens, objets et texte malformé sont absents, pas des mesures.
- Le CSS existant, la logique des risques, l’orientation et les points d’entrée Personnes sont conservés. Pas de refonte graphique.

Le socle RC.8 (`463d9fadd58cbb4a558e9224c336a4ed4e182053`) et son profil HA/coordination ont été lus. Application par diff des seules règles utiles, sans adoption complète revendiquée. Les enseignements à remonter au socle sont le téléchargement de tous les assets HACS, la distinction original/export/candidat/distribution et le test de résolution tardive après détachement ; aucun changement du dépôt privé du socle n’est inclus ici.
