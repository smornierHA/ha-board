# Compatibilité — relevé du 6 septembre 2026

| Élément | Observé | Cible / preuve manquante |
|---|---|---|
| Core | 2026.8.3, config valide | 2026.9.1 proposé ; pas encore installé |
| Frontend cartographique | Natifs /map et type:map, diagnostic CARTO acquis | Correctif officiel livré avec 2026.9.1 ; recette visuelle restante |
| Person History | Distribution `v0.1.0-rc.2`, composant 1.4.2 | Inchangé dans #8 ; API native des bulles sans adresse |
| Person Rich | Distribution `v0.1.0-rc.2`, composant 3.4.5 | Candidat 3.4.6 : U1/U2 simulés ; non chargé dans HA |
| Livebox | Fork officiel autorisé 2.5.7 ; témoin identique head f5554bb | Branche livrée : CI KO avant pytest ; PR #1 : tests HA2026.9.1 exécutés localement, 7 échecs ; compatibilité non validée |
| Frigate intégration HA | Officielle 5.15.6 chargée | Déjà mise à jour, ne pas rejouer |
| Frigate serveur | 0.17.2, E6D candidat déployé selon référence R2.6 | Aucun changement dans ce POC |
| Sauvegarde | Archives chiffrées locales antérieures aux dernières interventions | Backup courant avec Recorder, clé et reprise hors Core à établir |
| Tests locaux | Base RC.2 : 28/28 ; candidat #8 : 39/39 cartes + 3/3 adaptateur dans Node | N'atteste pas les Web Components réels ni le rendu ; recette HA nécessaire |

RC.2 : API `getConfigForm`, sélecteur objet avec champs/liste et chargement différé `hui-map-card` vérifiés dans les sources frontend `20260729.7`, correspondant à Core 2026.8.3 encore observé. #8 vérifie aussi que le flux historique conserve des attributs mais que `hui-map-card` transmet seulement point/instant à `ha-map`, dont la bulle n’accepte aucun formateur public. Aucun besoin de mise à jour Core pour U1/U2. La recette réelle reste nécessaire pour le rendu des formulaires, les détails, les ressources et les thèmes.
