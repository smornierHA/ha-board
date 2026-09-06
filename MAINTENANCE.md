# Maintenance du socle et des packages

Responsable du référentiel: mainteneur du compte smornierHA; exécution de la revue assistée, décisions tracées dans GitHub. Rythme par défaut: premier lundi du mois, matin Europe/Paris; déclenchement supplémentaire à chaque incident, découverte structurante ou changement de fournisseur/API.

1. Relire version du socle et PROJECT.md des projets suivis; comparer les règles adoptées et les exceptions. Consulter les sources primaires pour les évolutions qui affectent concrètement nos projets.
2. Vérifier liens, versions, compatibilité, politiques de fournisseurs externes, dépendances/outils CI et état des procédures de reprise. Le cas CARTO est un exemple de changement possible sans déploiement local.
3. Dédupliquer avec les suivis déjà actifs Livebox Fork Watch et Suivi Actions Comptes. Consommer leurs conclusions; ne pas lancer de nouveau suivi quotidien sur les mêmes sujets.
4. Classer: correction documentaire, pratique transférable, spécificité locale ou rupture. Créer une proposition documentée avec source datée, raison, impact et projets concernés.
5. Modifier les instructions et prompts ensemble, mettre à jour SOURCES, CHANGELOG, matrice de compatibilité et cas pratiques; régénérer les ZIP/manifeste/empreintes; contrôler les liens internes et l'absence de données réelles.
6. Passer par une PR du référentiel canonique. Versionner le changement: patch rédactionnel; minor ajout compatible; major changement de règle ou migration nécessaire. Les projets gardent une version épinglée et adoptent la nouvelle par PR dédiée, avec leur diff local conservé.
7. Une release de template ne met pas à jour les dépôts dérivés automatiquement. Mettre à jour le registre des versions adoptées et ouvrir une tâche de migration par projet concerné. Ne pas fusionner une règle incompatible automatiquement.
8. Compte rendu: changements utiles, liens, niveau de validation, projets à migrer et action suivante. Signaler une mise à jour des sources projet uniquement si nécessaire : préciser les fichiers à remplacer/ajouter, le motif et la référence qui devient canonique. Une simple reprise, consultation ou revue sans changement n'appelle aucun rappel de remplacement des sources. La maintenance peut consigner une preuve de revue sans changement.

Avant l’import complet du socle dans le dépôt central, travailler à partir du kit courant conservé et préparer sa révision. Les trois README d’amorçage ne contiennent pas les sources complètes. Après import et intégration vérifiés, GitHub devient l’original maintenu et les ZIP des exports de release. Les anciennes copies restent historiques, sans maintenance parallèle.

Critère de clôture d'une maintenance: nouvelle version vérifiée OU preuve de revue sans changement; couverture des profils vérifiée; impacts/écarts enregistrés; prochaine revue fixée. La maintenance du socle ne déclenche aucune mise à jour automatique de HA, de la boutique ou des données.

## Exécution reproductible à partir de la RC

Dans le référentiel central : modifier VERSION, standards/COMMUN.md, profiles/, overlays/, templates/project/, sources.json et SOURCES.md. Ne pas éditer les starters générés. Lancer successivement :

```bash
python3 scripts/generate_starters.py
python3 scripts/validate.py
python3 -m unittest discover -s tests -v
python3 scripts/package.py
```

Ces commandes se lancent dans le référentiel central ; une copie autonome de starter ne contient pas son générateur. Pour un projet déjà créé, proposer un diff du nouveau starter depuis sa version adoptée, sans écraser les adaptations. L’adoption est consignée dans socle-adoption.json côté projet et registry/adoptions.json côté socle après sa fusion.

La création/activation mensuelle est déjà acquise selon AUTOMATION.md ; la maintenance lit cette référence et ne crée pas de nouvelle tâche. Les nouveaux packages incluent un manifeste et les SHA-256. Après intégration GitHub, appliquer docs/DELIVERY.md pour les relier au SHA réellement testé, au tag et aux assets publiés.
