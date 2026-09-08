# Cartes disponibles

Les deux cartes s’installent ensemble depuis HACS, avec une seule ressource `ha-board.js`. Dans **Modifier le tableau de bord → Ajouter une carte**, rechercher le nom ci-dessous. Chaque carte propose l’éditeur visuel natif HA et un lien vers cette documentation. Les numéros restent dans le manifeste de livraison, jamais dans les noms du catalogue.

## Person History Map

Carte native HA avec historique et filtres individuels, sélection multiple, Tous/aucun et couleurs stables. Type conservé : `custom:person-history-map-card-v14` ; le suffixe technique assure la compatibilité des dashboards existants.

| Option | Valeur par défaut / rôle |
|---|---|
| `persons` | Liste obligatoire ; l’éditeur permet ajout, suppression et réordonnancement |
| `persons[].entity` | Entité `person` ou `device_tracker` qui fournit les positions **et l’historique** |
| `persons[].name` | Nom affiché optionnel |
| `persons[].color` | Couleur CSS optionnelle ; sinon palette cyclique bleu, jaune, corail, turquoise |
| `title`, `subtitle` | Déplacements ; 24 dernières heures (adapter le texte si la période change) |
| `hours_to_show` | 24 ; choix visuel 1–168 h |
| `aspect_ratio` | `4:3` |
| `auto_fit`, `fit_zones` | `true`, `false` |
| `zone_entity` | `zone.home` ; chaîne vide en YAML pour l’omettre |
| `storage_key` | Clé propre à l’instance ; définir une clé explicite unique pour conserver les filtres entre visites |

Le champ historique `map_entity` est conservé mais n’est pas utilisé : changer automatiquement cette source modifierait l’historique familial. Pour changer de source, choisir explicitement `entity`. `cluster` reste désactivé pour distinguer les personnes. Les options de disposition `grid_options` restent gérées par HA.

```yaml
type: custom:person-history-map-card-v14
title: Déplacements
hours_to_show: 24
storage_key: exemple-deplacements
persons:
  - entity: person.alice
    name: Alice Exemple
    color: '#4269d0'
  - entity: person.bob
    name: Bob Exemple
    color: '#f4bd4a'
```

Au chargement, la carte attend l’activation du composant natif (10 secondes maximum). En cas d’échec, **Réessayer** recommence sans recharger tout le dashboard. Les filtres modifiés pendant l’attente sont appliqués. L’état vide signifie qu’aucune personne n’est sélectionnée, pas une panne réseau. Les positions passées restent des données historiques ; HA-BOARD ne modifie ni les tuiles ni les états transmis à HA.

L’ancien U3 de #8, qui visait l’adresse dans les bulles historiques natives, est écarté par décision utilisateur et n’est pas déclaré livré. Aucun prototype supplémentaire de cette voie n’est prévu. Son remplacement est le backlog [#10](https://github.com/smornierHA/ha-board/issues/10), distinct de ce correctif : graphe historique durée + position dans chaque vignette Person Rich.

## Person Rich Card

Profil personnel avec Memoji provenant de l’entité HA, localisation lisible, batteries iOS et charge. Présentations **Compact** et **Détail** dans l’éditeur visuel. Type conservé : `custom:person-rich-card-v34`.

| Options | Rôle |
|---|---|
| `entity` (obligatoire), `name` | Entité de personne et nom optionnel ; photo et nom HA utilisés par défaut |
| `mode` | `detail` par défaut, ou `compact` |
| `tracker` | Source téléphone prioritaire pour coordonnées et précision |
| `gps`, `location_entities` | Localisation déclarée et sources supplémentaires (liste) |
| `geocoded_location` | Adresse connue séparée : ne reçoit pas la date ou la précision d’un autre capteur |
| `position_timestamp_entity` | Capteur fournissant une date ISO de **mesure GPS vérifiée**, prioritaire sur l’attribut |
| `position_timestamp_attribute` | Attribut de date ISO sur l’entité qui fournit les coordonnées |
| `position_stale_after_minutes` | Seuil optionnel utilisé par les contrôles internes de cohérence temporelle |
| `geocoded_timestamp_entity` | Capteur optionnel fournissant une date propre à l’adresse géocodée |
| `geocoded_timestamp_attribute` | Attribut optionnel de date propre à l’adresse ; jamais remplacé par `last_updated` |
| `geocoded_stale_after_minutes` | Seuil explicite optionnel pour séparer une adresse datée trop ancienne de la zone actuelle |
| `duration` | Capteur de durée de présence ; cette durée n’est pas l’âge de la position |
| `battery`, `battery_state` | Niveau et charge du téléphone |
| `phone_label`, `connection`, `activity`, `focus` | Libellé téléphone, réseau, activité et focus |
| `tablet_battery`, `tablet_battery_state`, `tablet_tracker` | Bloc tablette facultatif, activé par `tablet_battery` |
| `proximity`, `route`, `destination` | Dernières valeurs disponibles des capteurs de trajet |
| `navigation_path` | Chemin au clic en compact ; par défaut `/lovelace/Personnes` |
| `grid_options` | Disposition gérée par Home Assistant |

```yaml
type: custom:person-rich-card-v34
entity: person.alice
mode: detail
tracker: device_tracker.alice_example
geocoded_location: sensor.alice_example_address
battery: sensor.alice_example_battery
battery_state: sensor.alice_example_charge
```

Le libellé compact et l’en-tête détaillé affichent d’abord la zone HA nommée. Sans zone, ils affichent **uniquement le nom de ville** : un pays, une rue, un code postal, des coordonnées, `not_home` ou un libellé technique ne deviennent jamais ce libellé. Une valeur structurée telle que « Ville Exemple, France » est normalisée en « Ville Exemple ». La durée n’est accolée qu’à `Maison` : une durée hors domicile n’est jamais présentée comme du temps passé dans la ville.

En mode détail, la ligne d’adresse reste distincte et peut conserver sa forme complète lorsqu’elle est cohérente avec la localisation. Une adresse future, plus ancienne ou incohérente n’est pas fusionnée à la position présentée. Les contrôles de provenance, dates, précision et cohérence restent internes ; ils ne génèrent plus le bandeau de présence/dernière position, le dépliant **Qualité** ni une note de fraîcheur sous les blocs de trajet. Ces avertissements ne sont pas réintroduits sous une autre forme.

Les blocs **Proximité**, **Trajet** et **Destination**, Memoji, batteries/charge, téléphone, tablette, navigation et éditeur visuel restent inchangés. Les sources `unknown`/`unavailable` et coordonnées invalides restent ignorées. Entrée/Espace activent la navigation en compact et le dialogue de l’entité en détail.

## Installation et validation

[Installer avec HACS](HACS.md) · [Compatibilité](COMPATIBILITY.md) · [Recette](ACCEPTANCE.md) · [Fidélité des données](DATA-FRESHNESS.md).

Les exemples sont fictifs. Ne jamais publier les captures familiales, positions, identifiants ou images personnelles dans ce dépôt. L’éditeur utilise `getConfigForm` et les sélecteurs natifs ; la validation Node ne remplace pas l’essai visuel sur Home Assistant.
