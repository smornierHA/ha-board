# Prompt de continuation — RC.4

Destination : autre fil de mise en œuvre du projet HA-BOARD, mode Work. Modèle/niveau conseillé : GPT-6 Astra, High. Joindre le rapport et le kit RC.4.

Reprends la mise en œuvre du socle 1.0.0-rc.4 et du POC HA-BOARD depuis le kit et le rapport joints. Lis AGENTS.md, README, GOVERNANCE, MAINTENANCE, SOURCES, les manifestes, roadmaps et PRIVATE-STORAGE. Rafraîchis uniquement les états dont dépend la prochaine intervention.

Les dépôts smornierHA/project-playbook (privé), smornierHA/ha-board (public) et smornierHA/project-archives (privé) existent, sont accessibles en écriture et ont un README sur main. Ne les recrée pas. Les SHA d’amorçage sont dans evidence/github-bootstrap-2026-09-06.json. L’import complet reste à faire : relis les main actuels, importe le socle et le POC séparément sur branches et ouvre leurs PR après revue de confidentialité. Préserve les originaux publiables et leurs empreintes avant correction ; utilise des exemples fictifs.

Aucun main n’est protégé ; ha-board n’a aucun ruleset et les rulesets privés sont indisponibles avec l’offre actuelle. Consigne cette limite, applique PR/revue/checks et vérifie le commit effectivement intégré. Ne présente pas la CI documentaire comme une validation applicative.

Archive uniquement les originaux indispensables : petite archive familiale chiffrée côté client dans project-archives privé, clé hors GitHub, relecture et récupération vérifiées. Si le destinataire de chiffrement manque, prépare la procédure PowerShell locale et poursuis les imports indépendants. Ne relance pas le script NAS pour cette archive ; elle ne remplace pas la sauvegarde HA exploitable avec Recorder et récupération indépendante.

Avant d’intervenir, relis l’état de la PR Livebox #1 existante et du chantier Frigate. Livebox : exclusivement smornierHA/hass-livebox-component, branche livebox-l2.17c, aucun écrasement upstream. L’intégration Frigate 5.15.6 était déjà chargée ; ne confonds pas intégration et serveur/E6D. Le correctif officiel HA exige compatibilité et sauvegarde courante vérifiées. N’y associe aucune mise à jour OS, NAS ou serveur Frigate.

Corrige les défauts démontrés du POC en préservant historique, présence, filtres individuels/multiples/Tous/aucun, couleurs, Memoji, batteries iOS et charge. Qualifie fraîcheur, indisponibilité et précision des positions. Exécute les tests puis la recette /map et Personnes : refresh, navigation, mobile/desktop, thèmes et fonctions familiales. Consigne commit, artefact, version réellement chargée, résultats, limites et retour arrière.

Avance jusqu’aux étapes accessibles. Termine par le résultat prouvé, la prochaine étape côté assistant et l’action utilisateur immédiate exacte, avec lieu, fichier ou commande et résultat attendu. Fournis du PowerShell pour les manipulations Windows et tout prompt de continuation dans la réponse avec destination et niveau. Ne duplique pas la maintenance mensuelle existante.
