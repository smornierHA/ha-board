# HA-BOARD

**Cartes Home Assistant · Installation HACS / Dashboard · Socle projets**

[![Ouvrir HA-BOARD dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=smornierHA&repository=ha-board&category=plugin)

Le bouton ouvre HA-BOARD dans ton HACS et te laisse confirmer le téléchargement. HACS doit déjà être installé ; aucune adresse de ton installation n’est stockée dans ce dépôt. [Installation, mises à jour et retour arrière](docs/HACS.md).

| Carte | Fonctions | Configuration |
|---|---|---|
| [Person History Map](docs/CARDS.md#person-history-map) | Historique des déplacements, filtres individuels/multiples, Tous/aucun et couleurs | Éditeur visuel natif HA ou YAML |
| [Person Rich Card](docs/CARDS.md#person-rich-card) | Zone ou ville lisible, adresse distincte, Memoji, batteries et charge ; compact/détail | Éditeur visuel natif HA ou YAML |
| [Weather Combined Forecast](docs/CARDS.md#weather-combined-forecast) | Météo, prévisions, pluie, vent et risques ; ressource autonome | Éditeur visuel et YAML |
| [Garage Control Card](docs/CARDS.md#garage-control-card) | État physique distinct, commande protégée, caméras, véhicules et événements ; ressource autonome | Éditeur visuel et YAML |

[Catalogue et options](docs/CARDS.md) · [Releases](https://github.com/smornierHA/ha-board/releases) · [Compatibilité](docs/COMPATIBILITY.md) · [Recette](docs/ACCEPTANCE.md) · [État vérifié](docs/STATUS.md).

La version candidate [`v0.3.0-rc.1`](https://github.com/smornierHA/ha-board/releases/tag/v0.3.0-rc.1) ajoute Garage Control comme troisième module autonome. Elle conserve octet pour octet les modules Personnes et météo de `v0.2.0-rc.1`. L’état daté de publication, installation, chargement et recette se trouve dans [STATUS](docs/STATUS.md) ; une version ou une CI ne constitue pas à elle seule une recette Home Assistant.

| Ressource Lovelace (type module) | Cartes |
|---|---|
| `/hacsfiles/ha-board/ha-board.js` | Person History Map et Person Rich Card |
| `/hacsfiles/ha-board/weather-combined-forecast-card.js?v=0.2.0-rc.1` | Weather Combined Forecast |
| `/hacsfiles/ha-board/garage-control-card.js?v=0.3.0-rc.1` | Garage Control Card |

HACS télécharge les trois modules ; Personnes reste la première ressource du namespace et météo/Garage se configurent séparément selon le [guide de migration](docs/HACS.md). Conserver une seule ressource par module. Les libellés Person Rich privilégient la zone HA nommée, sinon la ville seule. Le graphe historique durée + position reste au backlog [#10](https://github.com/smornierHA/ha-board/issues/10) ; l’ancienne demande U3 de bulles natives a été écartée sans être livrée.

Pour contribuer : [AGENTS.md](AGENTS.md), [projet](PROJECT.md), [architecture](docs/ARCHITECTURE.md), [CI](docs/CI-CONTRACT.md), [roadmap](docs/ROADMAP.md). Le socle central est privé ; ses règles applicables sont disponibles ici dans AGENTS.md. Les originaux immuables restent dans `src/`, les sources maintenues dans `src/candidate/`, le bundle HACS dans `dist/`.

Code et exemples fictifs publics uniquement. Données et images familiales exclues. Les tests Node simulent les contrats frontend ; la CI documentaire ne valide aucune application. Les protections GitHub observées sont absentes : PR, revue et contrôle du SHA intégré sont des règles de livraison, sans verrou natif revendiqué.
