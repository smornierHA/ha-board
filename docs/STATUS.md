# État courant — 9 septembre 2026

Le lot `v0.1.2-rc.1` est **publié, installé via HACS, chargé dans le navigateur et validé par la recette Home Assistant ciblée de l’utilisateur**. La [clôture de supervision](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) consolide les preuves techniques et la confirmation reçue le 9 septembre après rafraîchissement de la vue Personnes.

| Étape | État prouvé | Référence |
|---|---|---|
| Code | Fusionné sur `main` par la [PR #11](https://github.com/smornierHA/ha-board/pull/11) | `21c8212f8ae47fb3ff7d86131dd7c821c688b46e`, arbre `c6148511137da9ddef61d34384df3de052fe0d1b` |
| CI intégrée | Réussie ; 43/43 contrats sources et bundle, régression ville incluse | [run 34258176907](https://github.com/smornierHA/ha-board/actions/runs/34258176907) |
| Publication | Candidate publiée | [v0.1.2-rc.1](https://github.com/smornierHA/ha-board/releases/tag/v0.1.2-rc.1), [preuves de livraison](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5589311573) |
| Artefact | Bundle identifié | `ha-board.js`, 38 462 octets, SHA256 `80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6` |
| Installation HACS | `v0.1.2-rc.1`, aucune mise à jour en attente | [contrôles techniques](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597510216) |
| Chargement navigateur | Confirmé par l’utilisateur après rafraîchissement forcé | [confirmation du 9 septembre](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) |
| Recette HA ciblée | Compact/détail et navigation confirmés par l’utilisateur, sans anomalie signalée | [confirmation du 9 septembre](https://github.com/smornierHA/ha-board/pull/11#issuecomment-5597988326) |
| Retour arrière | `v0.1.1-rc.1` reste disponible ; downgrade non rejoué dans ce lot | [procédure HACS](HACS.md) |
| Stable | Non promue | critères S2–S4 et décision S5 de la [roadmap](ROADMAP.md) distincts |

Composants livrés : Person Rich 3.4.7 et Person History Map 1.4.2. La réserve du banc de capture automatique Puppet ne remet pas en cause la vérification effectuée dans le navigateur utilisateur authentifié. Elle ne constitue pas non plus une preuve de campagne visuelle automatisée complète.

## Résultat du correctif visuel

`v0.1.2-rc.1` conserve les contrôles internes de provenance, date, cohérence des sources et séparation d’adresse, mais retire de l’affichage Person Rich :

- le bandeau de présence / dernière position ;
- le dépliant de qualité et tout son contenu ;
- la note de fraîcheur sous Proximité / Trajet / Destination.

Le libellé compact et détaillé utilise la zone HA nommée en priorité, sinon le nom de ville seul. Une rue, un code postal, un pays ou une donnée future/incohérente ne deviennent pas le libellé courant. La ligne d’adresse distincte reste affichée lorsqu’elle est rapprochable. La durée n’est accolée qu’à `Maison`, jamais à une ville hors domicile.

Les originaux dans `src/`, les types YAML, Person History Map, Memoji, batteries, équipements, navigation et blocs de trajet sont préservés.

## U3 et suites

L’ancien U3 « adresse dans les bulles historiques natives » est **écarté par décision utilisateur et non livré**. Aucun prototype supplémentaire n’est lancé. Son remplacement est le backlog [#10](https://github.com/smornierHA/ha-board/issues/10) : graphe historique durée + position dans chaque vignette Person Rich. Ce backlog reste séparé.

Le lot localisation [#8](https://github.com/smornierHA/ha-board/issues/8) est clos sur ce périmètre. Les futures cartes météo, portail et garage relèvent des lots M2–M4 de la [roadmap](ROADMAP.md), sans nouvelle installation ni modification Core/OS/NAS/Livebox/Frigate dans cette clôture documentaire.

## Incrément météo #12 en préparation

Branche `feat/migrate-weather-combined-12`, base `5ed7fae658a326e5520b5a62031f11c02571e539`. Candidate **0.2.0-rc.1**, ressource météo séparée, W1 et éditeur traités. Original privé relu sans dérive, export public expurgé et distribution identifiés. Les 43 contrats Personnes passent sur sources/bundle ; bundle 0.1.2-rc.1 inchangé. Les 19 contrats météo passent séparément sur source/distribution, les contrôles Python de publication sont étendus. La CI du SHA poussé et les preuves de rendu sont consignées sur la PR du lot.

**Préparé/testé localement** ne signifie pas accepté, fusionné, publié, installé, chargé ou recetté dans HA. Le seul produit installé/recetté reste 0.1.2-rc.1 décrit en tête. La licence des portions historiques météo reste à qualifier ; le publisher bloque tant que cette réserve est ouverte. Garage #13 puis Portail #14 restent des lots indépendants, non implémentés. Aucune modification HA, commande physique ni appel SIP dans ce cycle.
