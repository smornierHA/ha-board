# Contrat de fidélité de la localisation

## Décision d’affichage — 8 septembre 2026

Le retour utilisateur après installation de `v0.1.1-rc.1` remplace les anciennes consignes qui imposaient des informations techniques visibles. À partir du candidat `0.1.2-rc.1`, Person Rich ne rend plus le bandeau présence/dernière position, le dépliant **Qualité** ni la note de fraîcheur des capteurs de trajet.

Cette simplification **ne supprime pas les contrôles de données** : provenance, timestamps propres aux sources, coordonnées valides, précision, source future, cohérence ville/adresse/position et séparation des adresses incompatibles restent traités en interne. Aucun avertissement supprimé n’est réintroduit sous une autre forme visible.

## Principes maintenus

- `last_updated` HA n’est jamais assimilé à l’heure d’un relevé GPS.
- Les coordonnées nulles, vides, booléennes, non numériques ou hors bornes sont refusées.
- `unknown` et `unavailable` ne réutilisent pas silencieusement des attributs conservés comme localisation courante.
- La zone HA nommée prime pour le libellé ; sinon seule une ville prudente est utilisée.
- Une rue, un code postal, un pays, des coordonnées ou un état technique ne deviennent pas un nom de ville.
- Une source future/incohérente est exclue de la présentation actuelle.
- L’adresse géocodée conserve sa provenance et sa date propres ; une adresse incompatible n’est pas présentée comme courante.
- La durée de présence n’est affichée avec un lieu que pour `Maison`; une durée hors domicile n’est pas attribuée à une ville.
- Les capteurs Proximité/Trajet/Destination restent affichés comme valeurs de leurs propres sources, sans leur prêter la fraîcheur GPS.

## Sources et dates

Les trackers téléphone peuvent exposer latitude, longitude et `gps_accuracy`. Un horodatage spécifique de mesure GPS n’est utilisé que s’il est fourni explicitement par `position_timestamp_entity` ou `position_timestamp_attribute`. Les dates propres à l’adresse utilisent `geocoded_timestamp_entity` ou `geocoded_timestamp_attribute`. `geocoded_stale_after_minutes` et `position_stale_after_minutes` restent des seuils explicites de contrôle ; aucune ancienneté universelle n’est inventée.

La ville issue d’un géocodage porte toujours une provenance interne. Les valeurs structurées (`city`, `locality`, `postal_town`, `municipality`, `town`, `village`, `sub_locality`) sont nettoyées avant présentation ; un suffixe pays tel que « France » n’apparaît pas dans le libellé ville. Une extraction d’adresse reste conservatrice.

## Adresse distincte

En détail, une adresse valide et cohérente peut rester visible sur sa ligne distincte, y compris avec rue, code postal et pays. Cette ligne ne change pas la règle du libellé principal, qui reste zone puis ville seule.

Si l’adresse est d’une autre ville, plus ancienne que la position, antérieure à l’entrée dans la zone actuelle, future ou associée à des coordonnées distinctes, elle reste séparée en interne et n’est pas exposée comme adresse courante. Aucun texte « Adresse non rapprochée » ou détail technique équivalent n’est affiché.

## Historique

Person History Map continue de déléguer l’historique au composant natif et n’est pas modifiée par ce correctif. L’ancien U3 d’adresse dans les bulles natives est écarté par décision utilisateur, sans être déclaré livré. Son remplacement est le backlog #10, graphe durée + position par vignette, hors périmètre de `0.1.2-rc.1`.

Les tests utilisent uniquement des noms, identifiants, villes, adresses et coordonnées fictifs. Aucun état de position familial n’est nécessaire pour démontrer ces contrats.

## Pilote météo : données absentes et périodes

Les prévisions horaires et probabilités conservent leur source, leurs clés et leur mode de rapprochement configurés. Les dates invalides sont ignorées ; les lignes valides sont triées. Le min/max du header provient de la prévision daily du jour ou d’une surcharge explicite, jamais du seul intervalle horaire visible. Les conventions horaires locales existantes sont conservées.

Zéro est une mesure valide (température, pluie, probabilité, vent). Les champs nulls/vides, booléens, objets, `unknown`, `unavailable` ou malformés ne sont pas convertis en zéro. Aucune conversion d’unité n’est effectuée. Les trois options historiques `*_unit` sont conservées, mais restent sans effet sur le rendu comme dans la source : pluie en `mm`, températures en `°`, vent sans suffixe. Les fixtures et la recette préparée couvrent les sources métriques ; un autre système d’unités nécessitera un lot explicite. Les callbacks périmés après déconnexion/reconfiguration ne remplacent pas les prévisions de la nouvelle instance. Le repli legacy reste celui du composant importé ; il ne prouve pas la fraîcheur d’un provider indisponible.
