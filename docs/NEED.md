# Besoin et périmètre du POC

Version initiale du dossier : 2026-09-06. Candidat à l'import dans `smornierHA/ha-board`, dépôt non trouvé dans les accès vérifiés. Aucun fichier HA modifié.

La vue Personnes doit conserver une carte native avec historique 24 h, présence et localisation lorsqu'elles sont disponibles, quatre filtres combinables et Tous/aucun. Les couleurs des filtres et trajets correspondent. Les huit cartes Person Rich (quatre compactes, quatre détaillées) conservent Memoji, batteries compactes iOS, couleurs et indicateur de charge, iPad et navigation vers Personnes/more-info.

Le besoin de fraîcheur est distinct du filigrane. Une position ancienne ne doit pas être annoncée comme actuelle. Le fond de carte dépend du frontend HA et doit être corrigé par la version officielle, sans fournisseur imposé dans le wrapper.

Périmètre exclu de cette livraison : OS, NAS, serveur Frigate/E6D, renommage d'entités, autre vue du dashboard, migration Livebox upstream. La carte voisine de suivi d'équipement reste couvert par la recette de non-régression, sans modification de sa configuration.

Critère de fin : source GitHub + révision intégrée validée + artefact identifié + ressource réellement chargée et fonctions vérifiées dans HA. Le présent import n'atteint pas ce critère.
