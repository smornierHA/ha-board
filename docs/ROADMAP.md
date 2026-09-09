# Roadmap HA-BOARD — base candidate validée v0.2.0-rc.1

La distribution courante `v0.2.0-rc.1` ajoute la météo et conserve Personnes `v0.1.2-rc.1` octet pour octet. Elle est publiée, installée, chargée et sa [recette HA ciblée est confirmée le 9 septembre 2026](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). Localisation #8 et météo #12 sont clos ; **Garage #13 est le prochain lot**, puis Portail #14.

## Avant une éventuelle promotion stable

| Priorité | Résultat attendu | Critère de fin |
|---|---|---|
| S1 | Chargement navigateur confirmé | confirmation utilisateur du 9 septembre après rafraîchissement forcé, rapprochée des contrôles techniques du bundle |
| S2 | Éditeurs réels vérifiés | ouverture, modification, sauvegarde et réouverture pour les deux cartes |
| S3 | Matrice visuelle minimale | refresh/navigation desktop + mobile, clair + sombre, résultats consignés |
| S4 | Retour arrière éprouvé | downgrade HACS exécuté, ou fallback original exécuté et limites motivées |
| S5 | Décision stable | revue des preuves ; nouveau SHA/tag stable distinct si décision positive |

S1 et la recette ciblée du correctif sont confirmés. Les preuves S2–S4 ne sont pas déduites de ce seul retour ; elles restent à compléter avant une éventuelle décision S5. Aucune promotion stable n’est incluse dans cette clôture.

## Lots issus de #6

L’inventaire du 9 septembre est consigné dans les tickets dédiés. Ordre de migration retenu : **M2 météo [#12](https://github.com/smornierHA/ha-board/issues/12) → M4 garage [#13](https://github.com/smornierHA/ha-board/issues/13) → M3 portail SIP [#14](https://github.com/smornierHA/ha-board/issues/14)**. Chaque lot reprend son inventaire et préserve les options réellement configurées ; aucune installation ou commande physique n’est déduite de cette préparation.

### M1 — Maintenance des deux cartes du POC

- Objectif : traiter uniquement les défauts ou améliorations démontrés de Person History Map et Person Rich Card, sans réécrire la base fonctionnelle.
- Dépendances : `v0.1.2-rc.1`, API frontend native, HACS Dashboard, types YAML existants, composants natifs réellement utilisés.
- Sources à inventorier au démarrage : issue et captures expurgées, versions Core/frontend/HACS, ressources actives, configuration fictive équivalente, code `src/candidate`, bundle installé, CARDS/ACCEPTANCE, originaux et empreintes.
- Invariants/recette : historique, filtres multiples et Tous/aucun, couleurs, Memoji, batteries iOS/charge, localisation, navigation, éditeurs, sauvegarde/réouverture, froid/retry, mobile/thèmes et plusieurs instances.
- Migration/rollback HACS : release SemVer proportionnée depuis le SHA intégré, mise à jour avec ressource unique, version navigateur relue ; downgrade vers la version antérieure validée du lot (actuellement `v0.1.1-rc.1`) ou fallback des deux originaux, sans double chargement.

État du correctif post-installation : `v0.1.2-rc.1`, publié, installé, chargé et accepté en recette ciblée, retire de Person Rich les trois éléments techniques signalés par l’utilisateur, conserve zone → ville seule comme libellé, garde l’adresse distincte lorsqu’elle est cohérente et préserve les contrôles temporels internes sans avertissement visible. Person History Map reste inchangée.

L’ancien U3 de #8 (« adresse dans les bulles historiques natives ») est **écarté par décision utilisateur, sans être déclaré livré**. Aucun prototype supplémentaire n’est à lancer. Son remplacement est le backlog [#10](https://github.com/smornierHA/ha-board/issues/10) : graphe historique combinant durée et position (zone ou adresse historique) dans chaque vignette Person Rich. #10 reste un lot séparé et n’est pas développé dans `0.1.2-rc.1`.

### M2 — Carte(s) météo — #12 clos

- Objectif : inventorier puis intégrer le ou les composants météo réellement visés ; aucune ressource n’est choisie avant cet inventaire.
- Dépendances : entités/providers météo observés, éventuels composants frontend, licences, assets, services et stratégie de rafraîchissement. Charger les dépendances optionnelles sans pénaliser les cartes Personnes.
- Sources à inventorier au démarrage : dashboard/configuration expurgés, liste des ressources et versions, dépôts/licences upstream, options visuelles, usages desktop/mobile, commandes éventuelles, original de chaque composant et SHA256.
- Invariants/recette : informations météo existantes, unités/localisation, prévisions et alertes réellement utilisées, états unavailable, éditeur visuel complet, thèmes, responsive, froid/navigation, absence d’appel ou ressource dupliqué.
- Migration/rollback HACS : décider un composant ou groupe justifié après inventaire ; conserver les originaux, migrer une ressource à la fois, vérifier le bundle installé et permettre downgrade/fallback par composant.

### M3 — Carte portail

- Objectif : intégrer la carte portail en préservant affichage et commandes existantes, sans déclencher d’action physique lors d’une recette documentaire.
- Dépendances : composant actuel, entités et scripts HA, SIP/appel, webhook `answered_by`, navigation et droits de service ; endpoints/identifiants restent hors Git.
- Sources à inventorier au démarrage : code/original/SHA256, YAML expurgé, liste des entités/services/automatisations consommateurs, versions HA/HACS, dépendances SIP, procédures de commande manuelle et preuves privées ciblées.
- Invariants/recette : préservation de `call_buttons_mode` configuré (`contextual` observé, `always` disponible), destinataires/configuration fictifs, statut/retour d’appel, confirmation et erreurs, clavier/tactile, éditeur, thèmes/mobile, commandes mockées puis essai réel séparément autorisé.
- Migration/rollback HACS : release isolée, configuration/endpoints injectés hors bundle, ressource unique, vérification sans commande réelle puis recette autorisée ; downgrade ou réactivation de l’original avec empreinte.

### M4 — Carte garage

- Objectif : intégrer la carte garage sans altérer les garde-fous des ouvertures ni les retours d’état.
- Dépendances : composant actuel, entités porte/mouvement/allée, scripts/services, permissions et protections contre double commande.
- Sources à inventorier au démarrage : original/SHA256, configuration expurgée, consommateurs, états et transitions, icônes/assets/licences, version HA/HACS et procédure de récupération.
- Invariants/recette : préservation de `show_motion_badge` configuré (`false` observé) et du feedback mouvement lorsque l’option est activée, dernière personne si source fiable, icône allée, états inconnu/indisponible, commandes protégées/idempotentes, éditeur, mobile/thèmes ; tests simulés avant toute commande réelle explicitement autorisée.
- Migration/rollback HACS : release par composant, une ressource active, vérifier version et transitions ; downgrade ou restauration de l’original/configuration sauvegardée, puis contrôle d’état sans action physique non mandatée.

## Règles communes aux lots

Préserver originaux et SHA256 avant modification, données privées hors Git, exemples fictifs, identités et fonctions existantes. Chaque carte conserve éditeur visuel, catalogue, nom sans version, `documentationURL` et bouton HACS. Tester le bundle réellement installé, les dépendances optionnelles et l’absence de doublons/imports manquants. Release/artefact proviennent du SHA intégré et chaque migration dispose d’un rollback ciblé.

Les lots sont séparés par composant ou groupe justifié. Un ajout de carte appelle normalement une version mineure ; un correctif compatible peut être un patch. La décision finale suit le delta réel. La maintenance mensuelle du socle existe déjà et n’est pas dupliquée.

Le chantier MAP/Core, Livebox (`smornierHA/hass-livebox-component`, branche `livebox-l2.17c`), NAS et Frigate restent séparés.

## Clôture du pilote météo #12 — 9 septembre 2026

- PR #16 fusionnée ; `v0.2.0-rc.1` publiée depuis `a9c885419cea031fb307623076100b04feb78e98`, CI intégrée réussie.
- HACS et bascule exécutés ; [recette native ciblée confirmée](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). W1, éditeur, provenance et notices traités ; bundle Personnes inchangé.
- [Migration et rollback ciblés](HACS.md#migration-météo-020-rc1) : conserver Personnes avant météo, une ressource par module. Rollback disponible, non exécuté.
- Documentation de distribution à aligner avant publication ; informations HACS et recette à relire après déploiement selon [HACS.md](HACS.md#documentation-à-chaque-livraison).
- Suite : #13 Garage puis #14 Portail. #10 reste au backlog ; aucune adoption complète du socle RC.8.
