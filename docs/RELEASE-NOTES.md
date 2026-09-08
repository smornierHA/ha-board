# HA-BOARD 0.1.1-rc.1

Candidat de recette, pas une version stable.

- Affiche la zone HA nommée, sinon une ville structurée ou extraite prudemment, dans Person Rich compact et détail.
- Ne transforme plus la durée hors domicile en temps passé dans la ville affichée.
- Allège « Dernière position connue » : zone/ville et adresse en principal ; coordonnées, précision, sources et dates distinctes dans un détail accessible.
- Sépare les adresses explicitement anciennes ou incohérentes au lieu de les fusionner avec la position.
- Ajoute les options visuelles de date propre et de seuil d’ancienneté de l’adresse géocodée, sépare une adresse antérieure à l’entrée dans la zone et rejette les libellés techniques comme « Hors zone ».
- Conserve les types YAML, originaux, historique natif, filtres, couleurs, Memoji, batteries iOS, charge et navigation.

L’adresse des points historiques n’est pas incluse : le frontend ciblé n’expose pas de point d’extension public pour enrichir ces bulles. Un adaptateur borné, dédupliqué et annulable est testé séparément sur données fictives, sans appel réseau. La recette HA mobile/desktop, thèmes, détail, sauvegarde/réouverture des éditeurs et mise à jour/retour arrière reste à prouver. Aucun update Core, OS, NAS, Livebox ou serveur Frigate n’est inclus.
