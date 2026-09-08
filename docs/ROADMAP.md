# Roadmap HA-BOARD — base v0.1.0-rc.2

La base fonctionnelle à conserver est `v0.1.0-rc.2`, commit `eeb56c9b66346b90275820a6d6fb4ca0fb94cebe`. Le lot #8 prépare `0.1.1-rc.1` depuis `main` `1213ef428568448373ade92f1aa2969100c62e2b` : aucune collecte familiale, fusion, publication ou installation dans ce mandat.

## Avant une éventuelle promotion stable

| Priorité | Résultat attendu | Critère de fin |
|---|---|---|
| S1 | Version navigateur prouvée | release/SHA exécuté relevé après rechargement complet |
| S2 | Éditeurs réels vérifiés | ouverture, modification, sauvegarde et réouverture pour les deux cartes |
| S3 | Matrice visuelle minimale | refresh/navigation desktop + mobile, clair + sombre, résultats consignés |
| S4 | Retour arrière éprouvé | downgrade HACS exécuté, ou fallback original exécuté et limites motivées |
| S5 | Décision stable | revue des preuves ; nouveau SHA/tag stable distinct si décision positive |

Le retour utilisateur favorable général ne remplit pas automatiquement S1–S4. La stable n’est pas publiée dans ce lot.

## Lots futurs issus de #6

### M1 — Maintenance des deux cartes du POC

- Objectif : traiter uniquement les défauts ou améliorations démontrés de Person History Map et Person Rich Card, sans réécrire la base fonctionnelle.
- Dépendances : `v0.1.0-rc.2`, API frontend native, HACS Dashboard, types YAML existants, composants natifs réellement utilisés.
- Sources à inventorier au démarrage : issue et captures expurgées, versions Core/frontend/HACS, ressources actives, configuration fictive équivalente, code `src/candidate`, bundle installé, CARDS/ACCEPTANCE, originaux et empreintes.
- Invariants/recette : historique, filtres multiples et Tous/aucun, couleurs, Memoji, batteries iOS/charge, présence/localisation/précision, navigation, éditeurs, sauvegarde/réouverture, froid/retry, mobile/thèmes et plusieurs instances.
- Migration/rollback HACS : release SemVer proportionnée depuis le SHA intégré, mise à jour avec ressource unique, version navigateur relue ; downgrade vers RC.2 ou fallback des deux originaux, sans double chargement.

État issue #8 / PR #9 : U1 (zone/ville) et U2 (position allégée) sont implémentés dans le candidat et restent à recetter dans HA sous mandat distinct. U3 n’est pas livré : la révision frontend étudiée ne fournit pas de point d’extension public adapté permettant d’enrichir les bulles historiques natives. Le remplacement du renderer n’est pas autorisé dans le mandat actuel et l’adaptateur ne doit pas être raccordé. U3 reste une décision à prendre ; dans un nouveau lot seulement, les options d’architecture pourront être soit d’attendre une évolution HA exposant un point d’extension adapté, soit d’évaluer, après décision explicite, un renderer cartographique encapsulé propre à HA-BOARD. Aucun géocodage inverse ni envoi de coordonnées à un service n’appartient à la PR #9.

### M2 — Carte(s) météo

- Objectif : inventorier puis intégrer le ou les composants météo réellement visés ; aucune ressource n’est choisie avant cet inventaire.
- Dépendances : entités/providers météo observés, éventuels composants frontend, licences, assets, services et stratégie de rafraîchissement. Charger les dépendances optionnelles sans pénaliser les cartes Personnes.
- Sources à inventorier au démarrage : dashboard/configuration expurgés, liste des ressources et versions, dépôts/licences upstream, options visuelles, usages desktop/mobile, commandes éventuelles, original de chaque composant et SHA256.
- Invariants/recette : informations météo existantes, unités/localisation, prévisions et alertes réellement utilisées, états unavailable, éditeur visuel complet, thèmes, responsive, froid/navigation, absence d’appel ou ressource dupliqué.
- Migration/rollback HACS : décider un composant ou groupe justifié après inventaire ; conserver les originaux, migrer une ressource à la fois, vérifier le bundle installé et permettre downgrade/fallback par composant.

### M3 — Carte portail

- Objectif : intégrer la carte portail en préservant affichage et commandes existantes, sans déclencher d’action physique lors d’une recette documentaire.
- Dépendances : composant actuel, entités et scripts HA, SIP/appel, webhook `answered_by`, navigation et droits de service ; endpoints/identifiants restent hors Git.
- Sources à inventorier au démarrage : code/original/SHA256, YAML expurgé, liste des entités/services/automatisations consommateurs, versions HA/HACS, dépendances SIP, procédures de commande manuelle et preuves privées ciblées.
- Invariants/recette : boutons d’appel permanents, destinataires/configuration fictifs, statut/retour d’appel, confirmation et erreurs, clavier/tactile, éditeur, thèmes/mobile, commandes mockées puis essai réel séparément autorisé.
- Migration/rollback HACS : release isolée, configuration/endpoints injectés hors bundle, ressource unique, vérification sans commande réelle puis recette autorisée ; downgrade ou réactivation de l’original avec empreinte.

### M4 — Carte garage

- Objectif : intégrer la carte garage sans altérer les garde-fous des ouvertures ni les retours d’état.
- Dépendances : composant actuel, entités porte/mouvement/allée, scripts/services, permissions et protections contre double commande.
- Sources à inventorier au démarrage : original/SHA256, configuration expurgée, consommateurs, états et transitions, icônes/assets/licences, version HA/HACS et procédure de récupération.
- Invariants/recette : feedback mouvement orange, dernière personne si source fiable, icône allée, états inconnu/indisponible, commandes protégées/idempotentes, éditeur, mobile/thèmes ; tests simulés avant toute commande réelle explicitement autorisée.
- Migration/rollback HACS : release par composant, une ressource active, vérifier version et transitions ; downgrade ou restauration de l’original/configuration sauvegardée, puis contrôle d’état sans action physique non mandatée.

## Règles communes aux lots

Préserver originaux et SHA256 avant modification, données privées hors Git, exemples fictifs, identités et fonctions existantes. Chaque carte conserve éditeur visuel, catalogue, nom sans version, `documentationURL` et bouton HACS. Tester le bundle réellement installé, les dépendances optionnelles et l’absence de doublons/imports manquants. Release/artefact proviennent du SHA intégré et chaque migration dispose d’un rollback ciblé.

Les lots sont séparés par composant ou groupe justifié. Un ajout de carte appelle normalement une version mineure ; un correctif compatible peut être un patch. La décision finale suit le delta réel. La maintenance mensuelle du socle existe déjà et n’est pas dupliquée.

Le chantier MAP/Core, Livebox (`smornierHA/hass-livebox-component`, branche `livebox-l2.17c`), NAS et Frigate restent séparés.
