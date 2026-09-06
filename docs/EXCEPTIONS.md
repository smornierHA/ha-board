# Exceptions et blocages

| ID | Nature et état | Responsable | Compensation / prochaine étape | Révision |
|---|---|---|---|---|
| B01 | Résolu : les trois dépôts sont accessibles et main contient un README initial vérifié | Propriétaire | Import complet à réaliser sur branches et PR ; ne pas redemander leur création | Preuve du 6 septembre 2026 |
| B02 | Protections absentes : `protected:false`, checks requis vides ; HA-BOARD rulesets vides ; rulesets privés HTTP 403 lié à l'offre | Propriétaire | Circuit PR, revue du diff et validation du SHA intégré ; recontrôler avant fusion. Ces contrôles ne sont pas une protection imposée par GitHub | Avant fusion |
| B03 | Capture /map HTTP500 | Exploitation HA | Recette manuelle ou réparation distincte du moteur ; ne pas inventer de preuve visuelle | Avant validation production |
| B04 | Trois Memoji en stockage image HA non exportés par capacités présentes | Exploitation HA | Références privées préservées, vérifier couverture sauvegarde HA | Avant livraison |
| B05 | Compatibilité Livebox cible et reprise Core non prouvées | Propriétaire | Aucun update Core ; travaux hors production poursuivis | Avant intervention |
| B06 | Archive privée préparée ; chiffrement, récupération de clé et transfert GitHub non établis | Propriétaire | Préserver le ZIP original ; établir la clé hors GitHub, vérifier chiffrement/déchiffrement puis transfert selon PRIVATE-STORAGE. NAS reporté pour ces petits fichiers | Avant envoi de l'archive |

Les contrôles GitHub du 6 septembre sont consignés dans `evidence/github-bootstrap-2026-09-06.json`. L'offre actuelle refuse les rulesets sur les dépôts privés ; cela n'autorise pas à rendre project-playbook ou project-archives publics. Le connecteur n'expose pas la mutation des protections.

Aucune exception n'autorise de publier les données familiales en clair, contourner une protection, écraser Livebox par l'upstream ou déployer une baseline rouge. L'archive chiffrée dans le dépôt privé autorisé suit le protocole de conservation ; elle ne remplace pas la sauvegarde HA requise avant Core. Les blocages ne sont pas des étapes terminées.
