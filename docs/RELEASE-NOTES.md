# HA-BOARD 0.1.0-rc.2

Candidat de recette, pas une version stable.

- Corrige le chargement à froid du composant map natif : attente de définition, délai borné, annulation et Réessayer.
- Ajoute l’éditeur visuel natif aux deux cartes, les liens de documentation et les noms sans version.
- Sépare présence HA, coordonnées/précision du tracker et adresse géocodée. La fraîcheur inconnue reste explicitement inconnue.
- Documente toutes les cartes et fournit le bouton d’ouverture HACS depuis GitHub.
- Conserve les types YAML, originaux, filtres, couleurs, Memoji, batteries iOS, charge et navigation.

28 contrats simulés passent sur les sources et sur le bundle ; recette HA mobile/desktop, thèmes, sauvegarde/réouverture des éditeurs et mise à jour/retour arrière restent à prouver. Aucun update Core, OS, NAS, Livebox ou serveur Frigate n’est inclus.
