# Recette et preuve de livraison

Les cases non exécutées ne sont pas validées par la CI documentaire ni par les tests simulés.

| Contrôle | Attendu | Statut au 2026-09-06 |
|---|---|---|
| /map desktop | Fond sans filigrane, attribution native conservée | Capture MCP HTTP 500 ; pas de preuve visuelle |
| Personnes desktop | Carte 4:3, quatre personnes, traces 24 h | Configuration vérifiée seulement |
| Refresh à froid | Aucune erreur configuration/élément absent/rejet async | Baseline locale en échec ; pas de recette HA |
| Navigation aller-retour | Remontage, filtres, more-info | Contrats simulés partiels ; pas de recette HA |
| Mobile / desktop | Aucun chevauchement, filtres tactiles | Non fait sur HA |
| Clair / sombre | Fond, contraste et couleurs lisibles | Non fait sur HA |
| Filtres/Tous/aucun | Sélection et vide persistants | Cas locaux partiels ; pas de recette HA |
| Couleurs | Filtre/trajet correspondants | Configuration/contrat conservés ; rendu non vérifié |
| Memoji | Images existantes chargées | SVG préservé ; 3 URLs HA relevées en privé |
| Batteries/charge | iOS compact, niveau/couleur/charge, iPad et le suivi voisin d’équipement | Code/config préservés ; rendu non vérifié |
| Présence/localisation | Ancien/indisponible et précision distingués | Défauts démontrés, contrat DATA-FRESHNESS |
| Performance | DOM conservé sur hass sans changement utile | Défaut démontré localement ; pas mesure navigateur HA |
| Livebox/Frigate | Pas de régression après Core | Core non mis à jour ; état avant intervention seulement |

Pour chaque livraison consigner : date/fenêtre, dépôt/PR, head/base testés, SHA intégré, checks/URLs, SHA256 artefact, versions Core/frontend, ressource chargée par client, preuve réseau/runtime, résultats par case, erreurs avant/après, limites, sauvegarde privée et retour arrière.

HTTP réussi ≠ recette fonctionnelle ; capture ≠ tous les clics ; tests Node ≠ Web Components natifs HA ni rendu mobile/thème.
