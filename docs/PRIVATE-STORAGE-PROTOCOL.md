# Conservation nécessaire des projets

Décision du 6 septembre 2026, RC.4. Pour les petites archives indispensables et non reproductibles, destination : **smornierHA/project-archives, privé**. Ce dépôt existe et son README est initialisé sur main ; aucune archive n’y a encore été déposée. Les trois dépôts et leurs révisions sont consignés dans evidence/github-bootstrap-2026-09-06.json du kit central et du POC.

## Choix de conservation

| Contenu | Destination |
|---|---|
| Code, documents et exemples fictifs | Dépôt du projet ; pas de ZIP dupliqué à chaque réponse |
| Packages destinés à distribution | Release liée au commit validé, lorsque ce canal est disponible |
| Petit original indispensable, preuve non reproductible ou retour arrière ciblé | project-archives privé, avec motif de conservation et manifeste |
| Archive familiale réelle du POC | Chiffrement côté client avant GitHub, clé privée hors GitHub |
| Secrets, sauvegardes HA complètes, Recorder, bases, médias et archives fréquentes | Stockage dédié ; reprise et clés vérifiées séparément |

Une archive nécessaire n’est pas créée par habitude : expliquer ce qui serait perdu ou impossible à reproduire depuis Git. Les originaux JS publiables du POC sont versionnés sans modification dans ha-board ; les configurations domestiques et images réelles restent dans l’enveloppe privée chiffrée. Ne pas versionner de données personnelles ou secrets en clair, même dans un dépôt privé. Base64 n’est pas un chiffrement.

## Parcours d’une petite archive

1. Conserver les octets originaux hors Git, leur provenance et leur SHA256. Choisir un identifiant de capture sans donnée personnelle.
2. Établir un destinataire de chiffrement récupérable. Réutiliser une clé publique connue si disponible ; sinon fournir une procédure PowerShell locale pour la créer et conserver sa partie privée hors GitHub et du chat. Ne jamais inventer une conservation de clé.
3. Chiffrer côté client et vérifier localement le déchiffrement ainsi que l’empreinte de l’original. Si une intervention utilisateur est indispensable, la limiter à la clé locale et au contrôle de récupération, avec commande et résultat attendus.
4. Déposer uniquement le chiffré et son manifeste expurgé dans `<domaine>/<projet>/<catégorie>/AAAA/MM/JJ/<capture>/`. Pour le POC : `home-assistant/ha-board/originaux/2026/09/06/<capture>/`. Ne pas écraser une capture existante. Le manifeste donne motif, provenance non sensible, taille/SHA256 du chiffré, méthode et identifiant public de destinataire ; les détails privés restent chiffrés.
5. Relire les octets distants, vérifier taille et SHA256, consigner le commit et la récupération indépendante vérifiée. Un succès de création de fichier ou une empreinte locale seule ne prouve pas la copie récupérable.

Sans destinataire ou clé récupérable établi, conserver l’original et préparer le transfert, sans dépôt en clair. Continuer les imports de code indépendants. Les capacités de téléversement binaire ou de release doivent être constatées avant de choisir l’outil ; un outil d’écriture texte ne transporte pas un ZIP arbitraire.

## État et limites

Le dépôt archives est privé mais main n’est pas protégé ; l’API rulesets renvoie 403 en demandant GitHub Pro. Conserver la visibilité privée. Branche dédiée, PR, revue et vérification de la révision intégrée sont une discipline compensatoire, pas un verrou technique. Avant chaque transfert dépendant de cet état, relire accès, visibilité et branche.

La configuration du coffre Volume 3 est **reportée pour ces petites archives**. Le script NAS précédent n’est pas à relancer pour débloquer HA-BOARD. La procédure NAS complète reste disponible dans `project-playbook/docs/PRIVATE-STORAGE-NAS.md` du kit central, pour un besoin ultérieur justifié ; aucun stockage ou montage NAS n’est prétendu établi.

L’archive POC ciblée ne remplace jamais la sauvegarde HA courante avec Recorder, clé hors instance et accès de récupération indépendant avant une mise à jour Core. Une copie GitHub unique ne suffit pas à démontrer une restauration HA.
