# HA-BOARD

**Cartes Home Assistant · Installation HACS / Dashboard · Socle projets**

[![Ouvrir HA-BOARD dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=smornierHA&repository=ha-board&category=plugin)

Le bouton ouvre HA-BOARD dans ton HACS et te laisse confirmer le téléchargement. HACS doit déjà être installé ; aucune adresse de ton installation n’est stockée dans ce dépôt. [Installation, mises à jour et retour arrière](docs/HACS.md).

| Carte | Fonctions | Configuration |
|---|---|---|
| [Person History Map](docs/CARDS.md#person-history-map) | Historique des déplacements, filtres individuels/multiples, Tous/aucun et couleurs | Éditeur visuel natif HA ou YAML |
| [Person Rich Card](docs/CARDS.md#person-rich-card) | Présence, dernière position connue, Memoji, batteries et charge ; compact/détail | Éditeur visuel natif HA ou YAML |

[Catalogue et options](docs/CARDS.md) · [Releases](https://github.com/smornierHA/ha-board/releases) · [Compatibilité](docs/COMPATIBILITY.md) · [Recette](docs/ACCEPTANCE.md) · [État vérifié](docs/STATUS.md).

La distribution de référence reste `v0.1.0-rc.2`. Le candidat de maintenance `0.1.1-rc.1` traite le besoin de l’issue [#8](https://github.com/smornierHA/ha-board/issues/8) dans la PR de réalisation [#9](https://github.com/smornierHA/ha-board/pull/9) ; il n’est ni fusionné, ni publié, ni installé. Pour U3, la révision frontend étudiée ne fournit pas de point d’extension public adapté permettant d’enrichir les bulles historiques natives : l’adaptateur est préparé, mais U3 reste non livré et soumis à décision. Aucun correctif du fournisseur de tuiles n’est inclus ; le chantier Core reste distinct.

Pour contribuer : [AGENTS.md](AGENTS.md), [projet](PROJECT.md), [architecture](docs/ARCHITECTURE.md), [CI](docs/CI-CONTRACT.md), [roadmap](docs/ROADMAP.md). Le socle central est privé ; ses règles applicables sont disponibles ici dans AGENTS.md. Les originaux immuables restent dans `src/`, les sources maintenues dans `src/candidate/`, le bundle HACS dans `dist/`.

Code et exemples fictifs publics uniquement. Données et images familiales exclues. Les tests Node simulent les contrats frontend ; la CI documentaire ne valide aucune application. Les protections GitHub observées sont absentes : PR, revue et contrôle du SHA intégré sont des règles de livraison, sans verrou natif revendiqué.
