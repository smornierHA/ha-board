# Compatibilité — relevé du 6 septembre 2026

| Élément | Observé | Cible / preuve manquante |
|---|---|---|
| Core | 2026.8.3, config valide | 2026.9.1 proposé ; pas encore installé |
| Frontend cartographique | Natifs /map et type:map, diagnostic CARTO acquis | Correctif officiel livré avec 2026.9.1 ; recette visuelle restante |
| Person History | Ressource v1.4.0, classe/tag v14, 6 877 octets | Contrats baseline 12 défauts totaux avec Rich ; correctifs non faits |
| Person Rich | Ressource v3.4.3, classe/tag v34, 13 553 octets | Même couverture limitée |
| Livebox | Fork officiel autorisé 2.5.7 ; témoin identique head f5554bb | Branche livrée : CI KO avant pytest ; PR #1 : tests HA2026.9.1 exécutés localement, 7 échecs ; compatibilité non validée |
| Frigate intégration HA | Officielle 5.15.6 chargée | Déjà mise à jour, ne pas rejouer |
| Frigate serveur | 0.17.2, E6D candidat déployé selon référence R2.6 | Aucun changement dans ce POC |
| Sauvegarde | Archives chiffrées locales antérieures aux dernières interventions | Backup courant avec Recorder, clé et reprise hors Core à établir |
| Tests locaux | Node vm simulé, sans dépendance DOM/navigateur HA | N'atteste pas les Web Components réels ni le rendu |
