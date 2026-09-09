# Provenance Garage Control

## Chaîne d’origine et d’expurgation

| Niveau | Taille | SHA256 | Statut |
|---|---:|---|---|
| Original HA privé `garage-control-card.js` 1.0.1 | 59 336 | `5edd41a20a51f76998e282c9974cff211f631c7c31ea4c771d2cd173ae3c2f48` | relu via HA-MCP ; reste hors Git public et en place pour le rollback |
| Export public `src/garage-control-card.js` | 59 332 | `dcd51397e8e6f68a43679f337a18470868a99efc2e6ff726a502db69b46cfc07` | deux alias/libellés de véhicules remplacés par A/B ; aucune configuration HA copiée |
| Source maintenue `src/candidate/garage-control-card.js` 1.1.0 | 70 163 | `00511ff7ae78183e4c54cb8dbcffe81d25d55949dd92ab64c4ba38cf8fa336da` | G1, réponses tardives, éditeur et import de construction |
| Distribution `dist/garage-control-card.js` | 91 044 | `e86c3bd86a7bfa69866da5712af69519717ea6fc234b93ca84ecc720b7b2bba3` | module autonome avec Lit incorporé ; aucun import runtime |

La configuration active, les identifiants d’entités, les images et les URLs internes ne sont pas exportés. Les exemples utilisent exclusivement le préfixe `example` et des SVG fictifs. La fiche machine est `garage-provenance.json` et sa copie distribuée est manifestée.

## Dépendance de construction

`lit-element@4.2.0` est déclaré à version exacte dans `package.json`. `package-lock.json` verrouille `lit-element@4.2.0`, `lit-html@3.3.3` et `@lit/reactive-element@2.1.2` avec leurs intégrités npm. `esbuild@0.25.9` est un outil de développement exact ; il n’est pas incorporé au module. La licence BSD-3-Clause de Lit est conservée dans `third_party/lit-BSD-3-Clause.txt`, copiée dans `dist/`, et décrite dans `THIRD-PARTY-NOTICES.md`.

L’en-tête de l’original décrit une inspiration ergonomique par la carte Portail locale et l’absence de dépendance SIP. Aucun code, endpoint ou asset Portail/SIP n’est importé par le candidat ; Portail #14 reste hors périmètre. Aucun autre auteur ou avis de licence tiers n’était présent dans l’original. La migration publique est réalisée sous le mandat explicite du propriétaire du dépôt.

## Limites de preuve

Les contrats Node et la comparaison Chrome utilisent des entités, images et services fictifs. Ils prouvent le cycle de vie, les appels simulés et la fidélité visuelle du banc, pas une installation HACS ni une ouverture/fermeture physique. La recette Home Assistant native et tout essai réel nécessitent un mandat séparé après publication et installation autorisées.
