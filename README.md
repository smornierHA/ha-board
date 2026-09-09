# HA-BOARD

**Cartes Home Assistant · Installation HACS / Dashboard · Socle projets**

[![Ouvrir HA-BOARD dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=smornierHA&repository=ha-board&category=plugin)

Le bouton ouvre HA-BOARD dans ton HACS et te laisse confirmer le téléchargement. HACS doit déjà être installé ; aucune adresse de ton installation n’est stockée dans ce dépôt. [Installation, mises à jour et retour arrière](docs/HACS.md).

| Carte | Fonctions | Configuration |
|---|---|---|
| [Person History Map](docs/CARDS.md#person-history-map) | Historique des déplacements, filtres individuels/multiples, Tous/aucun et couleurs | Éditeur visuel natif HA ou YAML |
| [Person Rich Card](docs/CARDS.md#person-rich-card) | Zone ou ville lisible, adresse distincte, Memoji, batteries et charge ; compact/détail | Éditeur visuel natif HA ou YAML |

[Catalogue et options](docs/CARDS.md) · [Releases](https://github.com/smornierHA/ha-board/releases) · [Compatibilité](docs/COMPATIBILITY.md) · [Recette](docs/ACCEPTANCE.md) · [État vérifié](docs/STATUS.md).

La distribution de référence est [`v0.1.2-rc.1`](https://github.com/smornierHA/ha-board/releases/tag/v0.1.2-rc.1), publiée depuis `21c8212f8ae47fb3ff7d86131dd7c821c688b46e`, installée via HACS et chargée dans le navigateur. La [recette HA ciblée confirmée par l’utilisateur le 9 septembre 2026](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) clôt le correctif visuel : les trois éléments techniques sont retirés et le libellé de localisation conserve la zone HA nommée, sinon la ville seule. Cette validation ne constitue pas une promotion stable. L’ancien U3 « adresse dans les bulles natives » est écarté par décision utilisateur, sans être déclaré livré ; son remplacement reste au backlog [#10](https://github.com/smornierHA/ha-board/issues/10). Aucun correctif du fournisseur de tuiles n’est inclus ; le chantier Core reste distinct.

Pour contribuer : [AGENTS.md](AGENTS.md), [projet](PROJECT.md), [architecture](docs/ARCHITECTURE.md), [CI](docs/CI-CONTRACT.md), [roadmap](docs/ROADMAP.md). Le socle central est privé ; ses règles applicables sont disponibles ici dans AGENTS.md. Les originaux immuables restent dans `src/`, les sources maintenues dans `src/candidate/`, le bundle HACS dans `dist/`.

Code et exemples fictifs publics uniquement. Données et images familiales exclues. Les tests Node simulent les contrats frontend ; la CI documentaire ne valide aucune application. Les protections GitHub observées sont absentes : PR, revue et contrôle du SHA intégré sont des règles de livraison, sans verrou natif revendiqué.
