# État courant — 9 septembre 2026

**Distribution installée : `v0.2.0-rc.1`, météo et Personnes.** Le lot météo est clos après les essais natifs globalement concluants confirmés par l’utilisateur. [Décision de supervision](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067).

**Candidat Garage : `v0.3.0-rc.1`, préparation de #13.** Source 1.0.1 relue sans dérive via HA-MCP ; export public expurgé et source maintenue 1.1.0 distincts. Le candidat corrige G1 et les réponses tardives, incorpore Lit, ajoute l’éditeur natif et prépare une bascule/rollback Garage seuls. Les contrats Node sont simulés ; la comparaison Chrome doit être rattachée à la CI exacte de la PR. État : préparé et testé localement hors navigateur ; non accepté, non fusionné, non publié, non installé, non chargé, non recetté dans HA. Aucun service réel n’a été appelé.

| Étape météo | État prouvé | Référence |
|---|---|---|
| Préparé, testé, accepté | PR #16 ; 22 contrats météo et 43 Personnes sur sources et distributions, 16 tests Python et rendu fictif | [Revue finale](https://github.com/smornierHA/ha-board/pull/16#pullrequestreview-5154581535) |
| Fusionné et publié | `v0.2.0-rc.1`, SHA `a9c885419cea031fb307623076100b04feb78e98` | [CI intégrée réussie](https://github.com/smornierHA/ha-board/actions/runs/34354484728), [release](https://github.com/smornierHA/ha-board/releases/tag/v0.2.0-rc.1) |
| Installé | HACS `v0.2.0-rc.1`, aucune mise à jour en attente ; fichiers et ressources contrôlés | [Preuve d’installation](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602574417) |
| Chargé et recette HA ciblée | Confirmation utilisateur du 9 septembre, tests globalement concluants | [Clôture](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067) |
| Rollback météo | Original et procédure disponibles ; non exécuté | [Procédure ciblée](HACS.md#rollback-météo-seul-non-exécuté) |

Météo distribuée/installée : **142 577 octets**, SHA256 `f853e1d46c887209ed3dad4c56d592a79bc9e769102654095ea2a7c6f6edc093`. Personnes : **38 462 octets**, SHA256 `80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6`, inchangé depuis `v0.1.2-rc.1` (Person Rich 3.4.7, Person History Map 1.4.2). Les empreintes des fichiers installés ont été recalculées lors de l’installation météo.

La remarque mineure sur la documentation HACS conduit à aligner README/catalogue/état et à contrôler la documentation avant publication puis après déploiement. Aucune anomalie fonctionnelle nouvelle signalée ; aucune matrice exhaustive éditeurs/thèmes/mobile ni promotion stable n’est déduite de la recette ciblée. Le banc de capture indisponible ne remet pas en cause les essais natifs de l’utilisateur.

**Prochaine étape : revue consolidée de la PR draft Garage #13**, puis décision séparée de fusion/publication. Portail #14 et historique #10 restent séparés. La maintenance du socle RC.8 ne bloque pas ces lots et son adoption complète n’est pas revendiquée.

## Historique clos : Personnes `v0.1.2-rc.1`

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

Le lot localisation [#8](https://github.com/smornierHA/ha-board/issues/8) est clos sur ce périmètre. Le lot météo #12 est également clos. Garage #13 puis Portail #14 suivent la [roadmap](ROADMAP.md) ; aucune modification Core/OS/NAS/Livebox/Frigate n’est incluse.
