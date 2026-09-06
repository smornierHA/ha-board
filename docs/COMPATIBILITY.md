# Compatibilité — relevé du 6 septembre 2026

| Élément | Observé | Cible / preuve manquante |
|---|---|---|
| Core | 2026.8.3, config valide | 2026.9.1 proposé ; pas encore installé |
| Frontend cartographique | Natifs /map et type:map, diagnostic CARTO acquis | Correctif officiel livré avec 2026.9.1 ; recette visuelle restante |
| Person History | Ressource chargée v1.4.0, classe/tag v14, 6 877 octets | Candidat 1.4.1 (8 063 octets) testé localement ; non chargé dans HA |
| Person Rich | Ressource chargée v3.4.3, classe/tag v34, 13 553 octets | Candidat 3.4.4 (17 295 octets) testé localement ; non chargé dans HA |
| Livebox | Fork officiel autorisé 2.5.7 ; témoin identique head f5554bb | Branche livrée : CI KO avant pytest ; PR #1 : tests HA2026.9.1 exécutés localement, 7 échecs ; compatibilité non validée |
| Frigate intégration HA | Officielle 5.15.6 chargée | Déjà mise à jour, ne pas rejouer |
| Frigate serveur | 0.17.2, E6D candidat déployé selon référence R2.6 | Aucun changement dans ce POC |
| Sauvegarde | Archives chiffrées locales antérieures aux dernières interventions | Backup courant avec Recorder, clé et reprise hors Core à établir |
| Tests locaux | Baseline 7/19 ; candidat 21/21 dans Node vm simulé | N'atteste pas les Web Components réels ni le rendu ; recette HA nécessaire |
