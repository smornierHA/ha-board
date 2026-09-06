# Préférences de travail — 6 septembre 2026

Ces préférences proviennent des instructions de l'utilisateur dans le chantier HA-BOARD. Elles sont conservées dans le socle et reprises dans les instructions et prompts générés. Leur présence dans un fichier ne prétend pas modifier une mémoire globale de l'outil.

| Sujet | Règle à appliquer |
|---|---|
| Actualisation des sources | Informer uniquement lorsqu'un changement est nécessaire ; nommer le fichier à ajouter/remplacer, le motif et la version. Pas de rappel si les sources restent suffisantes. |
| Création GitHub | Réutiliser un dépôt pertinent. Si une création est nécessaire, préparer un lien prérempli avec propriétaire, nom et visibilité. Si l'outil ne peut pas créer, présenter l'opération de création avec ce lien et la case « Add README » à cocher. |
| Visibilité | project-playbook et project-archives privés. Code HA et exemples fictifs publics après expurgation. Pour les autres projets, évaluer et consigner la décision au cas par cas à chaque démarrage. Une reprise ne déclenche pas automatiquement un changement de visibilité du dépôt existant. |
| Continuation | Fournir le prompt complet dans la réponse et dans son fichier, avec destination et modèle/niveau conseillés. Pour une reprise complète : ChatGPT Work, dans le projet concerné, GPT-6 Astra, High. Exemple propre à la géolocalisation : projet HA-BOARD. Ce niveau est un conseil pour le travail demandé, pas une obligation ni une sélection automatique de Max. |
| Manipulations techniques Windows | Fournir systématiquement un script PowerShell téléchargeable et la commande prête à copier pour réduire les erreurs manuelles. Compatibilité Windows PowerShell 5.1, contrôles, arrêt sur erreur, secrets masqués et reprise sûre ; étapes UI seulement si indispensables et expliquées. |
| Conservation privée | Archiver uniquement pour préserver un original, permettre un retour arrière ou conserver une preuve non reproductible. Pour les petites archives indispensables, utiliser project-archives privé ; chiffrer côté client l'archive familiale et conserver la clé hors GitHub. NAS Volume 3 reporté pour ces petits fichiers ; sauvegarde HA exploitable toujours distincte et requise avant mise à jour Core. |
| Clôture et prochaines étapes | Terminer les réponses de travail par l'état fait et sa preuve, la prochaine action de l'assistant et l'action utilisateur précise. Une seule action utilisateur immédiate lorsque possible : où, fichier ou commande, résultat attendu. Ne pas terminer par un « GO » vague, redemander une action déjà faite ou laisser croire à une poursuite en arrière-plan. Dire qu'il n'y a rien à faire seulement lorsque c'est exact. |

## Dépôts vérifiés

Les métadonnées GitHub ont été vérifiées le 6 septembre 2026 :

| Dépôt | Visibilité observée | Droits du connecteur observés |
|---|---|---|
| [project-playbook](https://github.com/smornierHA/project-playbook) | Privé | Administration et écriture |
| [ha-board](https://github.com/smornierHA/ha-board) | Public | Administration et écriture |
| [project-archives](https://github.com/smornierHA/project-archives) | Privé | Administration et écriture |

La création de ces trois dépôts n'est plus une action attendue de l'utilisateur. Les trois README ont ensuite été initialisés et main relu au SHA exact : preuve dans evidence/github-bootstrap-2026-09-06.json du kit central et du POC. L’import complet, les CI et l’adoption restent à faire ; ces main ne sont pas protégés. Ne pas demander de nouvel amorçage à l’utilisateur.

## Conservation proportionnée

| Contenu | Destination et condition |
|---|---|
| Code, documents, exemples fictifs | Dépôt du projet |
| Packages à distribuer | Releases du dépôt, lorsque le canal est disponible |
| Petite archive indispensable et non reproductible | project-archives privé, classement par domaine, projet, catégorie et capture datée |
| Archive réelle du POC familial | Chiffrement côté client avant dépôt dans project-archives ; clé hors GitHub et contrôle de déchiffrement |
| Sauvegarde HA complète, base, médias, archives fréquentes | Stockage de sauvegarde dédié ; restauration exploitable à vérifier séparément |

Le stockage privé des petites archives suit `<domaine>/<projet>/<catégorie>/AAAA/MM/JJ/<capture>/`. Les catégories peuvent être `originaux`, `configurations`, `assets` ou `preuves`. Un manifeste expurgé donne le motif de conservation, la provenance utile, la taille et le SHA-256 de l'archive chiffrée ; les détails privés et empreintes des fichiers originaux restent dans l'enveloppe chiffrée. Ne pas créer de ZIP par habitude à chaque réponse, ni dupliquer ce qui est déjà reproductible depuis une révision et ses instructions de génération.

Le coffre `/volume3/project-vault/` est reporté pour ces petits fichiers et ne bloque plus le versionnement HA-BOARD. Il reste une option de stockage dédié à établir pour les autres usages selon leur besoin. Aucune copie NAS n'est revendiquée. La sauvegarde HA exploitable exigée avant une mise à jour Core reste nécessaire, avec un moyen de déchiffrement conservé hors de l'instance ; une archive sur GitHub ne la remplace pas.

Effectuer soi-même les copies autorisées quand le canal est disponible. Vérifier les octets stockés par relecture et l'empreinte attendue, distinguer préparation, chiffrement, copie et vérification. Pour les archives chiffrées, vérifier séparément le déchiffrement et la récupération de la clé. Sans clé récupérable établie, préparer le transfert sans publier l'archive ; ne pas supprimer la source. Les mots de passe et clés ne figurent jamais dans GitHub, les prompts ou les rapports.

## Format de clôture

La fin d'une réponse de travail rend explicite ce qui suit :

- **Fait** : résultat concret et niveau de preuve.
- **Suite côté assistant** : prochaine étape et condition de reprise, sans promettre une exécution après la fin du tour.
- **À faire maintenant** : une action utilisateur immédiate lorsque possible, sa destination exacte, le fichier ou la commande et le résultat attendu. Si aucune action n'est requise, l'indiquer explicitement et seulement si c'est vrai.

Ne pas demander de recréer un dépôt déjà vérifié, de relancer une mise à jour déjà effectuée ou de télécharger de nouveau un fichier inchangé. Les étapes ultérieures sont distinguées de l'action immédiate. Un prompt de continuation doit reprendre les faits acquis et la prochaine étape accessible.

## Maintenance de ces règles

Les sources canoniques sont `standards/COMMUN.md`, `profiles/` et `templates/project/`. Toute évolution est reportée dans les instructions, le contrat et les prompts, puis les starters et packages sont régénérés. Les projets existants adoptent le diff explicitement ; le dépôt central reste privé et ne transforme pas leur visibilité. La maintenance mensuelle existante n'est pas dupliquée.
