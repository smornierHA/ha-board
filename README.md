# HA-BOARD — premier POC du socle projets

Le dépôt public [smornierHA/ha-board](https://github.com/smornierHA/ha-board) est accessible. Sa branche `main` a été initialisée avec un README uniquement, au commit `ff9cd91848ad8548be0b5ef6b70add8d45f56669`, puis relue. L'import complet préparé localement reste à effectuer sur branche et PR. Aucune CI produit distante, adoption du socle ou livraison produit n'est revendiquée. Preuve : `evidence/github-bootstrap-2026-09-06.json`.

Commencer par AGENTS.md, PROJECT.md, docs/STATUS.md, docs/ROADMAP.md puis docs/IMPORT-AND-PR.md. La référence acquise de l'incident CARTO n'est pas réauditée.

src/ conserve les deux ressources HA actives sans modification ; source-manifest.json conserve leurs SHA256. examples/ contient des configurations fictives qui ne doivent jamais remplacer la configuration familiale réelle. Les assets familiaux et sauvegardes restent hors du dépôt public ; trois images HA ne sont pour l'instant que référencées, pas téléchargées.

Les tests de baseline distinguent fonctions qui passent et défauts observés. Ils échouent tant que ces défauts persistent. La CI documentaire du starter contrôle uniquement les documents. Le correctif officiel Core et la future correction des cartes ont deux circuits de livraison séparés.

La révision documentaire RC.4 prépare l'adoption du socle `1.0.0-rc.4`, sans changement des sources applicatives. Les préférences sont reprises dans AGENTS.md et docs/USER-PREFERENCES.md. Les petites archives indispensables vont dans project-archives privé, après chiffrement côté client de l'archive familiale et conservation de la clé hors GitHub. Aucune archive chiffrée n'y a encore été envoyée. Le coffre NAS Volume 3 est reporté pour ces fichiers ; la sauvegarde HA exploitable exigée avant Core reste distincte. Voir docs/PRIVATE-STORAGE.md.

Sur `main`, `protected:false`, aucun check requis et aucun ruleset HA-BOARD ont été observés. L'import par PR et la vérification de la révision intégrée restent obligatoires dans le circuit de livraison ; ces règles de travail ne prétendent pas être imposées par GitHub.
