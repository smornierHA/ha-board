# Livraison et retour arrière

## A — Fond de carte natif

1. Avant intervention, rafraîchir Core/cible, chargement/provenance Livebox et Frigate, configuration et espace. Relire la référence Frigate actuelle : intégration HA officielle et serveur Frigate/E6D sont distincts.
2. Lever compatibilité Livebox cible et disposer d'une sauvegarde exploitable, clé de déchiffrement si nécessaire, accès de récupération indépendant de Core. Une liste de backups ne prouve pas une restauration ; copier les JS ne restaure pas Core/Recorder.
3. Identifier/créer une sauvegarde adaptée à l'état courant juste avant mise à jour, documenter couverture et accès. Ne pas restaurer une base automatiquement après de nouvelles écritures.
4. Installer uniquement Core 2026.9.1 si la cible reste celle vérifiée, avec temps limite et accès de reprise. Ne pas lancer OS/NAS/Frigate serveur ni installer Livebox upstream.
5. Après redémarrage, vérifier version chargée, intégrations, erreurs nouvelles, /map et Personnes. Recharger clients et faire ACCEPTANCE. Cache seul n'est pas le traitement de la cause.

État : Core non mis à jour ici ; Frigate HA 5.15.6 déjà installé dans le chantier parallèle. Compatibilité Livebox cible et reprise hors Core non prouvées : pas d'installation tant que ces préconditions restent ouvertes.

## B — Cartes personnalisées

1. Import GitHub, PR corrective intégrée, tests stricts sur SHA intégré et artefact SHA256. Ne jamais déployer examples/ : identifiants fictifs.
2. Comparer sources/ressources actuelles aux empreintes attendues. En cas de dérive ou travail parallèle, rapprocher avant écriture ; ne pas remplacer le dashboard entier.
3. Conserver originaux/config exacte hors www/ et hors Git. Les trois images internes HA dépendent de la sauvegarde HA ; le SVG local ne les remplace pas.
4. Installer bundle candidat à un chemin/version immuable, vérifier lecture retour et empreinte, puis modifier seulement les deux ressources ciblées avec garde de configuration. Préserver tags/classes si compatibles. Une seule ressource active par custom element.
5. Contrôler octets servis puis ressource réellement chargée dans un navigateur neuf : customElements garde la première définition. Changer seulement le query string sans recharger ne prouve pas la nouvelle version.
6. Exécuter ACCEPTANCE ; consigner erreurs, version/empreinte réseau, résultats et limites. Pas de restart Core pour une carte pure frontend.
7. Retour arrière : précédente URL et octets préservés, rechargement complet des clients, parcours critiques. Si config modifiée, appliquer seulement le diff inverse sur la révision toujours attendue.

Pas de ménage des anciens fichiers dans cette première livraison. Les caches/autres consommateurs externes ne sont pas inventoriés ; archivage séparé avec preuve d'absence de référence.
