# État courant — 8 septembre 2026

La prérelease `v0.1.1-rc.1` est publiée depuis `main` `d71e66ac3e6c1b6f8df728c248c0e7f32b5dd4e8` et l’utilisateur confirme son installation. Ce retour visuel ne constitue pas une recette Home Assistant complète ni une validation stable.

| Étape | État prouvé | Référence |
|---|---|---|
| Code `v0.1.1-rc.1` | Fusionné sur `main` | `d71e66ac3e6c1b6f8df728c248c0e7f32b5dd4e8`, arbre `0e54864d4cab95586be9055d840be7eaf30143b3` |
| Candidate installée | Publiée et installation confirmée par l’utilisateur | `v0.1.1-rc.1` |
| Artefact publié | Identifié | `ha-board.js`, 41 849 octets, SHA256 `f86b7409a54aaa0e4ba4bb9f9d61a9ade90366f6193b41a8ff964f712d17d2c9` |
| Retour utilisateur | Correctif visuel demandé | décision #8 du 8 septembre 2026 |
| Candidate suivante | Préparée sur branche corrective | `0.1.2-rc.1`, non fusionnée, non publiée, non installée |
| Stable | Non promue | recette HA complète et décision explicite toujours requises |

## Correctif visuel suivant

`0.1.2-rc.1` conserve les contrôles internes de provenance, date, cohérence des sources et séparation d’adresse, mais retire de l’affichage Person Rich :

- le bandeau de présence / dernière position ;
- le dépliant de qualité et tout son contenu ;
- la note de fraîcheur sous Proximité / Trajet / Destination.

Le libellé compact et détaillé utilise la zone HA nommée en priorité, sinon le nom de ville seul. Une rue, un code postal, un pays ou une donnée future/incohérente ne deviennent pas le libellé courant. La ligne d’adresse distincte reste affichée lorsqu’elle est rapprochable. La durée n’est accolée qu’à `Maison`, jamais à une ville hors domicile.

Les originaux dans `src/`, les types YAML, Person History Map, Memoji, batteries, équipements, navigation et blocs de trajet sont préservés.

## U3

L’ancien U3 « adresse dans les bulles historiques natives » est **écarté par décision utilisateur et non livré**. Aucun prototype supplémentaire n’est lancé. Son remplacement est le backlog [#10](https://github.com/smornierHA/ha-board/issues/10) : graphe historique durée + position dans chaque vignette Person Rich. Ce backlog n’est pas développé dans le correctif visuel.

Aucune fusion, publication de `0.1.2-rc.1`, installation HACS ou intervention Home Assistant/Core/OS/NAS/Livebox/Frigate n’est établie par cette préparation.
