/* HA-BOARD Garage candidate 1.1.0; see THIRD-PARTY-NOTICES.md and docs/GARAGE-PROVENANCE.md.
 * Migrated from the expurgated 1.0.1 source: lifecycle, editor and packaging changes.
 */
/*
 * garage-control-card v1.0.1
 * Carte Home Assistant autonome pour la commande et la surveillance du garage.
 * Inspirée de l'ergonomie validée de portail-sip-card V4.2, sans aucune dépendance SIP.
 */
import { LitElement, html, css } from "lit-element";

const VERSION = "1.1.0";

class GarageControlCard extends LitElement {
  static properties = {
    hass: {},
    _config: { state: true },
    _dialogOpen: { state: true },
    _error: { state: true },
    _cameraCard: { state: true },
    _activeCameraIndex: { state: true },
    _garageBusy: { state: true },
    _garageFeedback: { state: true },
    _pendingAction: { state: true },
    _eventContext: { state: true },
  };

  static getDefaultConfig() {
    return {
      name: "Garage", icon: "mdi:garage", popup_hash: "#popup_garage",
      clear_hash_on_close: true, close_on_hash_change: true,
      garage_service: undefined, garage_open_service: undefined,
      garage_close_service: undefined, garage_stop_service: undefined,
      garage_command_mode: "pulse", garage_open_state: "on", garage_closed_state: "off",
      allow_unknown_command_state: true, pulse_stop_enabled: false,
      camera_view: "live", camera_fit_mode: "cover", camera_aspect_ratio: "16:9",
      motion_entity: "", person_entity: "", vehicle_entities: [], event_entities: [],
      last_person_entity: "", last_motion_entity: "", last_vehicle_a_entity: "",
      last_vehicle_b_entity: "", last_car_entity: "",
      show_snapshots: true, show_empty_events: false, show_motion_badge: true,
      show_person_badge: true, live_detection_badge_duration_ms: 12000, show_debug: false,
      action_feedback: true, action_lock_ms: 2000, feedback_duration_ms: 2400,
      state_confirmation_timeout_ms: 25000, event_message_duration_ms: 12000,
    };
  }

  static getStubConfig() {
    return {
      ...this.getDefaultConfig(),
      garage_entity: "switch.example_garage_command",
      garage_state_entity: "binary_sensor.example_garage_open",
      camera_entities: [
        { entity: "camera.example_garage", name: "Garage", icon: "mdi:garage", camera_view: "live" },
        { entity: "camera.example_driveway", name: "Allée", icon: "mdi:road-variant", camera_view: "live" },
      ],
    };
  }

  static getConfigElement() { return document.createElement("garage-control-card-editor"); }

  static getConfigForm() {
    const section = (name, title, schema) => ({ type: "expandable", name, title, flatten: true, schema });
    const entity = (name) => ({ name, selector: { entity: {} } });
    const text = (name) => ({ name, selector: { text: {} } });
    const boolean = (name) => ({ name, selector: { boolean: {} } });
    const number = (name, step = 1) => ({ name, selector: { number: { mode: "box", min: 0, step } } });
    const object = (name) => ({ name, selector: { object: {} } });
    return {
      schema: [
        section("general", "Carte et navigation", [
          text("name"), { name: "icon", selector: { icon: {} } }, text("popup_hash"),
          boolean("clear_hash_on_close"), boolean("close_on_hash_change"),
        ]),
        section("command", "Commande et état physique", [
          entity("garage_entity"), entity("garage_state_entity"),
          { name: "garage_command_mode", selector: { select: { mode: "dropdown", options: [
            { value: "pulse", label: "Impulsion" }, { value: "stateful", label: "État maintenu" },
          ] } } },
          text("garage_service"), text("garage_open_service"), text("garage_close_service"), text("garage_stop_service"),
          text("garage_open_state"), text("garage_closed_state"), boolean("allow_unknown_command_state"), boolean("pulse_stop_enabled"),
        ]),
        section("camera", "Caméras", [
          entity("camera_entity"), text("camera_name"), { name: "camera_icon", selector: { icon: {} } }, object("camera_entities"),
          { name: "camera_view", selector: { select: { mode: "dropdown", options: ["live", "auto"] } } },
          { name: "camera_fit_mode", selector: { select: { mode: "dropdown", options: ["cover", "contain", "fill"] } } },
          text("camera_aspect_ratio"),
        ]),
        section("detections", "Détections, véhicules et événements", [
          entity("motion_entity"), entity("person_entity"), boolean("show_motion_badge"), boolean("show_person_badge"),
          number("live_detection_badge_duration_ms", 100), object("vehicle_entities"), object("event_entities"),
          entity("last_person_entity"), entity("last_motion_entity"), entity("last_vehicle_a_entity"),
          entity("last_vehicle_b_entity"), entity("last_car_entity"), boolean("show_snapshots"),
          boolean("show_empty_events"), number("event_message_duration_ms", 100),
        ]),
        section("feedback", "Protection et retours", [
          boolean("action_feedback"), number("action_lock_ms", 100), number("feedback_duration_ms", 100),
          number("state_confirmation_timeout_ms", 100), boolean("show_debug"),
        ]),
      ],
      computeLabel: (schema) => ({
        name: "Nom", icon: "Icône", popup_hash: "Hash de navigation", clear_hash_on_close: "Effacer le hash à la fermeture",
        close_on_hash_change: "Fermer si le hash change", garage_entity: "Entité de commande", garage_state_entity: "Capteur d’état physique",
        garage_command_mode: "Mode de commande", garage_service: "Service principal", garage_open_service: "Service d’ouverture",
        garage_close_service: "Service de fermeture", garage_stop_service: "Service d’arrêt", garage_open_state: "Valeur ouverte",
        garage_closed_state: "Valeur fermée", allow_unknown_command_state: "Autoriser une commande si l’état de commande est inconnu",
        pulse_stop_enabled: "Autoriser une impulsion d’arrêt en mouvement", camera_entity: "Caméra unique (ancien format)",
        camera_name: "Nom de la caméra", camera_icon: "Icône de la caméra", camera_entities: "Liste structurée des caméras",
        camera_view: "Mode caméra", camera_fit_mode: "Ajustement de l’image", camera_aspect_ratio: "Ratio d’image",
        motion_entity: "Capteur de mouvement", person_entity: "Capteur de personne", show_motion_badge: "Afficher le badge mouvement",
        show_person_badge: "Afficher le badge personne", live_detection_badge_duration_ms: "Durée du badge récent (ms)",
        vehicle_entities: "Liste structurée des véhicules", event_entities: "Liste structurée des images d’événement",
        last_person_entity: "Dernière personne", last_motion_entity: "Dernier mouvement", last_vehicle_a_entity: "Dernier véhicule A",
        last_vehicle_b_entity: "Dernier véhicule B", last_car_entity: "Dernière voiture", show_snapshots: "Afficher les captures",
        show_empty_events: "Afficher une section événements vide", event_message_duration_ms: "Durée du message de détection (ms)",
        action_feedback: "Afficher les retours de commande", action_lock_ms: "Verrou anti-double commande (ms)",
        feedback_duration_ms: "Durée des retours (ms)", state_confirmation_timeout_ms: "Délai de confirmation physique (ms)",
        show_debug: "Afficher le diagnostic",
      })[schema.name] || schema.name,
    };
  }

  static styles = css`
    :host {
      display: block;
      --garage-red: var(--red-color, #f44336);
      --garage-green: var(--green-color, #4caf50);
      --garage-blue: var(--blue-color, #2196f3);
      --garage-orange: var(--orange-color, #ff9800);
      --garage-grey: var(--disabled-text-color, #8a8a8a);
      --garage-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --garage-text: var(--primary-text-color, #111);
      --garage-secondary: var(--secondary-text-color, #666);
      --garage-border: color-mix(in srgb, var(--primary-text-color, #111) 14%, transparent);
      --garage-soft: color-mix(in srgb, var(--primary-text-color, #111) 8%, transparent);
    }

    * {
      box-sizing: border-box;
    }

    ha-card {
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 18px);
      border: 1px solid var(--garage-border);
      background:
        linear-gradient(
          145deg,
          var(--garage-card-bg),
          color-mix(in srgb, var(--garage-card-bg) 88%, var(--primary-text-color, #111) 5%)
        );
      color: var(--garage-text);
      cursor: pointer;
    }

    ha-card:focus-visible,
    button:focus-visible,
    summary:focus-visible {
      outline: 2px solid var(--garage-blue);
      outline-offset: 2px;
    }

    .main-card {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 14px;
      position: relative;
      border-left: 5px solid transparent;
      transition: border-color 0.18s ease, filter 0.18s ease;
    }

    .main-card.closed { border-left-color: var(--garage-green); }
    .main-card.open { border-left-color: var(--garage-orange); }
    .main-card.moving { border-left-color: var(--garage-blue); }
    .main-card.unavailable { border-left-color: var(--garage-red); }
    .main-card.unknown { border-left-color: var(--garage-grey); }

    .main-card.moving .icon-wrap {
      animation: garage-pulse 1.25s ease-in-out infinite;
    }

    .icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: var(--garage-soft);
      color: var(--garage-text);
      flex: 0 0 auto;
    }

    .closed .icon-wrap,
    .status-pill.closed {
      background: color-mix(in srgb, var(--garage-green) 17%, transparent);
      color: var(--garage-green);
    }

    .open .icon-wrap,
    .status-pill.open {
      background: color-mix(in srgb, var(--garage-orange) 18%, transparent);
      color: var(--garage-orange);
    }

    .moving .icon-wrap,
    .status-pill.moving {
      background: color-mix(in srgb, var(--garage-blue) 18%, transparent);
      color: var(--garage-blue);
    }

    .unavailable .icon-wrap,
    .status-pill.unavailable {
      background: color-mix(in srgb, var(--garage-red) 16%, transparent);
      color: var(--garage-red);
    }

    .title {
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
    }

    .subtitle {
      margin-top: 3px;
      font-size: 13px;
      color: var(--garage-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mini-vehicles {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
    }

    .mini-vehicle {
      min-width: 42px;
      height: 36px;
      padding: 0 9px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: var(--garage-soft);
      color: var(--garage-secondary);
      cursor: pointer;
      font-size: 11px;
      font-weight: 850;
      white-space: nowrap;
    }

    .mini-vehicle.present {
      background: color-mix(in srgb, var(--garage-blue) 18%, transparent);
      color: var(--garage-blue);
    }

    .mini-vehicle.unavailable {
      background: color-mix(in srgb, var(--garage-red) 12%, transparent);
      color: var(--garage-red);
    }

    .mini-vehicle ha-icon {
      --mdc-icon-size: 18px;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483640;
      background: rgba(0, 0, 0, 0.62);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .dialog {
      width: min(780px, 100%);
      max-height: min(94vh, 940px);
      overflow: auto;
      overscroll-behavior: contain;
      border-radius: 28px;
      background:
        linear-gradient(
          160deg,
          var(--garage-card-bg),
          color-mix(in srgb, var(--garage-card-bg) 86%, var(--primary-text-color, #111) 6%)
        );
      color: var(--garage-text);
      box-shadow: 0 24px 90px rgba(0, 0, 0, 0.42);
      border: 1px solid color-mix(in srgb, white 18%, transparent);
    }

    .dialog-header {
      position: sticky;
      top: 0;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 18px 10px;
      background: color-mix(in srgb, var(--garage-card-bg) 92%, transparent);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .dialog-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .dialog-title-copy {
      min-width: 0;
    }

    .status-pill {
      margin-top: 5px;
      width: fit-content;
      max-width: 100%;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 6px 9px;
      font-size: 12px;
      font-weight: 850;
      background: var(--garage-soft);
      color: var(--garage-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-pill ha-icon {
      --mdc-icon-size: 17px;
      flex: 0 0 auto;
    }

    .close-btn {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      border: 0;
      cursor: pointer;
      background: var(--garage-soft);
      color: var(--garage-text);
      display: grid;
      place-items: center;
      flex: 0 0 auto;
    }

    .camera-section {
      margin: 0 18px;
    }

    .camera-area {
      border-radius: 22px;
      overflow: hidden;
      background: #111;
      min-height: 220px;
      position: relative;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
      touch-action: pan-y;
    }

    .camera-area ha-card {
      border-radius: 0;
      border: 0;
      box-shadow: none;
    }

    .camera-placeholder {
      aspect-ratio: 16 / 9;
      min-height: 220px;
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.75);
      padding: 20px;
      text-align: center;
    }

    .camera-placeholder-content {
      display: grid;
      justify-items: center;
      gap: 9px;
    }

    .camera-placeholder ha-icon {
      --mdc-icon-size: 32px;
    }

    .camera-overlay-label {
      position: absolute;
      left: 12px;
      bottom: 12px;
      z-index: 2;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.52);
      color: white;
      font-size: 13px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: none;
    }

    .camera-live-badges {
      position: absolute;
      right: 12px;
      top: 12px;
      z-index: 2;
      display: flex;
      gap: 6px;
      pointer-events: none;
    }

    .camera-live-badge {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: white;
      background: rgba(0, 0, 0, 0.52);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .camera-live-badge.active {
      background: color-mix(in srgb, var(--garage-orange) 84%, rgba(0, 0, 0, 0.35));
    }

    .camera-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 4px 2px;
    }

    .bullet {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      border: 0;
      cursor: pointer;
      background: color-mix(in srgb, var(--primary-text-color, #111) 28%, transparent);
      padding: 0;
      transition: transform 0.16s ease, width 0.16s ease, background 0.16s ease;
    }

    .bullet.active {
      width: 24px;
      background: var(--garage-blue);
    }

    .camera-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 0 0;
      scrollbar-width: none;
    }

    .camera-tabs::-webkit-scrollbar { display: none; }

    .camera-tab {
      border: 0;
      border-radius: 999px;
      padding: 8px 11px;
      white-space: nowrap;
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--garage-soft);
      color: var(--garage-text);
    }

    .camera-tab.active {
      background: color-mix(in srgb, var(--garage-blue) 18%, transparent);
      color: var(--garage-blue);
    }

    .dialog-body {
      padding: 14px 18px 18px;
    }

    .message-zone {
      margin: 0 0 12px;
    }

    .context-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 14px;
      border-left: 4px solid var(--garage-blue);
      background: color-mix(in srgb, var(--primary-text-color, #111) 7%, transparent);
      color: var(--garage-text);
      font-size: 13px;
      font-weight: 750;
      line-height: 1.35;
    }

    .context-message.success {
      border-left-color: var(--garage-green);
      color: var(--garage-green);
      background: color-mix(in srgb, var(--garage-green) 12%, transparent);
    }

    .context-message.error-state {
      border-left-color: var(--garage-red);
      color: var(--garage-red);
      background: color-mix(in srgb, var(--garage-red) 12%, transparent);
    }

    .context-message.warning {
      border-left-color: var(--garage-orange);
      color: var(--garage-orange);
      background: color-mix(in srgb, var(--garage-orange) 12%, transparent);
    }

    .context-message.info {
      border-left-color: var(--garage-blue);
      color: var(--garage-blue);
      background: color-mix(in srgb, var(--garage-blue) 11%, transparent);
    }

    .context-meta {
      color: var(--garage-secondary);
      font-weight: 650;
    }

    .primary-action {
      margin-bottom: 14px;
    }

    .button {
      width: 100%;
      border: 0;
      border-radius: 18px;
      padding: 13px 14px;
      min-height: 52px;
      cursor: pointer;
      font-weight: 850;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: white;
      background: color-mix(in srgb, var(--garage-blue) 86%, black 4%);
      transition: transform 0.12s ease, filter 0.12s ease, opacity 0.12s ease;
    }

    .button:active { transform: scale(0.985); }
    .button.open-action { background: color-mix(in srgb, var(--garage-blue) 86%, black 4%); }
    .button.close-action { background: color-mix(in srgb, var(--garage-orange) 88%, black 5%); }
    .button.stop-action { background: color-mix(in srgb, var(--garage-red) 86%, black 5%); }
    .button.command-action { background: color-mix(in srgb, var(--garage-blue) 78%, var(--garage-grey) 14%); }
    .button:disabled { opacity: 0.48; cursor: not-allowed; }
    .spin { animation: spin 0.8s linear infinite; }

    .section {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--garage-border);
    }

    .section-title {
      margin: 0 0 10px;
      font-size: 13px;
      font-weight: 850;
      color: var(--garage-secondary);
      letter-spacing: 0.01em;
    }

    .vehicle-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .vehicle-card {
      border: 1px solid var(--garage-border);
      border-radius: 18px;
      min-height: 82px;
      padding: 12px;
      background: var(--garage-soft);
      color: var(--garage-text);
      cursor: pointer;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      text-align: left;
    }

    .vehicle-card.present {
      border-color: color-mix(in srgb, var(--garage-blue) 42%, transparent);
      background: color-mix(in srgb, var(--garage-blue) 13%, transparent);
    }

    .vehicle-card.unavailable {
      border-color: color-mix(in srgb, var(--garage-red) 32%, transparent);
      background: color-mix(in srgb, var(--garage-red) 9%, transparent);
    }

    .vehicle-icon {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--primary-text-color, #111) 9%, transparent);
      color: var(--garage-secondary);
    }

    .vehicle-card.present .vehicle-icon {
      background: color-mix(in srgb, var(--garage-blue) 20%, transparent);
      color: var(--garage-blue);
    }

    .vehicle-card.unavailable .vehicle-icon {
      background: color-mix(in srgb, var(--garage-red) 16%, transparent);
      color: var(--garage-red);
    }

    .vehicle-name {
      font-size: 14px;
      font-weight: 850;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .vehicle-state {
      margin-top: 3px;
      font-size: 12px;
      font-weight: 700;
      color: var(--garage-secondary);
    }

    .event-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .event-grid.single {
      grid-template-columns: 1fr;
    }

    .snapshot {
      border: 0;
      padding: 0;
      text-align: left;
      border-radius: 18px;
      overflow: hidden;
      background: var(--garage-soft);
      min-height: 104px;
      position: relative;
      cursor: pointer;
      width: 100%;
      color: inherit;
    }

    .snapshot:active { transform: scale(0.99); }

    .snapshot img {
      width: 100%;
      height: 142px;
      object-fit: cover;
      display: block;
      background: #111;
    }

    .snapshot-label {
      position: absolute;
      left: 8px;
      bottom: 8px;
      max-width: calc(100% - 16px);
      padding: 6px 9px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      color: white;
      background: rgba(0, 0, 0, 0.58);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty-events {
      padding: 12px;
      border-radius: 14px;
      color: var(--garage-secondary);
      background: var(--garage-soft);
      font-size: 13px;
    }

    .debug {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--garage-border);
      color: var(--garage-secondary);
      font-size: 12px;
    }

    .debug summary {
      cursor: pointer;
      font-weight: 850;
      color: var(--garage-secondary);
    }

    .debug pre {
      margin: 10px 0 0;
      padding: 10px;
      border-radius: 12px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      background: color-mix(in srgb, var(--primary-text-color, #111) 7%, transparent);
      color: var(--garage-text);
      font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    @media (max-width: 620px) {
      .mini-vehicle {
        min-width: 36px;
        padding: 0 7px;
      }
    }

    @media (max-width: 560px) {
      .overlay {
        padding: 0;
        align-items: flex-end;
      }

      .dialog {
        border-radius: 28px 28px 0 0;
        max-height: 94vh;
        width: 100%;
        padding-bottom: env(safe-area-inset-bottom, 0);
      }

      .camera-section { margin: 0 12px; }
      .dialog-header { padding-left: 14px; padding-right: 14px; }
      .dialog-body { padding-left: 14px; padding-right: 14px; }
      .event-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 390px) {
      .main-card {
        gap: 9px;
        padding: 12px;
      }

      .mini-vehicles { gap: 5px; }

      .mini-vehicle {
        width: 34px;
        min-width: 34px;
        padding: 0;
      }

      .mini-vehicle span { display: none; }
      .vehicle-grid { gap: 8px; }
      .vehicle-card { padding: 10px; gap: 8px; }
      .vehicle-icon { width: 38px; height: 38px; }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes garage-pulse {
      0%, 100% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.07); filter: brightness(1.12); }
    }
  `;

  constructor() {
    super();
    this._dialogOpen = false;
    this._error = "";
    this._cameraCard = null;
    this._cameraCardEntity = null;
    this._cameraLoadToken = 0;
    this._cameraGeneration = 0;
    this._activeCameraIndex = 0;
    this._garageBusy = false;
    this._garageFeedback = null;
    this._pendingAction = null;
    this._eventContext = null;
    this._touchStartX = 0;
    this._busyTimer = null;
    this._feedbackTimer = null;
    this._confirmationTimer = null;
    this._eventTimer = null;
    this._attached = false;
    this._commandGeneration = 0;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Configuration garage-control-card invalide.");
    }
    if (!config.garage_entity) {
      throw new Error("garage_entity est obligatoire.");
    }
    if (!config.camera_entity && !(Array.isArray(config.camera_entities) && config.camera_entities.length)) {
      throw new Error("camera_entity ou camera_entities est obligatoire.");
    }

    const popupHash = String(config.popup_hash || "#popup_garage");
    if (this._config) this._invalidateCommandCycle(true);

    const cameraGeneration = ++this._cameraGeneration;
    this._config = {
      ...GarageControlCard.getDefaultConfig(),
      ...config,
      popup_hash: popupHash.startsWith("#") ? popupHash : `#${popupHash}`,
    };
    this._destroyCameraCard();
    if (this._dialogOpen && this._attached) {
      queueMicrotask(() => {
        if (
          !this._attached ||
          !this._dialogOpen ||
          cameraGeneration !== this._cameraGeneration
        ) return;
        this._ensureCameraCard(true, cameraGeneration);
      });
    }
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this._attached = true;
    this._commandGeneration += 1;
    const cameraGeneration = ++this._cameraGeneration;
    const dialogWasOpen = this._dialogOpen;
    window.addEventListener("hashchange", this._handleHashChange);
    window.addEventListener("keydown", this._handleKeyDown);
    queueMicrotask(() => {
      if (!this._attached || cameraGeneration !== this._cameraGeneration) return;
      this._handleHashChange();
      if (dialogWasOpen && this._dialogOpen) {
        this._ensureCameraCard(false, cameraGeneration);
      }
    });
  }

  disconnectedCallback() {
    this._attached = false;
    this._cameraGeneration += 1;
    window.removeEventListener("hashchange", this._handleHashChange);
    window.removeEventListener("keydown", this._handleKeyDown);
    this._invalidateCommandCycle(true);
    this._destroyCameraCard();
    super.disconnectedCallback();
  }

  updated(changedProps) {
    if (!changedProps.has("hass")) return;

    if (this._cameraCard) this._cameraCard.hass = this.hass;

    const oldHass = changedProps.get("hass");
    this._handlePendingStateUpdate(oldHass);
    this._handleDetectionUpdates(oldHass);
  }

  getCardSize() {
    return 1;
  }

  _handleHashChange = () => {
    if (!this._config?.popup_hash) return;
    const matches = window.location.hash === this._config.popup_hash;

    if (matches && !this._dialogOpen) {
      this._openDialog(false);
    } else if (!matches && this._dialogOpen && this._config.close_on_hash_change !== false) {
      this._closeDialog(false);
    }
  };

  _handleKeyDown = (event) => {
    if (event.key === "Escape" && this._dialogOpen) this._closeDialog(true);
  };

  _state(entityId, hass = this.hass) {
    return entityId ? hass?.states?.[entityId] : undefined;
  }

  _domain(entityId) {
    return String(entityId || "").split(".")[0];
  }

  _isUnavailableState(rawState) {
    return rawState === "unavailable" || rawState === "unknown";
  }

  _isOn(entityId, hass = this.hass) {
    return this._state(entityId, hass)?.state === "on";
  }

  _isRecentlyActive(entityId, activeState = "on", durationMs = 12000, hass = this.hass) {
    const entity = this._state(entityId, hass);
    if (!entity || String(entity.state) !== String(activeState)) return false;

    const changedAt = Date.parse(entity.last_changed || entity.last_updated || "");
    if (!Number.isFinite(changedAt)) return false;

    const age = Date.now() - changedAt;
    const maxAge = Math.max(1000, Number(durationMs || 12000));
    return age >= -5000 && age <= maxAge;
  }

  _commandAvailable() {
    const entityId = this._config?.garage_entity;
    const entity = this._state(entityId);
    if (!entity) return false;
    if (entity.state === "unavailable") return false;
    if (entity.state === "unknown" && this._config.allow_unknown_command_state === false) return false;
    return true;
  }

  _stateEntityId() {
    if (this._config?.garage_state_entity) return this._config.garage_state_entity;

    const commandEntity = this._config?.garage_entity;
    const domain = this._domain(commandEntity);
    if (domain === "cover") return commandEntity;
    if (domain === "switch" && String(this._config?.garage_command_mode).toLowerCase() === "stateful") {
      return commandEntity;
    }
    return "";
  }

  _garageStateInfo(hass = this.hass) {
    const entityId = this._stateEntityId();
    if (!entityId) {
      return {
        entityId: "",
        raw: "",
        key: "unknown",
        text: "État non disponible",
        cls: "unknown",
        icon: "mdi:help-circle-outline",
      };
    }

    const entity = this._state(entityId, hass);
    if (!entity) {
      return {
        entityId,
        raw: "missing",
        key: "unavailable",
        text: "État indisponible",
        cls: "unavailable",
        icon: "mdi:alert-circle-outline",
      };
    }

    const raw = String(entity.state || "").toLowerCase();
    const openState = String(this._config?.garage_open_state ?? "on").toLowerCase();
    const closedState = String(this._config?.garage_closed_state ?? "off").toLowerCase();

    if (raw === "opening") {
      return { entityId, raw, key: "opening", text: "Ouverture…", cls: "moving", icon: "mdi:garage-open-variant" };
    }
    if (raw === "closing") {
      return { entityId, raw, key: "closing", text: "Fermeture…", cls: "moving", icon: "mdi:garage-alert-variant" };
    }
    if (raw === openState || raw === "open") {
      return { entityId, raw, key: "open", text: "Garage ouvert", cls: "open", icon: "mdi:garage-open" };
    }
    if (raw === closedState || raw === "closed") {
      return { entityId, raw, key: "closed", text: "Garage fermé", cls: "closed", icon: "mdi:garage" };
    }
    if (raw === "unavailable") {
      return { entityId, raw, key: "unavailable", text: "État indisponible", cls: "unavailable", icon: "mdi:alert-circle-outline" };
    }
    if (raw === "unknown" || raw === "") {
      return { entityId, raw, key: "unknown", text: "État inconnu", cls: "unknown", icon: "mdi:help-circle-outline" };
    }

    return {
      entityId,
      raw,
      key: "unknown",
      text: entity.attributes?.friendly_name ? `${entity.attributes.friendly_name} : ${entity.state}` : `État : ${entity.state}`,
      cls: "unknown",
      icon: "mdi:help-circle-outline",
    };
  }

  _garageStatus() {
    const state = this._garageStateInfo();
    const commandAvailable = this._commandAvailable();

    if (!commandAvailable) {
      return {
        ...state,
        cls: "unavailable",
        icon: "mdi:garage-alert",
        commandAvailable: false,
      };
    }

    return { ...state, commandAvailable: true };
  }

  _cameras() {
    const cfg = this._config || {};
    const raw = Array.isArray(cfg.camera_entities) && cfg.camera_entities.length
      ? cfg.camera_entities
      : [{
          entity: cfg.camera_entity,
          name: cfg.camera_name || "Garage",
          icon: cfg.camera_icon || "mdi:cctv",
        }];

    return raw
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            entity: item,
            name: this._state(item)?.attributes?.friendly_name || `Caméra ${index + 1}`,
            icon: "mdi:cctv",
            camera_view: cfg.camera_view,
            fit_mode: cfg.camera_fit_mode,
            aspect_ratio: cfg.camera_aspect_ratio,
          };
        }

        const entity = item?.entity || item?.entity_id || item?.camera_entity;
        if (!entity) return null;
        return {
          entity,
          name: item.name || this._state(entity)?.attributes?.friendly_name || `Caméra ${index + 1}`,
          icon: item.icon || "mdi:cctv",
          camera_view: item.camera_view || cfg.camera_view,
          fit_mode: item.fit_mode || cfg.camera_fit_mode,
          aspect_ratio: item.aspect_ratio || cfg.camera_aspect_ratio,
        };
      })
      .filter(Boolean);
  }

  _activeCamera() {
    const cameras = this._cameras();
    if (!cameras.length) return null;
    const safeIndex = Math.max(0, Math.min(this._activeCameraIndex, cameras.length - 1));
    if (safeIndex !== this._activeCameraIndex) this._activeCameraIndex = safeIndex;
    return cameras[safeIndex];
  }

  async _ensureCameraCard(force = false, cameraGeneration = this._cameraGeneration) {
    if (!this._attached || !this._dialogOpen || cameraGeneration !== this._cameraGeneration) return;

    const config = this._config;
    const camera = this._activeCamera();
    if (!camera?.entity) return;
    if (!force && this._cameraCard && this._cameraCardEntity === camera.entity) return;

    const loadToken = ++this._cameraLoadToken;
    this._cameraCard = null;
    this._cameraCardEntity = null;
    this.requestUpdate();

    try {
      const helpers = await window.loadCardHelpers();
      const cameraCard = await helpers.createCardElement({
        type: "picture-entity",
        entity: camera.entity,
        camera_view: camera.camera_view || "live",
        fit_mode: camera.fit_mode || "cover",
        aspect_ratio: camera.aspect_ratio || "16:9",
        show_state: false,
        show_name: false,
        tap_action: { action: "more-info" },
      });

      if (
        loadToken !== this._cameraLoadToken ||
        !this._attached ||
        !this._dialogOpen ||
        cameraGeneration !== this._cameraGeneration ||
        config !== this._config ||
        this._activeCamera()?.entity !== camera.entity
      ) {
        return;
      }

      cameraCard.hass = this.hass;
      this._cameraCard = cameraCard;
      this._cameraCardEntity = camera.entity;
      this.requestUpdate();
    } catch (error) {
      if (
        loadToken !== this._cameraLoadToken ||
        !this._attached ||
        !this._dialogOpen ||
        cameraGeneration !== this._cameraGeneration ||
        config !== this._config
      ) return;
      this._error = `Impossible de charger la caméra ${camera.entity} : ${error?.message || error}`;
      this.requestUpdate();
    }
  }

  _destroyCameraCard() {
    this._cameraLoadToken += 1;
    this._cameraCard = null;
    this._cameraCardEntity = null;
  }

  _setActiveCamera(index) {
    const cameras = this._cameras();
    if (!cameras.length) return;
    const next = Math.max(0, Math.min(index, cameras.length - 1));
    if (next === this._activeCameraIndex && this._cameraCard) return;

    this._activeCameraIndex = next;
    this._destroyCameraCard();
    this._ensureCameraCard(true);
  }

  _advanceCamera(delta) {
    const cameras = this._cameras();
    if (cameras.length <= 1) return;
    const next = (this._activeCameraIndex + delta + cameras.length) % cameras.length;
    this._setActiveCamera(next);
  }

  _onTouchStart(event) {
    this._touchStartX = event.touches?.[0]?.clientX || 0;
  }

  _onTouchEnd(event) {
    const endX = event.changedTouches?.[0]?.clientX || 0;
    const delta = endX - this._touchStartX;
    if (Math.abs(delta) > 42) this._advanceCamera(delta < 0 ? 1 : -1);
  }

  _openDialog(updateHash = true) {
    this._dialogOpen = true;
    this._error = "";
    this._ensureCameraCard();

    if (updateHash && this._config?.popup_hash && window.location.hash !== this._config.popup_hash) {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${this._config.popup_hash}`,
      );
    }
  }

  _closeDialog(clearHash = true) {
    this._dialogOpen = false;
    this._destroyCameraCard();

    if (
      clearHash &&
      this._config?.clear_hash_on_close !== false &&
      this._config?.popup_hash &&
      window.location.hash === this._config.popup_hash
    ) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  _inferFixedService(entityId) {
    const domain = this._domain(entityId);
    if (domain === "switch") return "switch.toggle";
    if (domain === "button") return "button.press";
    if (domain === "input_button") return "input_button.press";
    return "homeassistant.toggle";
  }

  _actionPlan() {
    const entityId = this._config?.garage_entity;
    const domain = this._domain(entityId);
    const state = this._garageStateInfo();
    const commandAvailable = this._commandAvailable();

    if (!commandAvailable) {
      return {
        entityId,
        domain,
        service: "",
        intent: "unavailable",
        label: "Garage indisponible",
        icon: "mdi:garage-alert",
        cls: "command-action",
        disabled: true,
        expectedState: null,
      };
    }

    if (domain === "cover") {
      if (state.key === "closed") {
        return {
          entityId,
          domain,
          service: this._config.garage_open_service || "cover.open_cover",
          intent: "open",
          label: "Ouvrir garage",
          icon: "mdi:garage-open",
          cls: "open-action",
          disabled: false,
          expectedState: "open",
        };
      }
      if (state.key === "open") {
        return {
          entityId,
          domain,
          service: this._config.garage_close_service || "cover.close_cover",
          intent: "close",
          label: "Fermer garage",
          icon: "mdi:garage",
          cls: "close-action",
          disabled: false,
          expectedState: "closed",
        };
      }
      if (state.key === "opening" || state.key === "closing") {
        return {
          entityId,
          domain,
          service: this._config.garage_stop_service || "cover.stop_cover",
          intent: "stop",
          label: "Stop",
          icon: "mdi:stop-circle-outline",
          cls: "stop-action",
          disabled: false,
          expectedState: null,
        };
      }

      return {
        entityId,
        domain,
        service: this._config.garage_service || "cover.toggle",
        intent: "command",
        label: "Commander garage",
        icon: "mdi:garage-variant",
        cls: "command-action",
        disabled: false,
        expectedState: null,
      };
    }

    const fixedService = this._config.garage_service || this._inferFixedService(entityId);

    if (state.key === "opening" || state.key === "closing") {
      if (this._config.pulse_stop_enabled === true) {
        return {
          entityId,
          domain,
          service: fixedService,
          intent: "stop",
          label: "Stop",
          icon: "mdi:stop-circle-outline",
          cls: "stop-action",
          disabled: false,
          expectedState: null,
        };
      }

      return {
        entityId,
        domain,
        service: fixedService,
        intent: "moving",
        label: "Garage en mouvement",
        icon: "mdi:progress-clock",
        cls: "command-action",
        disabled: true,
        expectedState: null,
      };
    }

    if (state.key === "closed") {
      return {
        entityId,
        domain,
        service: fixedService,
        intent: "open",
        label: "Ouvrir garage",
        icon: "mdi:garage-open",
        cls: "open-action",
        disabled: false,
        expectedState: "open",
      };
    }

    if (state.key === "open") {
      return {
        entityId,
        domain,
        service: fixedService,
        intent: "close",
        label: "Fermer garage",
        icon: "mdi:garage",
        cls: "close-action",
        disabled: false,
        expectedState: "closed",
      };
    }

    return {
      entityId,
      domain,
      service: fixedService,
      intent: "command",
      label: "Commander garage",
      icon: "mdi:garage-variant",
      cls: "command-action",
      disabled: false,
      expectedState: null,
    };
  }

  _progressFeedback(intent) {
    if (intent === "open") {
      return { text: "Ouverture du garage…", cls: "warning", icon: "mdi:garage-open" };
    }
    if (intent === "close") {
      return { text: "Fermeture du garage…", cls: "warning", icon: "mdi:garage" };
    }
    if (intent === "stop") {
      return { text: "Arrêt du garage…", cls: "warning", icon: "mdi:stop-circle-outline" };
    }
    return { text: "Commande garage en cours…", cls: "info", icon: "mdi:garage-variant" };
  }

  _setFeedback(feedback, autoClearMs = 0) {
    if (this._feedbackTimer) {
      window.clearTimeout(this._feedbackTimer);
      this._feedbackTimer = null;
    }

    this._garageFeedback = feedback || null;
    if (feedback && autoClearMs > 0) {
      this._feedbackTimer = window.setTimeout(() => {
        this._garageFeedback = null;
        this._feedbackTimer = null;
        this.requestUpdate();
      }, autoClearMs);
    }
  }

  _releaseBusyAfter(delayMs, commandGeneration) {
    if (this._busyTimer) window.clearTimeout(this._busyTimer);
    const delay = Math.max(300, Number(delayMs || 2000));
    this._busyTimer = window.setTimeout(() => {
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      this._garageBusy = false;
      this._busyTimer = null;
      this.requestUpdate();
    }, delay);
  }

  _scheduleConfirmationTimeout(actionToken, commandGeneration) {
    if (this._confirmationTimer) window.clearTimeout(this._confirmationTimer);
    const timeout = Math.max(2000, Number(this._config.state_confirmation_timeout_ms || 25000));

    this._confirmationTimer = window.setTimeout(() => {
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      if (!this._pendingAction || this._pendingAction.token !== actionToken) return;
      this._pendingAction = null;
      this._confirmationTimer = null;
      this._setFeedback(
        {
          text: "Commande garage envoyée",
          meta: "État non confirmé",
          cls: "warning",
          icon: "mdi:alert-circle-outline",
        },
        Number(this._config.feedback_duration_ms || 2400),
      );
      this.requestUpdate();
    }, timeout);
  }

  _confirmPendingAction(stateKey) {
    const pending = this._pendingAction;
    if (!pending || !pending.expectedState || stateKey !== pending.expectedState) return;

    if (this._confirmationTimer) {
      window.clearTimeout(this._confirmationTimer);
      this._confirmationTimer = null;
    }

    this._pendingAction = null;
    const opened = stateKey === "open";
    this._setFeedback(
      {
        text: opened ? "Garage ouvert" : "Garage fermé",
        cls: "success",
        icon: opened ? "mdi:garage-open" : "mdi:garage",
      },
      Number(this._config.feedback_duration_ms || 2400),
    );
    this.requestUpdate();
  }

  _handlePendingStateUpdate(oldHass) {
    if (!this._pendingAction) return;

    const current = this._garageStateInfo(this.hass);
    const previous = this._garageStateInfo(oldHass);

    if (current.key === "unavailable") {
      if (this._confirmationTimer) {
        window.clearTimeout(this._confirmationTimer);
        this._confirmationTimer = null;
      }
      this._pendingAction = null;
      this._setFeedback(
        {
          text: "État du garage indisponible",
          cls: "error-state",
          icon: "mdi:alert-circle",
        },
        Number(this._config.feedback_duration_ms || 2400),
      );
      return;
    }

    if (
      current.key !== previous.key ||
      current.key !== this._pendingAction.initialState
    ) {
      this._confirmPendingAction(current.key);
    }
  }

  async _runGarageAction() {
    this._error = "";
    if (this._garageBusy) return;

    const plan = this._actionPlan();
    if (plan.disabled) {
      this._error = plan.label || "Garage indisponible";
      this.requestUpdate();
      return;
    }

    const [domain, serviceName] = String(plan.service || "").split(".");
    if (!domain || !serviceName) {
      this._error = `Service garage invalide : ${plan.service || "non défini"}`;
      this.requestUpdate();
      return;
    }

    const actionToken = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const commandGeneration = ++this._commandGeneration;
    const initialState = this._garageStateInfo().key;

    this._garageBusy = true;
    this._pendingAction = plan.expectedState
      ? {
          token: actionToken,
          expectedState: plan.expectedState,
          initialState,
          intent: plan.intent,
          startedAt: Date.now(),
          commandGeneration,
        }
      : null;

    if (this._config.action_feedback !== false) {
      this._setFeedback(this._progressFeedback(plan.intent));
    }
    this.requestUpdate();

    try {
      await this.hass.callService(domain, serviceName, {}, { entity_id: plan.entityId });
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      this._releaseBusyAfter(Number(this._config.action_lock_ms || 2000), commandGeneration);

      if (plan.expectedState) {
        if (this._pendingAction?.token === actionToken) {
          if (this._config.action_feedback !== false) {
            this._setFeedback({
              text: "Commande garage envoyée",
              meta: "Confirmation de l’état en attente",
              cls: "warning",
              icon: "mdi:progress-clock",
            });
          }
          this._scheduleConfirmationTimeout(actionToken, commandGeneration);
          this._confirmPendingAction(this._garageStateInfo().key);
        }
      } else {
        this._pendingAction = null;
        if (this._config.action_feedback !== false) {
          this._setFeedback(
            {
              text: plan.intent === "stop" ? "Commande d’arrêt envoyée" : "Commande garage envoyée",
              meta: "État physique non confirmé",
              cls: "info",
              icon: "mdi:send-check-outline",
            },
            Number(this._config.feedback_duration_ms || 2400),
          );
        }
      }
    } catch (error) {
      if (!this._attached || commandGeneration !== this._commandGeneration) return;
      if (this._confirmationTimer) {
        window.clearTimeout(this._confirmationTimer);
        this._confirmationTimer = null;
      }
      this._pendingAction = null;
      this._garageBusy = false;
      this._error = `Impossible de commander le garage : ${error?.message || error}`;
      this._setFeedback(
        {
          text: "Impossible de commander le garage",
          cls: "error-state",
          icon: "mdi:alert-circle",
        },
        Number(this._config.feedback_duration_ms || 2400),
      );
      this.requestUpdate();
    }
  }

  _vehicles() {
    const raw = Array.isArray(this._config?.vehicle_entities) ? this._config.vehicle_entities : [];
    return raw
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            key: `vehicle_${index}`,
            name: this._state(item)?.attributes?.friendly_name || `Véhicule ${index + 1}`,
            entity: item,
            icon: "mdi:car",
            present_state: "on",
            present_label: "Présent",
            absent_label: "Absent",
            unavailable_label: "Indisponible",
          };
        }

        const entity = item?.entity || item?.entity_id;
        if (!entity) return null;
        return {
          key: item.key || `vehicle_${index}`,
          name: item.name || this._state(entity)?.attributes?.friendly_name || `Véhicule ${index + 1}`,
          entity,
          count_entity: item.count_entity || "",
          icon: item.icon || "mdi:car",
          present_state: String(item.present_state ?? "on"),
          present_label: item.present_label || "Présent",
          absent_label: item.absent_label || "Absent",
          unavailable_label: item.unavailable_label || "Indisponible",
          detection_message: item.detection_message || `Voiture ${item.name || index + 1} détectée`,
        };
      })
      .filter(Boolean);
  }

  _vehicleInfo(vehicle, hass = this.hass) {
    const entity = this._state(vehicle.entity, hass);
    if (!entity || this._isUnavailableState(entity.state)) {
      return {
        ...vehicle,
        raw: entity?.state || "missing",
        key: "unavailable",
        text: vehicle.unavailable_label,
        cls: "unavailable",
        present: false,
        count: "",
      };
    }

    const present = String(entity.state) === String(vehicle.present_state);
    const countEntity = vehicle.count_entity ? this._state(vehicle.count_entity, hass) : null;
    const countRaw = countEntity && !this._isUnavailableState(countEntity.state) ? Number(countEntity.state) : NaN;
    const count = Number.isFinite(countRaw) && countRaw > 0 ? String(countRaw) : "";

    return {
      ...vehicle,
      raw: entity.state,
      key: present ? "present" : "absent",
      text: present ? vehicle.present_label : vehicle.absent_label,
      cls: present ? "present" : "absent",
      present,
      count,
    };
  }

  _detectionCandidates() {
    const candidates = [];

    if (this._config?.motion_entity) {
      candidates.push({
        entity: this._config.motion_entity,
        text: "Mouvement détecté",
        icon: "mdi:motion-sensor",
        cls: "warning",
        priority: 1,
      });
    }

    if (this._config?.person_entity) {
      candidates.push({
        entity: this._config.person_entity,
        text: "Personne détectée",
        icon: "mdi:account-alert",
        cls: "warning",
        priority: 2,
      });
    }

    for (const vehicle of this._vehicles()) {
      candidates.push({
        entity: vehicle.entity,
        activeState: vehicle.present_state,
        text: vehicle.detection_message,
        icon: vehicle.icon,
        cls: "info",
        priority: 3,
      });
    }

    return candidates;
  }

  _handleDetectionUpdates(oldHass) {
    const duration = Math.max(1000, Number(this._config?.event_message_duration_ms || 12000));
    const now = Date.now();
    const triggered = [];

    for (const candidate of this._detectionCandidates()) {
      const current = this._state(candidate.entity, this.hass);
      if (!current) continue;

      const activeState = String(candidate.activeState ?? "on");
      const active = String(current.state) === activeState;
      if (!active) continue;

      const previous = this._state(candidate.entity, oldHass);
      const transitioned = previous ? String(previous.state) !== activeState : false;
      const changedAt = Date.parse(current.last_changed || current.last_updated || "") || 0;
      const recentInitialState = !previous && changedAt > 0 && now - changedAt <= duration;

      if (transitioned || recentInitialState) {
        triggered.push({ ...candidate, changedAt });
      }
    }

    if (!triggered.length) return;

    triggered.sort((a, b) => (b.changedAt - a.changedAt) || (b.priority - a.priority));
    const selected = triggered[0];
    this._eventContext = {
      text: selected.text,
      cls: selected.cls,
      icon: selected.icon,
      entity: selected.entity,
      until: now + duration,
    };

    if (this._eventTimer) window.clearTimeout(this._eventTimer);
    this._eventTimer = window.setTimeout(() => {
      this._eventContext = null;
      this._eventTimer = null;
      this.requestUpdate();
    }, duration);
  }

  _events() {
    if (this._config?.show_snapshots === false) return [];

    const raw = Array.isArray(this._config?.event_entities) ? this._config.event_entities : [];
    const normalized = raw
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            key: `event_${index}`,
            name: this._state(item)?.attributes?.friendly_name || `Événement ${index + 1}`,
            entity: item,
            icon: "mdi:image",
          };
        }

        const entity = item?.entity || item?.entity_id;
        if (!entity) return null;
        return {
          key: item.key || `event_${index}`,
          name: item.name || this._state(entity)?.attributes?.friendly_name || `Événement ${index + 1}`,
          entity,
          icon: item.icon || "mdi:image",
        };
      })
      .filter(Boolean);

    // Alias pratiques pour de futures entités dédiées, sans imposer de placeholders.
    const aliases = [
      ["last_person_entity", "Dernière personne", "mdi:account-clock"],
      ["last_motion_entity", "Dernier mouvement", "mdi:motion-sensor"],
      ["last_vehicle_a_entity", "Véhicule A", "mdi:car"],
      ["last_vehicle_b_entity", "Véhicule B", "mdi:car-side"],
      ["last_car_entity", "Dernière voiture", "mdi:car-clock"],
    ];

    for (const [configKey, name, icon] of aliases) {
      const entity = this._config?.[configKey];
      if (entity && !normalized.some((item) => item.entity === entity)) {
        normalized.push({ key: configKey, name, entity, icon });
      }
    }

    return normalized;
  }

  _entityPicture(entityId) {
    const entity = this._state(entityId);
    const picture = entity?.attributes?.entity_picture;
    if (!picture) return "";

    const absolute = picture.startsWith("http") ? picture : `${window.location.origin}${picture}`;
    const separator = absolute.includes("?") ? "&" : "?";
    const version = encodeURIComponent(entity.last_updated || entity.last_changed || "");
    return `${absolute}${separator}garage_card_v=${version}`;
  }

  _formatEventTime(entityId) {
    const entity = this._state(entityId);
    if (!entity) return "";

    const stateTimestamp = !this._isUnavailableState(entity.state) && Number.isFinite(Date.parse(entity.state))
      ? entity.state
      : "";
    const raw = stateTimestamp || entity.last_changed || entity.last_updated;
    if (!raw) return "";

    try {
      return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(raw));
    } catch (_error) {
      return "";
    }
  }

  _showMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }));
  }

  _contextMessage() {
    if (this._error) {
      return {
        text: this._error,
        cls: "error-state",
        icon: "mdi:alert-circle",
      };
    }

    if (this._garageFeedback) return this._garageFeedback;

    if (!this._commandAvailable()) {
      return {
        text: "Garage indisponible",
        cls: "error-state",
        icon: "mdi:garage-alert",
      };
    }

    const state = this._garageStateInfo();
    if (state.key === "unavailable") {
      return {
        text: "État du garage indisponible",
        meta: "Commande toujours disponible",
        cls: "warning",
        icon: "mdi:alert-circle-outline",
      };
    }

    if (this._eventContext && this._eventContext.until > Date.now()) {
      return this._eventContext;
    }

    return null;
  }

  _clearAllTimers() {
    for (const timerName of ["_busyTimer", "_feedbackTimer", "_confirmationTimer", "_eventTimer"]) {
      if (this[timerName]) window.clearTimeout(this[timerName]);
      this[timerName] = null;
    }
  }

  _invalidateCommandCycle(clearFeedback = false) {
    this._commandGeneration += 1;
    this._clearAllTimers();
    this._garageBusy = false;
    this._pendingAction = null;
    if (clearFeedback) {
      this._garageFeedback = null;
      this._error = "";
    }
  }

  _renderIcon(icon, extraClass = "") {
    return html`<ha-icon class=${extraClass} .icon=${icon}></ha-icon>`;
  }

  _renderMainCard() {
    const status = this._garageStatus();
    const vehicles = this._vehicles().slice(0, 2).map((vehicle) => this._vehicleInfo(vehicle));

    return html`
      <ha-card
        role="button"
        tabindex="0"
        aria-label="Ouvrir la carte ${this._config.name}"
        @click=${() => this._openDialog(true)}
        @keydown=${(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this._openDialog(true);
          }
        }}
      >
        <div class="main-card ${status.cls}">
          <div class="icon-wrap">${this._renderIcon(status.icon || this._config.icon)}</div>
          <div>
            <div class="title">${this._config.name}</div>
            <div class="subtitle">${status.text}</div>
          </div>
          <div class="mini-vehicles" @click=${(event) => event.stopPropagation()}>
            ${vehicles.map((vehicle) => html`
              <button
                class="mini-vehicle ${vehicle.cls}"
                title="${vehicle.name} : ${vehicle.text}"
                aria-label="${vehicle.name} : ${vehicle.text}"
                @click=${() => this._showMoreInfo(vehicle.entity)}
              >
                ${this._renderIcon(vehicle.icon)}
                <span>${vehicle.name}</span>
              </button>
            `)}
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderCameraNav(cameras) {
    if (cameras.length <= 1) return "";

    return html`
      <div class="camera-nav">
        ${cameras.map((camera, index) => html`
          <button
            class="bullet ${index === this._activeCameraIndex ? "active" : ""}"
            title=${camera.name}
            aria-label="Afficher la caméra ${camera.name}"
            @click=${() => this._setActiveCamera(index)}
          ></button>
        `)}
      </div>
      <div class="camera-tabs">
        ${cameras.map((camera, index) => html`
          <button
            class="camera-tab ${index === this._activeCameraIndex ? "active" : ""}"
            @click=${() => this._setActiveCamera(index)}
          >
            ${this._renderIcon(camera.icon)} ${camera.name}
          </button>
        `)}
      </div>
    `;
  }

  _renderVehicles() {
    const vehicles = this._vehicles().map((vehicle) => this._vehicleInfo(vehicle));
    if (!vehicles.length) return "";

    return html`
      <div class="section">
        <div class="section-title">Présence véhicules</div>
        <div class="vehicle-grid">
          ${vehicles.map((vehicle) => html`
            <button
              class="vehicle-card ${vehicle.cls}"
              @click=${() => this._showMoreInfo(vehicle.entity)}
              title="Ouvrir les détails de ${vehicle.name}"
            >
              <span class="vehicle-icon">${this._renderIcon(vehicle.icon)}</span>
              <span>
                <span class="vehicle-name">${vehicle.name}</span>
                <span class="vehicle-state">
                  ${vehicle.text}${vehicle.count ? ` · ${vehicle.count}` : ""}
                </span>
              </span>
            </button>
          `)}
        </div>
      </div>
    `;
  }

  _renderEvents() {
    if (this._config.show_snapshots === false) return "";

    const events = this._events()
      .map((event) => ({
        ...event,
        picture: this._entityPicture(event.entity),
        time: this._formatEventTime(event.entity),
      }))
      .filter((event) => Boolean(event.picture));

    if (!events.length && this._config.show_empty_events !== true) return "";

    return html`
      <div class="section">
        <div class="section-title">Derniers événements</div>
        ${events.length ? html`
          <div class="event-grid ${events.length === 1 ? "single" : ""}">
            ${events.map((event) => html`
              <button
                class="snapshot"
                @click=${() => this._showMoreInfo(event.entity)}
                title="Ouvrir ${event.name}"
              >
                <img src=${event.picture} alt=${event.name} loading="lazy" />
                <div class="snapshot-label">
                  ${event.name}${event.time ? ` · ${event.time}` : ""}
                </div>
              </button>
            `)}
          </div>
        ` : html`
          <div class="empty-events">Aucun snapshot exploitable n’est actuellement disponible.</div>
        `}
      </div>
    `;
  }

  _renderDebug() {
    if (this._config.show_debug !== true) return "";

    const state = this._garageStateInfo();
    const plan = this._actionPlan();
    const activeCamera = this._activeCamera();
    const vehicles = this._vehicles().map((vehicle) => this._vehicleInfo(vehicle));
    const command = this._state(this._config.garage_entity);

    const debugData = {
      version: VERSION,
      command_entity: this._config.garage_entity,
      command_state: command?.state || "missing",
      command_available: this._commandAvailable(),
      action_service: plan.service || "none",
      action_intent: plan.intent,
      state_entity: state.entityId || "none",
      state_raw: state.raw || "none",
      state_interpreted: state.key,
      camera_active: activeCamera?.entity || "none",
      camera_index: `${this._activeCameraIndex + 1}/${this._cameras().length}`,
      busy: this._garageBusy,
      pending_expected_state: this._pendingAction?.expectedState || "none",
      feedback: this._garageFeedback?.text || "none",
      vehicles: Object.fromEntries(vehicles.map((vehicle) => [vehicle.name, vehicle.raw])),
      motion: this._config.motion_entity ? this._state(this._config.motion_entity)?.state || "missing" : "not configured",
      person: this._config.person_entity ? this._state(this._config.person_entity)?.state || "missing" : "not configured",
    };

    return html`
      <details class="debug">
        <summary>Debug garage-control-card</summary>
        <pre>${JSON.stringify(debugData, null, 2)}</pre>
      </details>
    `;
  }

  _renderDialog() {
    if (!this._dialogOpen) return "";

    const status = this._garageStatus();
    const cameras = this._cameras();
    const activeCamera = this._activeCamera();
    const action = this._actionPlan();
    const contextMessage = this._contextMessage();
    const liveBadgeDuration = Math.max(
      1000,
      Number(this._config.live_detection_badge_duration_ms || this._config.event_message_duration_ms || 12000),
    );
    const motion = this._config.show_motion_badge !== false &&
      this._isRecentlyActive(this._config.motion_entity, "on", liveBadgeDuration);
    const person = this._config.show_person_badge !== false && this._isOn(this._config.person_entity);
    const actionLabel = this._garageBusy && this._garageFeedback?.text
      ? this._garageFeedback.text
      : action.label;
    const actionIcon = this._garageBusy ? "mdi:loading" : action.icon;

    return html`
      <div class="overlay" @click=${() => this._closeDialog(true)}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${this._config.name} @click=${(event) => event.stopPropagation()}>
          <div class="dialog-header">
            <div class="dialog-title-row">
              <div class="icon-wrap ${status.cls}">${this._renderIcon(status.icon || this._config.icon)}</div>
              <div class="dialog-title-copy">
                <div class="title">${this._config.name}</div>
                <div class="status-pill ${status.cls}">
                  ${this._renderIcon(status.icon || this._config.icon)}
                  <span>${status.text}</span>
                </div>
              </div>
            </div>
            <button class="close-btn" @click=${() => this._closeDialog(true)} title="Fermer">
              ${this._renderIcon("mdi:close")}
            </button>
          </div>

          <div class="camera-section">
            <div class="camera-area" @touchstart=${this._onTouchStart} @touchend=${this._onTouchEnd}>
              ${this._cameraCard || html`
                <div class="camera-placeholder">
                  <div class="camera-placeholder-content">
                    ${this._renderIcon("mdi:camera")}
                    <span>Chargement de la caméra…</span>
                  </div>
                </div>
              `}
              ${activeCamera ? html`
                <div class="camera-overlay-label">
                  ${this._renderIcon(activeCamera.icon)} ${activeCamera.name}
                </div>
              ` : ""}
              ${(motion || person) ? html`
                <div class="camera-live-badges">
                  ${motion ? html`<span class="camera-live-badge active" title="Mouvement récent">${this._renderIcon("mdi:motion-sensor")}</span>` : ""}
                  ${person ? html`<span class="camera-live-badge active" title="Personne détectée">${this._renderIcon("mdi:account")}</span>` : ""}
                </div>
              ` : ""}
            </div>
            ${this._renderCameraNav(cameras)}
          </div>

          <div class="dialog-body">
            ${contextMessage ? html`
              <div class="message-zone">
                <div class="context-message ${contextMessage.cls || "info"}">
                  ${this._renderIcon(contextMessage.icon || "mdi:information-outline")}
                  <span>${contextMessage.text}</span>
                  ${contextMessage.meta ? html`<span class="context-meta">· ${contextMessage.meta}</span>` : ""}
                </div>
              </div>
            ` : ""}

            <div class="primary-action">
              <button
                class="button ${action.cls}"
                ?disabled=${action.disabled || this._garageBusy}
                @click=${() => this._runGarageAction()}
              >
                ${this._renderIcon(actionIcon, this._garageBusy ? "spin" : "")}
                ${actionLabel}
              </button>
            </div>

            ${this._renderVehicles()}
            ${this._renderEvents()}
            ${this._renderDebug()}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return html``;
    return html`${this._renderMainCard()}${this._renderDialog()}`;
  }
}

// Native HA form editor. It patches only fields emitted by ha-form so unknown
// YAML, false, zero and nested objects survive save/reopen cycles.
class GarageControlCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._generation = 0;
  }

  setConfig(config) {
    this._config = structuredClone(config || {});
    this._updateForm();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateForm();
  }

  connectedCallback() { this._mountForm(); }

  disconnectedCallback() {
    this._generation += 1;
    window.clearTimeout(this._waitTimer);
  }

  async _mountForm() {
    const generation = ++this._generation;
    this.shadowRoot.textContent = "Chargement de l’éditeur…";
    const ready = await Promise.race([
      customElements.whenDefined("ha-form").then(() => true),
      new Promise((resolve) => { this._waitTimer = window.setTimeout(() => resolve(false), 10000); }),
    ]);
    window.clearTimeout(this._waitTimer);
    if (!this.isConnected || generation !== this._generation) return;
    if (!ready) {
      this.shadowRoot.textContent = "Éditeur indisponible. Rouvrir la carte ou utiliser YAML.";
      return;
    }
    this._form = document.createElement("ha-form");
    this._form.addEventListener("value-changed", (event) => this._valueChanged(event));
    this.shadowRoot.replaceChildren(this._form);
    this._updateForm();
  }

  _updateForm() {
    if (!this._form) return;
    const { schema, computeLabel } = GarageControlCard.getConfigForm();
    this._form.hass = this._hass;
    this._form.schema = schema;
    this._form.computeLabel = computeLabel;
    this._formData = {
      ...GarageControlCard.getDefaultConfig(),
      ...structuredClone(this._config || {}),
    };
    this._form.data = structuredClone(this._formData);
  }

  _valueChanged(event) {
    event.stopPropagation();
    const data = event.detail?.value;
    if (!data || typeof data !== "object" || Array.isArray(data)) return;
    const { schema } = GarageControlCard.getConfigForm();
    const editable = new Set();
    const collect = (items) => items.forEach((item) => {
      if (item.selector) editable.add(item.name);
      if (item.schema) collect(item.schema);
    });
    collect(schema);
    const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
    const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
    const defaults = GarageControlCard.getDefaultConfig();
    const previous = this._formData || { ...defaults, ...this._config };
    const emitted = Object.keys(data).filter((key) => editable.has(key));
    const fullSnapshot = emitted.length > 1;
    const next = structuredClone(this._config || {});

    for (const key of editable) {
      if (own(data, key)) {
        if (same(data[key], previous[key])) continue;
        if (data[key] === undefined || (own(defaults, key) && same(data[key], defaults[key]))) delete next[key];
        else next[key] = structuredClone(data[key]);
      } else if (fullSnapshot && own(previous, key) && own(next, key)) {
        delete next[key];
      }
    }

    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: structuredClone(this._config) }, bubbles: true, composed: true,
    }));
    this._updateForm();
  }
}

if (!customElements.get("garage-control-card")) {
  customElements.define("garage-control-card", GarageControlCard);
}
if (!customElements.get("garage-control-card-editor")) {
  customElements.define("garage-control-card-editor", GarageControlCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "garage-control-card")) {
  window.customCards.push({
    type: "garage-control-card",
    name: "Garage Control Card",
    preview: true,
    description: "Carte garage mobile-first avec caméras, commande, présence véhicules et événements, sans SIP.",
    documentationURL: "https://github.com/smornierHA/ha-board/blob/main/docs/CARDS.md#garage-control-card",
  });
}

console.info(
  `%c GARAGE-CONTROL-CARD %c v${VERSION}`,
  "color: white; background: #2196f3; font-weight: 700; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #2196f3; background: rgba(33, 150, 243, 0.12); font-weight: 700; padding: 2px 6px; border-radius: 0 4px 4px 0;",
);
