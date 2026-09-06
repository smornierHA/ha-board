# Étape active — candidat RC.2

- Import et migration HACS terminés au commit c164258 ; ne pas les rejouer.
- Corriger la recette en échec : chargement natif à froid, données GPS, éditeurs visuels ; catalogue, titres sans version et bouton HACS.
- Valider les 28 contrats du bundle puis le SHA intégré ; publier la prérelease avec provenance et empreinte.
- Installer le candidat via HACS, relever la ressource et le bundle exact, puis réaliser la recette desktop/mobile, thèmes et édition/sauvegarde. Une capture ou une CI ne valide pas tous ces parcours.
- Reporter les exigences dans project-playbook RC.6 ; ne pas assimiler son gate documentaire/outils à la validation HA.

## Historique (ne constitue pas les prochaines actions)

# Roadmap active du POC

| ID | Priorité | Action / critère de fin | État |
|---|---|---|---|
| P01 | P1 | Collecte exacte + empreintes + rapprochement des références | Terminé localement |
| P02 | P1 | Dépôt public HA-BOARD expurgé accessible, import sur branche/PR | Baseline commit `59dd43b`, PR #1 draft ; documentation CI verte, baseline applicative rouge attendue |
| P03 | P1 | Besoin/architecture/fidélité/compatibilité/recette/runbook | Versionnés dans la PR #1 ; actualisation corrective en cours |
| P04 | P1 | Contrats de régression sur exemples fictifs | Baseline 7/19 ; candidat 21/21 localement, CI corrective à exécuter |
| P05 | P1 | Rendre CI Livebox exécutable sur HA2026.9.1 | PR Livebox #1 ouverte, commit 196564b ; tests locaux exécutables mais rouges |
| P06 | P1 | Backup post-intervention avec Recorder + clé et reprise hors Core | À établir avant Core |
| P07 | P1 | Correctif officiel Core MAP | Bloqué par P05/P06 ; aucun update OS/NAS/serveur Frigate |
| P08 | P1 | Corriger cycle async/filtres/reconfiguration/DOM après import GitHub | Candidat local vert : génération async, erreur visible, detach, stockage par instance, DOM stable |
| P09 | P1 | Dernière position connue/indisponibilité/précision | Candidat local vert : coordonnées validées, unavailable explicite, précision et fraîcheur source qualifiées |
| P10 | P1 | Artefact lié au SHA intégré + déploiement ciblé | À faire après CI/applicatif et recette |
| P11 | P1 | Recette /map et Personnes sur clients/thèmes/parcours | Non réalisée ; moteur capture HTTP500 |
| P12 | P2 | Inventorier puis archiver versions obsolètes | Pas de suppression dans ce cycle |
| P13 | Permanent | Retour d'expérience dans socle + registre adoption | Ajouts documentaires préparés v1.0.0-rc.4 ; maintenance existante inchangée |
| P14 | P1 | Petite archive indispensable dans project-archives privé, chiffrée côté client, clé hors GitHub et relecture vérifiée | Dépôt privé accessible et initialisé ; original préservé, chiffrement/récupération/transfert à établir ; NAS reporté |
| P15 | P1 | Livraison HACS Dashboard, release et rollback | Bundle `0.1.0-rc.1` préparé ; publication et recette HA restantes |


L'amorçage des trois dépôts est prouvé dans `evidence/github-bootstrap-2026-09-06.json`. main contient les README initiaux uniquement ; aucun import complet, CI produit, adoption ou transfert d'archive n'est déduit de ces commits. Les branches ne sont pas protégées et n'imposent aucun check ; HA-BOARD n'a pas de ruleset, et l'offre actuelle refuse cette fonction aux deux dépôts privés.

Étape immédiate du fil de réalisation : terminer la PR corrective au-dessus du commit baseline, obtenir la CI stricte verte, puis intégrer la correction dans la branche d'import avant revue/fusion de PR #1. Il n'y a plus de dépôt à créer. P14 ne réintroduit pas le coffre NAS comme préalable à cet import ; P06 reste une sauvegarde HA exploitable distincte avant toute mise à jour Core. RC.4 est documentaire uniquement, sources applicatives inchangées.
