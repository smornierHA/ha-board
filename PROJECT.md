# Projet HA-BOARD

| Champ | Valeur |
|---|---|
| Dépôt vérifié le 6 septembre 2026 | [smornierHA/ha-board](https://github.com/smornierHA/ha-board), accessible avec droits d'administration et d'écriture |
| Visibilité observée | Public ; code, documentation expurgée et exemples fictifs uniquement |
| Branche initialisée | main, README uniquement, SHA `ff9cd91848ad8548be0b5ef6b70add8d45f56669` relu |
| Protections observées | `protected:false` ; checks requis vides ; rulesets vides |
| Conservation privée | project-archives privé ; petite archive familiale à chiffrer côté client, clé hors GitHub ; aucun envoi effectué |
| Coffre NAS | Volume 3 reporté pour les petites archives ; sauvegarde HA réelle distincte toujours requise avant Core |
| Profil | Home Assistant ; complément MCP pour livraison assistée |
| Socle | Exigences HA de RC.6 partiellement adoptées ; RC.7 disponible sur `4c20e6361dbe6320f17c380fff050010ef7a7a40`, sans adoption complète revendiquée |
| Responsable | Propriétaire du dépôt |
| Produit | Cartes frontend locales et configuration Lovelace expurgée |
| Base observée au cycle initial | Core 2026.8.3 ; Person History 1.4.0 ; Person Rich 3.4.3 |
| Cible officielle MAP | Core 2026.9.1 ; préconditions non toutes levées |
| Données exclues du dépôt public | Noms/entités domestiques, positions, historiques, images réelles, sauvegardes, secrets |
| Livraison | Bundle immuable + SHA/empreinte, ressources ciblées, recette HA |

Preuve d'amorçage : `evidence/github-bootstrap-2026-09-06.json`. Le socle est dans project-playbook privé ; project-archives est également privé. Leur accès ne prouve ni l'import des préparatifs ni la disponibilité d'une sauvegarde.

Une version de socle disponible ou préparée n'est pas adoptée tant que son diff projet n'est pas intégré. La révision RC.4 reste historique et n’est pas réimportée. La maintenance mensuelle existante n'est pas dupliquée.

## Cycle pilote météo #12

Le 9 septembre, le dépôt public est relu via GitHub avec droits push/admin ; la préparation reste sur branche dédiée. Sources privées météo et configuration ciblée conservées hors Git ; seules les références expurgées et données fictives sont admises ici. Le profil HA et la coordination RC.8 ont été relus et appliqués aux parties concernées, sans adoption complète. Candidate de package 0.2.0-rc.1 préparée, Personnes 0.1.2-rc.1 inchangé ; statut et limites dans STATUS et WEATHER-PROVENANCE.
