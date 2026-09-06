# État vérifiable — 6 septembre 2026

| Étape | État | Preuve |
|---|---|---|
| Sources de départ lues, archive extraite | Terminé | analyse-map-socle et candidate-original ; MANIFEST/SHA256 contrôlés |
| Collecte POC | Terminé | source-manifest.json : 6 877 et 13 553 octets, SHA256 ; 8 cartes, 42 ressources, vue Personnes |
| Import expurgé préparé | Terminé localement | src/ identique ; examples/ fictifs ; images réelles hors Git |
| Tests baseline | Exécutés localement, en échec | evidence/baseline-report.json : 7 passent / 12 échouent / 0 erreur harnais |
| GitHub : accès et amorçage | Terminé pour les trois dépôts | evidence/github-bootstrap-2026-09-06.json ; main README uniquement, SHAs relus |
| Import complet / PR / CI produit / fusion / release | Non effectués | Préparatifs locaux à importer sur branche ; aucun succès distant inventé |
| Protections GitHub | Absentes au contrôle | protected:false et checks requis vides ; HA-BOARD rulesets vides ; privés rulesets HTTP 403 lié à l’offre |
| Archive privée du POC | Original conservé, non envoyé sur GitHub | 19 964 octets ; SHA256 dans docs/PRIVATE-STORAGE.md ; chiffrement et récupération de clé hors GitHub à établir |
| Correctifs cartes | Non appliqués | GitHub avant modification produit ; originaux inchangés |
| Frigate HA | 5.15.6 déjà chargé | Référence Frigate R2.6 + préconditions actuelles ; ne pas rejouer |
| Livebox | Fork 2.5.7 chargé | Témoin identique au head f5554bb ; PR #1 (196564b) répare le harness : 77/84 tests locaux, 7 échecs et couverture insuffisante |
| Core MAP | 2026.8.3 ; 2026.9.1 non installé ici | Compatibilité Livebox cible et reprise indépendante non prouvées |
| Recette production | Non réalisée | Capture /map HTTP500 ; aucune recette visuelle mobile/thèmes |

Les observations pré-déploiement ne prouvent pas une livraison. Le code d'origine est conservé intact et la baseline rouge est intentionnellement exposée, sans masquer ses échecs.

CI Livebox réellement exécutée dans le même cycle : run 34027960512, révision de combinaison 11554c1d6daea15fd95ff2819fbf9de0c5793a93, 77 tests réussis/7 échecs, couverture 56,78%/85. HACS/Hassfest/statique et assertion des versions réussis ; pytest et lint restent en échec. PR #1 en brouillon, ni fusion ni déploiement. Preuve : evidence/livebox-ci-2026-09-06.json.

RC.2 historique, remplacée pour la conservation par RC.4 : HA-BOARD public avec données privées hors Git, socle privé, notifications de sources uniquement si nécessaires et prompt copiable avec destination/niveau. Canal de sauvegarde Volume 3 non accessible : procédure prête, aucune écriture NAS. Les résultats produit ci-dessus restent ceux du cycle initial ; ils ne sont pas requalifiés par les contrôles documentaires RC.2.

RC.3 historique : préférence PowerShell ajoutée et assistant de configuration du coffre préparé. Cette voie NAS est désormais reportée pour les petites archives ; ne pas demander de la relancer. Aucune copie NAS ni nouvelle preuve applicative n’est revendiquée.


RC.4 : le 6 septembre 2026, project-playbook privé, ha-board public et project-archives privé sont accessibles avec droits d'administration et d'écriture. Leurs branches main contiennent uniquement les README initiaux, aux SHA relus `55a06a66dd0a4f058bee21dbda331e13f91a4a04`, `ff9cd91848ad8548be0b5ef6b70add8d45f56669` et `bce2c851355af670eb5e5aa62b41e1c5c4267684`. La création n'est plus une action utilisateur attendue. Les protections disponibles sont consignées dans la preuve d'amorçage ; l'initialisation ne prouve aucune CI produit ni adoption.

La conservation des petites archives indispensables passe par project-archives privé, après chiffrement côté client de l'archive familiale et conservation de la clé hors GitHub. L'archive originale reste identique ; aucune enveloppe chiffrée n'a été envoyée. La sauvegarde HA exploitable reste distincte et exigée avant Core. RC.4 modifie uniquement les documents : les sources app et résultats applicatifs du cycle initial ne sont pas requalifiés.

Prochaine étape côté assistant dans le fil de réalisation : importer les préparatifs expurgés sur branches et PR depuis les main vérifiées, puis poursuivre les contrôles et corrections accessibles. Aucune création GitHub ni configuration NAS n'est nécessaire pour cet import.
