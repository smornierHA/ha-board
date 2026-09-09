# Provenance Garage Control

## Chaîne d’origine et d’expurgation

| Niveau | Taille | SHA256 | Statut |
|---|---:|---|---|
| Original HA privé `garage-control-card.js` 1.0.1 | 59 336 | `5edd41a20a51f76998e282c9974cff211f631c7c31ea4c771d2cd173ae3c2f48` | relu via HA-MCP ; reste hors Git public et en place pour le rollback |
| Export public `src/garage-control-card.js` | 59 332 | `dcd51397e8e6f68a43679f337a18470868a99efc2e6ff726a502db69b46cfc07` | deux alias/libellés de véhicules remplacés par A/B ; aucune configuration HA copiée |
| Source maintenue `src/candidate/garage-control-card.js` 1.1.0 | 71 208 | `1669bb74e444ff497acd0ac09a28b9986268308b9b1a0de5120b7456fff821ad` | G1, réponses tardives, cycle de vie caméra, éditeur et import de construction |
| Distribution `dist/garage-control-card.js` | 91 977 | `6f7b151883a607b26ae146f18a1e2d30633698f152ddfd5d9dac6db5c1fefa4d` | module autonome avec Lit incorporé ; aucun import runtime |

La configuration active, les identifiants d’entités, les images et les URLs internes ne sont pas exportés. Les exemples utilisent exclusivement le préfixe `example` et des SVG fictifs. La fiche machine est `garage-provenance.json` et sa copie distribuée est manifestée.

## Dépendance de construction

`lit-element@4.2.0` est déclaré à version exacte dans `package.json`. `package-lock.json` verrouille `lit-element@4.2.0`, `lit-html@3.3.3` et `@lit/reactive-element@2.1.2` avec leurs intégrités npm. `esbuild@0.25.9` est un outil de développement exact ; il n’est pas incorporé au module. La licence BSD-3-Clause de Lit est conservée dans `third_party/lit-BSD-3-Clause.txt`, copiée dans `dist/`, et décrite dans `THIRD-PARTY-NOTICES.md`.

L’en-tête de l’original décrit une inspiration ergonomique par la carte Portail locale et l’absence de dépendance SIP. Aucun code, endpoint ou asset Portail/SIP n’est importé par le candidat ; Portail #14 reste hors périmètre. Aucun autre auteur ou avis de licence tiers n’était présent dans l’original. La migration publique est réalisée sous le mandat explicite du propriétaire du dépôt.

## Limites de preuve

Les contrats Node et la comparaison Chrome utilisent des entités, images et services fictifs. Ils couvrent notamment la reconnexion d’une même instance avec dialogue ouvert et caméra sélectionnée, ainsi que l’invalidation d’un chargement caméra après reconfiguration/détachement. Ils prouvent le cycle de vie, les appels simulés et la fidélité visuelle du banc, pas une installation HACS ni une ouverture/fermeture physique. La recette Home Assistant native et tout essai réel nécessitent un mandat séparé après publication et installation autorisées.
