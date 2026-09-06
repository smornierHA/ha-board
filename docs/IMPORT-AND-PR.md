# Import initial et PR de correction

## Amorçage vérifié le 6 septembre 2026

Les trois dépôts créés par l'utilisateur sont accessibles avec droits d'administration et d'écriture. Leur branche main a été initialisée avec un README uniquement, puis chaque SHA a été relu :

| Dépôt | Visibilité | Commit main initial |
|---|---|---|
| [project-playbook](https://github.com/smornierHA/project-playbook) | Privé | `55a06a66dd0a4f058bee21dbda331e13f91a4a04` |
| [ha-board](https://github.com/smornierHA/ha-board) | Public | `ff9cd91848ad8548be0b5ef6b70add8d45f56669` |
| [project-archives](https://github.com/smornierHA/project-archives) | Privé | `bce2c851355af670eb5e5aa62b41e1c5c4267684` |

Preuve : `evidence/github-bootstrap-2026-09-06.json`. Il n'y a plus de dépôt à créer ni de README initial à ajouter. Cet amorçage ne constitue pas l'import complet des préparatifs, une CI distante ou une adoption du socle.

Les trois branches présentent `protected:false` et des checks requis vides. HA-BOARD ne présente aucun ruleset. Les deux dépôts privés retournent HTTP 403 pour les rulesets avec le message « Upgrade to GitHub Pro or make this repository public to enable this feature. » : cette fonction est indisponible pour ces dépôts avec l'offre actuelle. Conserver leur visibilité privée. Aucune protection n'est prétendue active ; la gestion des protections n'est pas exposée par le connecteur actuel.

## Prochaine étape : importer par branche et PR

1. Relire les métadonnées et main juste avant l'import ; comparer au SHA initial ci-dessus pour détecter toute évolution. Lire AGENTS.md, état et roadmap. Ne pas écraser un contenu ajouté dans un autre fil.
2. Créer `chore/import-geolocation-poc` depuis le SHA exact de main. Importer l'arbre préparé par un commit cohérent, après revue de confidentialité, puis ouvrir une PR draft. Le socle est importé séparément dans project-playbook privé.
3. Seuls le code relu, les exemples fictifs, les scripts et les documents expurgés sont publiables dans HA-BOARD. L'archive réelle et les Memoji ne vont jamais dans ce dépôt public. Leur conservation ponctuelle suit docs/PRIVATE-STORAGE.md : project-archives privé, chiffrement côté client avant dépôt et clé hors GitHub. Recalculer les empreintes source ; conserver les originaux même si la correction suit.
4. La PR initiale peut versionner les défauts connus avec un rapport de diagnostic explicite. Aucun résultat documentaire ou de diagnostic vert n'autorise une livraison : le gate de livraison applicatif exécute le mode strict, qui échoue sur les défauts connus.
5. Après versionnement GitHub, créer une branche dédiée de fiabilisation ; corriger les défauts prouvés un par un et faire passer leurs tests. Conserver les classes/tags de composant existants sauf migration versionnée justifiée.
6. À la mise en revue : test strict, syntaxe, scan de confidentialité, contrôle documentaire et recette locale pertinente. Pas de double pipeline lourd push + PR. Les chemins de code, tests, dépendances et workflow déterminent le niveau de contrôle.
7. Vérifier de nouveau les protections utiles avant fusion. Documenter les limites réellement présentes et les contrôles compensatoires ; le circuit PR et le gate de publication ne remplacent pas une protection de branche imposée par GitHub.
8. Valider la combinaison avec main à jour. Après fusion, relancer les contrôles applicatifs sur le SHA intégré exact avant de construire le bundle de livraison ; ne pas réutiliser le succès du seul head de PR. Consigner séparément les résultats de cohérence documentaire et les résultats applicatifs.
9. Publier un artefact immuable lié au SHA et à SHA256. Déployer cet artefact ciblé selon RUNBOOK, puis remplir STATUS et la recette avec les versions réellement chargées.

RC.4 ajuste les documents et prépare cette reprise ; aucune source produit n'a été modifiée. Aucune nouvelle création GitHub ni configuration NAS n'est demandée pour commencer l'import. La sauvegarde HA exploitable exigée avant une mise à jour Core reste un prérequis indépendant.
