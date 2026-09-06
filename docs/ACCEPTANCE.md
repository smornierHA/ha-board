# Recette et preuve de livraison

Les cases non exécutées ne sont pas validées par la CI documentaire ni par les tests simulés.

| Contrôle | Attendu | Statut au 2026-09-06 |
|---|---|---|
| /map desktop | Fond sans filigrane, attribution native conservée | Capture MCP HTTP 500 ; pas de preuve visuelle |
| Personnes desktop | Carte 4:3, quatre personnes, traces 24 h | Configuration vérifiée seulement |
| Refresh à froid | Aucune erreur configuration/élément absent/rejet async | Contrats candidat locaux verts ; pas encore vérifié dans HA |
| Navigation aller-retour | Remontage, filtres, more-info | Contrats locaux navigation/more-info conservés ; recette HA non faite |
| Mobile / desktop | Aucun chevauchement, filtres tactiles | Non fait sur HA |
| Clair / sombre | Fond, contraste et couleurs lisibles | Non fait sur HA |
| Filtres/Tous/aucun | Sélection et vide persistants | Contrats candidat verts ; `storage_key` explicite requis pour persistance inter-rechargement |
| Couleurs | Filtre/trajet correspondants | Configuration/contrat conservés ; rendu non vérifié |
| Memoji | Images existantes chargées | SVG préservé ; 3 URLs HA relevées en privé |
| Batteries/charge | iOS compact, niveau/couleur/charge, iPad et le suivi voisin d’équipement | Code/config préservés ; rendu non vérifié |
| Présence/localisation | Ancien/indisponible et précision distingués | 21/21 contrats locaux : unavailable, coordonnées invalides, précision, fraîcheur inconnue/ancienne/future ; recette HA restante |
| Performance | DOM conservé sur hass sans changement utile | Contrat local vert sur mise à jour non pertinente ; pas de mesure navigateur HA |
| Livebox/Frigate | Pas de régression après Core | Core non mis à jour ; état avant intervention seulement |

Pour chaque livraison consigner : date/fenêtre, dépôt/PR, head/base testés, SHA intégré, checks/URLs, SHA256 artefact, versions Core/frontend, ressource chargée par client, preuve réseau/runtime, résultats par case, erreurs avant/après, limites, sauvegarde privée et retour arrière.

HTTP réussi ≠ recette fonctionnelle ; capture ≠ tous les clics ; tests Node ≠ Web Components natifs HA ni rendu mobile/thème.

## Retour utilisateur et reprise RC.2

La recette de RC.1 est **en échec** : chargement intermittent de la carte et éditeur absent. Les captures familiales restent privées. RC.2 doit vérifier, en plus des parcours ci-dessus :

- ouverture directe de Personnes dans un nouvel onglet, avant toute visite de `/map` ; plusieurs refresh à froid, attente native et bouton Réessayer après panne simulée ; navigation aller-retour ;
- éditeur visuel des deux cartes : ajouter/modifier/supprimer/réordonner une personne, couleur, mode compact/détail et capteurs optionnels ; sauvegarder puis rouvrir ; vérifier que les clés YAML existantes non éditées sont conservées ;
- catalogue et titres sans version ; bouton GitHub ouvre la bonne fiche HACS ;
- présence à domicile avec coordonnées et précision disponibles, adresse séparée, absence de date de mesure, valeur ancienne/future/indisponible ; ne jamais déduire l’âge du GPS de la durée de présence ou des informations de trajet ;
- téléchargement de la prérelease puis retour à la révision précédente dans HACS, bundle relu par SHA256 et une seule ressource active.

Le harnais ajoute sept contrats aux 21 existants et exécute les 28 sur le bundle distribué. Il ne reproduit pas le rendu Lit/HA, les tuiles ou un smartphone réel.
