# Options Garage Control Card

La configuration réellement observée le 9 septembre 2026 utilise `pulse`, `switch.toggle`, un capteur d’état distinct et `show_motion_badge: false`. Cette valeur fausse prime sur une préférence historique et reste fausse dans l’exemple de migration. Les identifiants ci-dessous sont fictifs.

| Groupe | Options | Rôle / défaut |
|---|---|---|
| Carte | `name`, `icon`, `popup_hash` | `Garage`, `mdi:garage`, `#popup_garage` |
| Navigation | `clear_hash_on_close`, `close_on_hash_change` | `true` ; fermeture par hash et Escape conservée |
| Commande | `garage_entity` | obligatoire ; entité visée par le service |
| Service | `garage_service`, `garage_open_service`, `garage_close_service`, `garage_stop_service` | surcharge optionnelle ; inférence par domaine sinon |
| Mode | `garage_command_mode` | `pulse` par défaut ; `stateful` et domaine `cover` conservés |
| État physique | `garage_state_entity`, `garage_open_state`, `garage_closed_state` | source distincte et valeurs `on` / `off` par défaut |
| Tolérance | `allow_unknown_command_state`, `pulse_stop_enabled` | `true`, `false` |
| Caméra | `camera_entity` ou `camera_entities` | une caméra historique ou liste structurée ; au moins une obligatoire |
| Rendu caméra | `camera_view`, `camera_fit_mode`, `camera_aspect_ratio` | `live`, `cover`, `16:9` |
| Détection | `motion_entity`, `person_entity`, `show_motion_badge`, `show_person_badge` | entités optionnelles ; badges `true` par défaut |
| Véhicules | `vehicle_entities` | liste structurée : clé, nom, entité, compteur, icône, état et libellés |
| Événements | `event_entities`, alias `last_*_entity` | images/horodatages optionnels ; aucune image incorporée au module |
| Visibilité | `show_snapshots`, `show_empty_events`, `show_debug` | `true`, `false`, `false` |
| Temporisations | `live_detection_badge_duration_ms`, `event_message_duration_ms` | `12000`, `12000` |
| Commande | `action_feedback`, `action_lock_ms`, `feedback_duration_ms`, `state_confirmation_timeout_ms` | `true`, `2000`, `2400`, `25000` |

Une commande n’est jamais déclarée physiquement réussie à partir du seul résultat de `hass.callService`. Le capteur d’état confirme l’état attendu ; l’absence de confirmation expire avec un avertissement distinct. Les états `unknown`, `unavailable` et une entité absente restent distincts.

L’éditeur utilise `ha-form`. Les listes d’objets restent éditées via le sélecteur objet générique : il préserve les clés avancées mais ne guide pas chaque sous-champ. Les clés inconnues et `grid_options` sont conservées sans être exposées comme options propres au composant.
