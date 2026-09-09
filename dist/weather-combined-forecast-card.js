/* HA-BOARD weather candidate 0.2.0-rc.1; see THIRD-PARTY-NOTICES.md and docs/WEATHER-PROVENANCE.md.
 * Modified from the private project source: lifecycle, editor, validation and packaging changes.
 * Home Assistant frontend weather icon paths are provided under Apache-2.0; notice distributed alongside this file.
 */

// weather-combined-forecast-card-v1.17.10.js
// HA-Carte météo — Weather Forecast Combined V1.9.4.2.10
// Corrective directe :
// - zone graphique unifiée Température + Pluie, sans tuiles internes ;
// - timeline commune avec colonne actuelle "Maint." corrigée ;
// - suppression de la ligne horizontale sous les heures ;
// - séparateurs verticaux pointillés ;
// - température affichée à chaque colonne + ligne segmentée colorée ;
// - pluie en vraies barres de graphe, valeur/proba masquées si 0 ;
// - vent compact réaligné sur la logique Wind Forecast : orientation house/standard/custom,
//   bearing_rotation, arrow_mode travel/source, bulle lisible, rafales masquées si 0 ;
// - scroll horizontal stable, position préservée entre rendus ;
// - fond iOS météo intégré de manière subtile.
// - V1.9.3.5 : coloration risque restaurée sur la girouette + icônes météo agrandies/alignées.
// - V1.9.3.6 : police agrandie, retour aux icônes météo v1.4 agrandies, graphe plus compact, girouette affinée.
// - V1.9.3.7 : icônes météo normalisées façon ha-weather-forecast-card, amplitude température recalculée, valeurs pluie sous abscisse.
// - V1.9.3.8 : retour aux icônes météo type bouton météo / ha-weather-forecast-card, suppression de la ligne horizontale pointillée parasite, infos pluie placées entre graphe et vent.
// - V1.9.3.9 : amplitude température recalée sur min/max visibles, barres pluie depuis la baseline, zone mm/% permanente et coins arrondis mobile verrouillés.
// - V1.9.3.10 : abscisse replacée à la base des barres, infos pluie compactes sous abscisse, marqueurs J+1 / lever / coucher du soleil.
// - V1.9.3.11 : séparateurs verticaux adoucis/raccourcis, abscisse allégée, pills jour/Maint. en bleu, lever orange et coucher bleu-violet.
// - V1.9.3.12 : séparateurs pointillés renforcés/prolongés jusqu’aux infos pluie, correction proba forecast Météo-France rain_probability_3h.
// - V1.9.3.13 : pointillés unifiés au-dessus et sous l’abscisse avec le même motif, alignés façon ha-weather-forecast-card.
// - V1.9.3.14 : pointillés rendus par un unique calque SVG continu pour supprimer le flou/différence entre haut et bas.
// - V1.9.4.0 : header optionnel et paramétrable, météo actuelle, température et résumé, body forecast préservé.
// - V1.9.4.0.1 : header intégré sans sous-tuile, icône météo principale agrandie, température sans capsule et jauge min/max fine.
// - V1.9.4.0.2 : header recomposé à gauche, température + résumé près de l’icône, jauge min/max renforcée et alignement icône corrigé.
// - V1.9.4.0.3 : correction ciblée de la palette de la jauge min/max, alignée sur la logique couleur température.
// - V1.9.4.0.4 : correction jauge uniquement : palette iOS bleu pastel → blanc, point actuel blanc, min/max calculés sur 00:00–23:59 quand disponible.
// - V1.9.4.0.5 : correction jauge uniquement : libellés min/max bleu pastel/blanc, curseur blanc, barre en dégradé température, min/max journée complète sans fallback “maintenant → fin de journée”.
// - V1.9.4.0.6 : correction jauge uniquement : logique simplifiée façon clock-weather-card, min/max via daily forecast de weather_entity (templow/temperature) par défaut, entités custom uniquement en surcharge explicite.
// - V1.9.4.0.7 : correction jauge uniquement : gradient de jauge basé sur les mêmes seuils/couleurs que la courbe température et positions réelles des seuils, libellés sobres, min/max daily stricts.
// - V1.9.4.0.8 : correction jauge uniquement : répartition de gradient alignée sur la philosophie clock-weather-card avec interpolation réelle des couleurs de température.
// - V1.9.4.0.9 : correction jauge uniquement : gradient par bandes thermiques réelles, avec transitions courtes aux seuils, pour éviter une dominante froide sur les journées chaudes.
// - V1.9.4.0.10 : correction jauge uniquement : gradient continu façon clock-weather-card, stops aux seuils thermiques réels, retour du jaune et transitions fondues.
// - V1.9.4.1 : ajout des pills de risques actuels dans le header, conditionnelles et alignées Bubble/iOS.
// - V1.9.4.1.1 : correction pills header : entity optionnel, level_entity utilisable seul, exemples sans binary inutiles + Volets.
// - V1.9.4.1.2 : correction pills header : support réel sensor.example_reference_7 (ok/surveiller/fermer), level_attribute/active_attribute/message_attribute, suppression du violet par défaut.
// - V1.9.4.2 : architecture risk chips : adaptateur vigilance météo basé sur weather-alert-pills-card-v3.js + moteur générique séparé.
// - V1.9.4.2.1 : rendu risk chips en vignettes slider plus lisibles, hiérarchie titre/sous-titre, tri priorité préservé.
// - V1.9.4.2.2 : corrective UX risk chips : gabarit plus compact type Portail/SIP, ligne secondaire paramétrable, action header principale configurable.
// - V1.9.4.2.3 : corrective risk footer : pills plus compactes, ligne secondaire strictement paramétrable, slider déplacé en footer dédié.
// - V1.9.4.2.4 : scroll secondaire Bubble-like, centrage icône, mode risk_display_mode footer/header_sub_buttons.
// - V1.9.4.2.5 : header_sub_buttons réaligné strictement sur la DA SIP/Portail : boutons ronds 36x36, icône seule, actions à droite, mode footer inchangé.
// - V1.9.4.2.10 : repart strictement de v1.17.5 ; les header_sub_buttons reprennent les couleurs de référence du footer v1.17.5, sans reprendre les palettes v1.17.6–v1.17.9.

class WeatherCombinedForecastCard extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._dragState = null;
    this._scrollLeft = 0;
    this._lastRenderKey = "";
    this._isInteracting = false;
    this._pendingRender = false;
    this._dailyForecasts = [];
    this._dailyForecastEntity = "";
    this._dailyForecastUnsubscribe = null;
    this._dailyForecastSubscriptionPending = false;
    this._forecastGeneration = 0;
    this._forecastConnection = null;
    this._frames = new Set();
    this._timers = new Set();
  }

  static getDefaultConfig() {
    return {
      title: "Prévisions météo",
      show_title: true,
      show_header: true,
      header_mode: "compact",
      show_header_title: true,
      show_current_weather_icon: true,
      show_current_temperature: true,
      show_current_summary: true,
      show_header_temperature_range: true,
      show_header_metrics: false,
      show_current_risk_pills: true,
      show_header_risk_pills: true,
      show_alerts_footer: true,
      alerts_footer_position: "bottom",
      alerts_footer_align: "start",
      alerts_footer_scroll: true,
      risk_display_mode: "footer",
      header_risk_sub_buttons_show_label: false,
      header_risk_sub_buttons_show_icon: true,
      header_risk_sub_buttons_max_items: 4,
      header_risk_sub_buttons: { show_label: false, show_tooltip: true, size: 36, gap: 8 },
      secondary_line_scroll_speed: "bubble",
      main_header_tap_action: { action: "navigate", navigation_path: "#meteo" },
      risk_entities: [],
      current_risk_entities: [],
      current_temperature_entity: "",
      current_min_temperature_entity: "",
      current_max_temperature_entity: "",
      current_summary_entity: "",
      forecast_entity: "sensor.example_hourly",
      forecast_attribute: "forecast",
      weather_entity: "weather.example",
      sun_entity: "sun.sun",
      hours_to_show: 12,
      show_current: true,
      probability_entity: "sensor.example_rain_probability",
      probability_attribute: "forecast",
      probability_match_mode: "window",
      probability_window_hours: 3,
      bearing_reference_mode: "house",
      bearing_rotation: -50,
      include_past_current_slot: true,
      highlight_day_changes: true,
      show_sun_markers: true,
      solar_marker_tolerance_minutes: 75,
      datetime_key: "datetime",
      temperature_key: "temperature",
      precipitation_key: "precipitation",
      primary_probability_key: "precipitation_probability",
      wind_speed_key: "wind_speed",
      wind_gust_speed_key: "wind_gust_speed",
      wind_bearing_key: "wind_bearing",
      show_temperature: true,
      show_wind: true,
      show_rain: true,
      show_probability: "auto",
      probability_datetime_key: "datetime",
      probability_value_key: "rain_probability_3h",
      probability_max_delta_hours: 3,
      secondary_sources: {
        probability: {
          entity: "sensor.example_rain_probability",
          attribute: "forecast",
          datetime_key: "datetime",
          value_key: "rain_probability_3h",
          match_mode: "window",
          window_hours: 3,
          max_delta_hours: 3,
        },
      },
      bearing_house_rotation: -50,
      bearing_arrow_mode: "travel",
      wind_reference_threshold_entity: "input_number.example_wind_threshold",
      wind_reference_threshold_fallback: 35,
      gust_reference_threshold_entity: "input_number.example_gust_threshold",
      gust_reference_threshold_fallback: 45,
      intensity_close_ratio: 1.10,
      intensity_strong_ratio: 1.30,
      item_width: 68,
      chart_height: 80,
      forecast_icon_size: 28,
      wind_row_height: 44,
      precipitation_unit: "mm",
      temperature_unit: "°C",
      wind_unit: "km/h",
      highlight_current: true,
      weather_background_opacity: 0.58,
      weather_background_speed: 0.9,
      empty_label: "Aucune prévision disponible",
    };
  }

  static getStubConfig() { return this.getDefaultConfig(); }

  static getConfigElement() { return document.createElement("weather-combined-forecast-editor"); }

  static getConfigForm() {
    const visibilityOptions = [
      { value: "auto", label: "Auto" },
      { value: "true", label: "Toujours" },
      { value: "false", label: "Jamais" },
    ];
    const matchOptions = [
      { value: "window", label: "Fenêtre" },
      { value: "exact", label: "Exact" },
      { value: "nearest", label: "Plus proche" },
    ];
    const orientationOptions = [
      { value: "house", label: "Maison / portail" },
      { value: "standard", label: "Standard" },
      { value: "custom", label: "Personnalisé" },
    ];
    return {
      schema: [
        ...[
  {
    "type": "expandable",
    "name": "header_editor",
    "title": "En-tête et actions",
    "flatten": true,
    "schema": [
      {
        "name": "show_header",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "header_mode",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "show_header_title",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_current_weather_icon",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_current_temperature",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_current_summary",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_header_temperature_range",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_header_metrics",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "main_header_tap_action",
        "selector": {
          "object": {}
        }
      },
      {
        "name": "current_temperature_entity",
        "selector": {
          "entity": {}
        }
      },
      {
        "name": "current_min_temperature_entity",
        "selector": {
          "entity": {}
        }
      },
      {
        "name": "current_max_temperature_entity",
        "selector": {
          "entity": {}
        }
      },
      {
        "name": "current_summary_entity",
        "selector": {
          "entity": {}
        }
      },
      {
        "name": "header_tap_action",
        "selector": {
          "object": {}
        }
      }
    ]
  },
  {
    "type": "expandable",
    "name": "risks_editor",
    "title": "Risques, alertes et actions",
    "flatten": true,
    "schema": [
      {
        "name": "show_current_risk_pills",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_header_risk_pills",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_alerts_footer",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "alerts_footer_position",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "alerts_footer_align",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "alerts_footer_scroll",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "risk_display_mode",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "header_risk_sub_buttons_show_label",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "header_risk_sub_buttons_show_icon",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "header_risk_sub_buttons_max_items",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "header_risk_sub_buttons",
        "selector": {
          "object": {}
        }
      },
      {
        "name": "secondary_line_scroll_speed",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "risk_entities",
        "selector": {
          "object": {}
        }
      },
      {
        "name": "current_risk_entities",
        "selector": {
          "object": {}
        }
      }
    ]
  },
  {
    "type": "expandable",
    "name": "advanced_editor",
    "title": "Options avancées",
    "flatten": true,
    "schema": [
      {
        "name": "include_past_current_slot",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "highlight_day_changes",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_sun_markers",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "solar_marker_tolerance_minutes",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "datetime_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "temperature_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "precipitation_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "primary_probability_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "wind_speed_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "wind_gust_speed_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "wind_bearing_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "show_temperature",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "show_rain",
        "selector": {
          "boolean": {}
        }
      },
      {
        "name": "probability_datetime_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "probability_value_key",
        "selector": {
          "text": {}
        }
      },
      {
        "name": "secondary_sources",
        "selector": {
          "object": {}
        }
      },
      {
        "name": "bearing_house_rotation",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "wind_reference_threshold_fallback",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "gust_reference_threshold_fallback",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "intensity_close_ratio",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "intensity_strong_ratio",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "item_width",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "chart_height",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "forecast_icon_size",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "wind_row_height",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "weather_background_opacity",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "weather_background_speed",
        "selector": {
          "number": {
            "mode": "box",
            "step": 0.01
          }
        }
      },
      {
        "name": "empty_label",
        "selector": {
          "text": {}
        }
      }
    ]
  }
],
        { name: "title", selector: { text: {} } },
        { name: "show_title", selector: { boolean: {} } },
        { name: "show_current", selector: { boolean: {} } },
        { name: "highlight_current", selector: { boolean: {} } },
        {
          type: "expandable",
          name: "forecast_editor",
          title: "Prévisions",
          flatten: true,
          schema: [
            { name: "forecast_entity", required: true, selector: { entity: { domain: "sensor" } } },
            { name: "forecast_attribute", selector: { text: {} } },
            { name: "weather_entity", selector: { entity: { domain: "weather" } } },
            { name: "sun_entity", selector: { entity: { domain: "sun" } } },
            { name: "hours_to_show", selector: { number: { min: 3, max: 48, step: 1, mode: "box" } } },
          ],
        },
        {
          type: "expandable",
          name: "probability_editor",
          title: "Probabilité pluie",
          flatten: true,
          schema: [
            { name: "show_probability", selector: { select: { options: visibilityOptions } } },
            { name: "probability_entity", selector: { entity: { domain: "sensor" } } },
            { name: "probability_attribute", selector: { text: {} } },
            { name: "probability_match_mode", selector: { select: { options: matchOptions } } },
            { name: "probability_window_hours", selector: { number: { min: 1, max: 24, step: 1, mode: "box" } } },
            { name: "probability_max_delta_hours", selector: { number: { min: 0, max: 24, step: 1, mode: "box" } } },
          ],
        },
        {
          type: "expandable",
          name: "wind_editor",
          title: "Vent compact",
          flatten: true,
          schema: [
            { name: "show_wind", selector: { boolean: {} } },
            { name: "bearing_reference_mode", selector: { select: { options: orientationOptions } } },
            { name: "bearing_rotation", selector: { number: { min: -180, max: 180, step: 1, mode: "box" } } },
            { name: "bearing_arrow_mode", selector: { select: { options: [ { value: "travel", label: "Sens du vent" }, { value: "source", label: "Provenance" } ] } } },
            { name: "wind_reference_threshold_entity", selector: { entity: { domain: "input_number" } } },
            { name: "gust_reference_threshold_entity", selector: { entity: { domain: "input_number" } } },
          ],
        },
      ],
      computeLabel: (schema) => {
        const labels = {
          title: "Titre",
          show_title: "Afficher le titre",
          show_current: "Afficher Maint.",
          highlight_current: "Mettre en évidence Maint.",
          forecast_entity: "Entité forecast",
          forecast_attribute: "Attribut forecast",
          weather_entity: "Entité météo actuelle",
          sun_entity: "Entité soleil",
          hours_to_show: "Heures affichées",
          show_probability: "Afficher la probabilité",
          probability_entity: "Entité probabilité",
          probability_attribute: "Attribut probabilité",
          probability_match_mode: "Matching temporel",
          probability_window_hours: "Fenêtre (h)",
          probability_max_delta_hours: "Tolérance nearest (h)",
          show_wind: "Afficher le vent",
          bearing_reference_mode: "Mode d’orientation",
          bearing_rotation: "Rotation personnalisée",
          bearing_arrow_mode: "Sens de la flèche",
          wind_reference_threshold_entity: "Seuil référence vent",
          gust_reference_threshold_entity: "Seuil référence rafales",
        };
        const fallback = String(schema.name || "Option")
          .replaceAll("_", " ")
          .replace(/^./, char => char.toUpperCase());
        return labels[schema.name] || schema.label || fallback;
      },
    };
  }

  setConfig(config) {
    const incoming = config || {};
    const legacyProbabilitySource = {
      entity: incoming.probability_entity,
      attribute: incoming.probability_attribute,
      datetime_key: incoming.probability_datetime_key,
      value_key: incoming.probability_value_key,
      match_mode: incoming.probability_match_mode,
      window_hours: incoming.probability_window_hours,
      max_delta_hours: incoming.probability_max_delta_hours,
    };

    const defaults = WeatherCombinedForecastCard.getDefaultConfig();
    this.config = {
      ...defaults,
      ...incoming,
    };

    this.config.secondary_sources = this._mergeSecondarySources(
      defaults.secondary_sources,
      this.config.secondary_sources,
      legacyProbabilitySource,
    );

    this._ensureDailyForecastSubscription();
    this.renderCard(true);
  }

  set hass(hass) {
    this._hass = hass;
    this._ensureDailyForecastSubscription();
    this.renderCard();
  }

  connectedCallback() {
    this._ensureDailyForecastSubscription();
    this.renderCard(true);
  }

  disconnectedCallback() {
    this._unbindForecastConnection();
    this._unsubscribeDailyForecast();
    for (const id of this._frames) cancelAnimationFrame(id);
    for (const id of this._timers) clearTimeout(id);
    this._frames.clear();
    this._timers.clear();
    this._dragState = null;
    this._isInteracting = false;
    this._pendingRender = false;
  }

  _queueFrame(callback) {
    const id = requestAnimationFrame(() => {
      this._frames.delete(id);
      if (this.isConnected) callback();
    });
    this._frames.add(id);
  }

  _queueTimeout(callback, delay) {
    const id = setTimeout(() => {
      this._timers.delete(id);
      if (this.isConnected) callback();
    }, delay);
    this._timers.add(id);
  }

  getCardSize() { return 5; }

  _mergeSecondarySources(baseSources, configuredSources, legacyProbabilitySource) {
    const incomingSources = configuredSources && typeof configuredSources === "object" ? configuredSources : {};
    const probabilityFromLegacy = this._compactObject({
      entity: legacyProbabilitySource.entity,
      attribute: legacyProbabilitySource.attribute,
      datetime_key: legacyProbabilitySource.datetime_key,
      value_key: legacyProbabilitySource.value_key,
      match_mode: legacyProbabilitySource.match_mode,
      window_hours: legacyProbabilitySource.window_hours,
      max_delta_hours: legacyProbabilitySource.max_delta_hours,
    });
    return {
      probability: {
        ...(baseSources.probability || {}),
        ...(incomingSources.probability || {}),
        ...probabilityFromLegacy,
      },
      ...Object.fromEntries(Object.entries(incomingSources).filter(([key]) => key !== "probability")),
    };
  }

  _compactObject(obj) {
    return Object.fromEntries(Object.entries(obj || {}).filter(([, value]) => value !== undefined && value !== null && value !== ""));
  }

  _state(entityId) { return this._hass?.states?.[entityId]; }

  _escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  _toNumber(value, fallback = null) {
    if (value === null || value === undefined || typeof value === "boolean") return fallback;
    if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
    if (typeof value !== "string") return fallback;
    const raw = value.trim().replace(",", ".").match(/^(-?\d+(?:\.\d+)?)(?:\s*(?:°[CF]?|%|mm|cm|m|km\/h|m\/s|mph|hPa))?$/i);
    if (!raw) return fallback;
    const n = Number(raw[1]);
    return Number.isFinite(n) ? n : fallback;
  }

  _formatNumber(value, digits = 1, fallback = "—") {
    const n = this._toNumber(value, null);
    if (!Number.isFinite(n)) return fallback;
    return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(n);
  }

  _arrayAttribute(entityId, attribute) {
    const st = this._state(entityId);
    if (!st) return [];
    const raw = st.attributes?.[attribute];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (_err) { return []; }
    }
    return [];
  }

  _weatherLegacyForecastRows() {
    const raw = this._state(this.config?.weather_entity)?.attributes?.forecast;
    return Array.isArray(raw) ? raw : [];
  }

  _weatherDailyForecastRows() {
    return Array.isArray(this._dailyForecasts) && this._dailyForecasts.length
      ? this._dailyForecasts
      : this._weatherLegacyForecastRows();
  }

  _releaseForecast(unsubscribe) {
    if (typeof unsubscribe !== "function") return;
    try { Promise.resolve(unsubscribe()).catch(() => {}); }
    catch (_err) { /* connection already closed */ }
  }

  _unsubscribeDailyForecast() {
    ++this._forecastGeneration;
    this._releaseForecast(this._dailyForecastUnsubscribe);
    this._dailyForecastUnsubscribe = null;
    this._dailyForecastSubscriptionPending = false;
    this._dailyForecastEntity = "";
    this._dailyForecasts = [];
  }

  _unbindForecastConnection() {
    this._forecastConnection?.removeEventListener?.("ready", this._onForecastReady);
    this._forecastConnection?.removeEventListener?.("disconnected", this._onForecastDisconnected);
    this._forecastConnection = null;
  }

  _ensureDailyForecastSubscription() {
    const connection = this._hass?.connection;
    const entityId = this.config?.weather_entity;
    if (!this.isConnected || !entityId || !connection?.subscribeMessage) {
      this._unbindForecastConnection();
      this._unsubscribeDailyForecast();
      return;
    }
    if (this._forecastConnection !== connection) {
      this._unbindForecastConnection();
      this._unsubscribeDailyForecast();
      this._forecastConnection = connection;
      this._onForecastReady = () => {
        this._unsubscribeDailyForecast();
        this._ensureDailyForecastSubscription();
      };
      this._onForecastDisconnected = () => this._unsubscribeDailyForecast();
      connection.addEventListener?.("ready", this._onForecastReady);
      connection.addEventListener?.("disconnected", this._onForecastDisconnected);
    }
    if (connection.connected === false) return;
    if (this._dailyForecastEntity === entityId &&
        (this._dailyForecastUnsubscribe || this._dailyForecastSubscriptionPending)) return;
    this._unsubscribeDailyForecast();
    this._dailyForecastEntity = entityId;
    const generation = this._forecastGeneration;
    const current = () => this.isConnected && generation === this._forecastGeneration &&
      this._forecastConnection === connection && this.config?.weather_entity === entityId;
    this._dailyForecastSubscriptionPending = true;
    // Capture synchronous failures as well as late promise resolution/rejection.
    Promise.resolve().then(() => {
      if (!current()) return null;
      return connection.subscribeMessage((event) => {
        if (!current()) return;
        this._dailyForecasts = Array.isArray(event?.forecast) ? event.forecast.filter(row => row && typeof row === "object") : [];
        this.renderCard(true);
      }, { type: "weather/subscribe_forecast", forecast_type: "daily", entity_id: entityId },
      { resubscribe: false });
    }).then((unsubscribe) => {
      if (!current()) { this._releaseForecast(unsubscribe); return; }
      this._dailyForecastUnsubscribe = unsubscribe;
    }).catch(() => {
      // Unsupported provider: retain the explicit legacy forecast fallback.
    }).finally(() => {
      if (current()) this._dailyForecastSubscriptionPending = false;
    });
  }

  _rawForecastRows() {
    return this._arrayAttribute(this.config.forecast_entity, this.config.forecast_attribute)
      .map((item) => this._normalizeForecastItem(item))
      .filter((item) => Number.isFinite(item.datetimeMs))
      .sort((a, b) => a.datetimeMs - b.datetimeMs);
  }

  _forecastEntries() {
    const rows = this._rawForecastRows();
    const now = Date.now();
    const currentHourStart = new Date();
    currentHourStart.setMinutes(0, 0, 0);
    const currentStartMs = currentHourStart.getTime();
    const max = Math.max(3, Number(this.config.hours_to_show) || 12);
    const showCurrent = this.config.show_current !== false;

    if (showCurrent) {
      const currentForecast = rows.find((item) => item.datetimeMs <= now && now < item.datetimeMs + 3600000)
        || rows.find((item) => item.datetimeMs === currentStartMs)
        || rows.find((item) => item.datetimeMs >= currentStartMs)
        || null;
      const currentEntry = this._currentEntryFromWeather(currentForecast);
      const futureRows = rows.filter((item) => item.datetimeMs > currentStartMs).slice(0, Math.max(1, max - 1));
      return [currentEntry, ...futureRows];
    }

    const lowerBound = this.config.include_past_current_slot === false ? now : currentStartMs;
    return rows.filter((item) => item.datetimeMs >= lowerBound).slice(0, max);
  }

  _currentEntryFromWeather(fallbackItem) {
    const st = this._state(this.config.weather_entity);
    const attrs = st?.attributes || {};
    const now = new Date();
    const currentHourStart = new Date(now);
    currentHourStart.setMinutes(0, 0, 0);
    const fallback = fallbackItem || {};
    const probabilityState = this._toNumber(this._state(this.config.probability_entity)?.state, null);
    return {
      raw: { current: true, fallback: fallback.raw || null },
      datetimeRaw: now.toISOString(),
      datetimeMs: currentHourStart.getTime(),
      date: now,
      temperature: this._toNumber(attrs.temperature, fallback.temperature ?? null),
      precipitation: this._toNumber(attrs.precipitation ?? attrs.rain ?? attrs.precipitation_amount, fallback.precipitation ?? 0),
      probability: this._toNumber(attrs.precipitation_probability, Number.isFinite(probabilityState) ? probabilityState : (fallback.probability ?? null)),
      windSpeed: this._toNumber(attrs.wind_speed, fallback.windSpeed ?? null),
      windGust: this._toNumber(attrs.wind_gust_speed, fallback.windGust ?? null),
      windBearing: this._normalizeAngle(this._toNumber(attrs.wind_bearing, fallback.windBearing ?? null)),
      condition: st?.state || fallback.condition || null,
      isNowColumn: true,
      metricSources: {
        temperature: Number.isFinite(this._toNumber(attrs.temperature, null)) ? "weather" : (fallback.metricSources?.temperature || "none"),
        precipitation: Number.isFinite(this._toNumber(attrs.precipitation ?? attrs.rain ?? attrs.precipitation_amount, null)) ? "weather" : (fallback.metricSources?.precipitation || "none"),
        probability: Number.isFinite(this._toNumber(attrs.precipitation_probability, null)) ? "weather" : (Number.isFinite(probabilityState) ? "probability-state" : (fallback.metricSources?.probability || "none")),
        wind: Number.isFinite(this._toNumber(attrs.wind_speed, null)) ? "weather" : (fallback.metricSources?.wind || "none"),
      },
    };
  }

  _normalizeForecastItem(raw) {
    const cfg = this.config;
    const dtRaw = raw?.[cfg.datetime_key];
    const date = dtRaw ? new Date(dtRaw) : null;
    const datetimeMs = date && !Number.isNaN(date.getTime()) ? date.getTime() : NaN;
    const tempRaw = this._toNumber(raw?.[cfg.temperature_key], null);
    const precipRaw = this._toNumber(raw?.[cfg.precipitation_key], null);
    const probabilityRaw = this._toNumber(raw?.[cfg.primary_probability_key], null);
    return {
      raw,
      datetimeRaw: dtRaw,
      datetimeMs,
      date,
      temperature: tempRaw,
      precipitation: precipRaw,
      probability: probabilityRaw,
      windSpeed: this._toNumber(raw?.[cfg.wind_speed_key], null),
      windGust: this._toNumber(raw?.[cfg.wind_gust_speed_key], null),
      windBearing: this._normalizeAngle(this._toNumber(raw?.[cfg.wind_bearing_key], null)),
      condition: raw?.condition || raw?.weather_condition || null,
      isNowColumn: false,
      metricSources: {
        temperature: Number.isFinite(tempRaw) ? "primary" : "none",
        precipitation: Number.isFinite(precipRaw) ? "primary" : "none",
        probability: Number.isFinite(probabilityRaw) ? "primary" : "none",
        wind: "primary",
      },
    };
  }

  _secondarySourceConfig(metric) {
    const expert = this.config.secondary_sources?.[metric];
    if (expert && typeof expert === "object") return expert;
    if (metric === "probability") {
      return {
        entity: this.config.probability_entity,
        attribute: this.config.probability_attribute,
        datetime_key: this.config.probability_datetime_key,
        value_key: this.config.probability_value_key,
        match_mode: this.config.probability_match_mode,
        window_hours: this.config.probability_window_hours,
        max_delta_hours: this.config.probability_max_delta_hours,
      };
    }
    return null;
  }

  _secondarySourcePoints(sourceConfig) {
    if (!sourceConfig?.entity || !sourceConfig?.attribute || !sourceConfig?.datetime_key) return [];
    return this._arrayAttribute(sourceConfig.entity, sourceConfig.attribute)
      .map((point) => {
        const dtRaw = point?.[sourceConfig.datetime_key];
        const date = dtRaw ? new Date(dtRaw) : null;
        const datetimeMs = date && !Number.isNaN(date.getTime()) ? date.getTime() : NaN;
        const resolved = this._secondaryMetricValue(point, sourceConfig);
        return { raw: point, datetimeRaw: dtRaw, datetimeMs, value: resolved.value, valueKey: resolved.key };
      })
      .filter((point) => Number.isFinite(point.datetimeMs) && Number.isFinite(point.value))
      .sort((a, b) => a.datetimeMs - b.datetimeMs);
  }

  _secondaryMetricValue(point, sourceConfig) {
    const preferred = sourceConfig?.value_key || "rain_probability_3h";
    const configuredKeys = Array.isArray(sourceConfig?.value_keys) ? sourceConfig.value_keys : [];
    const keys = [
      preferred,
      ...configuredKeys,
      "rain_probability_3h",
      "precipitation_probability",
      "probability",
      "rain_chance",
      "chance",
    ].filter(Boolean);
    const uniqueKeys = [...new Set(keys)];
    const candidates = uniqueKeys
      .map((key) => ({ key, value: this._toNumber(point?.[key], null) }))
      .filter((candidate) => Number.isFinite(candidate.value));
    if (!candidates.length) return { value: null, key: "none" };

    // Pour `sensor.example_rain_probability`, l’attribut `probability`
    // peut rester à 0 alors que `rain_probability_3h` contient la prévision utile.
    // On privilégie donc une valeur positive si la clé préférée est absente ou vaut 0.
    const positive = candidates.find((candidate) => candidate.value > 0);
    if (positive) return positive;
    return candidates[0];
  }

  _secondaryValueForItem(item, sourceConfig, points) {
    if (!sourceConfig || !points?.length || !Number.isFinite(item.datetimeMs)) return { value: null, source: "none" };
    const mode = String(sourceConfig.match_mode || "window").toLowerCase();
    const windowMs = Math.max(1, Number(sourceConfig.window_hours) || 3) * 3600000;
    const maxDeltaMs = Math.max(0, Number(sourceConfig.max_delta_hours) || Number(sourceConfig.window_hours) || 3) * 3600000;

    if (mode === "exact") {
      const exact = points.find((point) => point.datetimeMs === item.datetimeMs);
      return exact ? { value: exact.value, source: "secondary-exact" } : { value: null, source: "none" };
    }
    if (mode === "nearest") {
      let best = null;
      let bestDelta = Infinity;
      points.forEach((point) => {
        const delta = Math.abs(point.datetimeMs - item.datetimeMs);
        if (delta < bestDelta) { best = point; bestDelta = delta; }
      });
      return best && bestDelta <= maxDeltaMs ? { value: best.value, source: "secondary-nearest" } : { value: null, source: "none" };
    }
    let selected = null;
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      const next = points[i + 1];
      const endMs = next?.datetimeMs ?? (point.datetimeMs + windowMs);
      const hardEndMs = Math.min(endMs, point.datetimeMs + windowMs);
      if (item.datetimeMs >= point.datetimeMs && item.datetimeMs < hardEndMs) { selected = point; break; }
    }
    return selected ? { value: selected.value, source: `secondary-window:${selected.valueKey || "value"}` } : { value: null, source: "none" };
  }

  _enrichEntries(entries) {
    const probabilityConfig = this._secondarySourceConfig("probability");
    const probabilityPoints = this._secondarySourcePoints(probabilityConfig);
    const now = Date.now();
    const hourMs = 3600000;

    const enriched = entries.map((item) => {
      const secondary = this._secondaryValueForItem(item, probabilityConfig, probabilityPoints);
      const primary = Number.isFinite(item.probability)
        ? { value: item.probability, source: item.metricSources.probability }
        : { value: null, source: "none" };
      // V1.9.3.9 : certains providers exposent une probabilité primaire absente ou à 0,
      // alors que le custom component Météo-France fournit une série 3 h pertinente.
      // On garde la donnée primaire si elle est positive, sinon on autorise le fallback positif.
      const useSecondary = Number.isFinite(secondary.value)
        && secondary.value > 0
        && (!Number.isFinite(primary.value) || primary.value <= 0);
      const selected = useSecondary ? secondary : primary;
      const probability = Number.isFinite(selected.value) ? selected.value : null;
      return {
        ...item,
        probability,
        metricSources: { ...item.metricSources, probability: selected.source },
        isCurrent: item.isNowColumn || (now >= item.datetimeMs && now < item.datetimeMs + hourMs),
      };
    });

    const maxPrecipitation = Math.max(0, ...enriched.map((item) => Number.isFinite(item.precipitation) ? item.precipitation : 0));
    const validTemps = enriched.filter((item) => Number.isFinite(item.temperature)).map((item) => item.temperature);
    const minTemp = validTemps.length ? Math.min(...validTemps) : null;
    const maxTemp = validTemps.length ? Math.max(...validTemps) : null;

    return enriched.map((item) => ({
      ...item,
      precipitationPercent: this._precipitationPercent(item.precipitation, maxPrecipitation),
      rainColor: this._rainColor(item.precipitation, maxPrecipitation),
      isRainPeak: maxPrecipitation > 0 && item.precipitation === maxPrecipitation,
      tempRange: { min: minTemp, max: maxTemp },
      windLevel: this._combinedWindLevel(item),
      effectiveBearing: this._arrowBearing(item.windBearing),
    }));
  }

  _precipitationPercent(value, max) {
    const n = this._toNumber(value, null);
    if (!Number.isFinite(n) || n <= 0) return 0;
    const raw = Math.max(0, Math.min(100, (n / Math.max(0.1, max)) * 100));
    return Math.max(4, raw);
  }

  _rainColor(value, max) {
    const n = this._toNumber(value, 0);
    if (!Number.isFinite(n) || n <= 0) return "rgba(56,189,248,0)";
    const ratio = Math.max(0, Math.min(1, n / Math.max(0.1, max || n)));
    const alpha = 0.18 + ratio * 0.34;
    const r = Math.round(98 - ratio * 48);
    const g = Math.round(196 - ratio * 64);
    const b = Math.round(248 - ratio * 34);
    return `rgba(${Math.max(26, r)}, ${Math.max(132, g)}, ${Math.max(194, b)}, ${alpha.toFixed(2)})`;
  }

  _conditionIcon(condition) {
    const state = String(condition || "").toLowerCase();
    const map = {
      sunny: "mdi:weather-sunny",
      "clear-night": "mdi:weather-night",
      partlycloudy: "mdi:weather-partly-cloudy",
      cloudy: "mdi:weather-cloudy",
      rainy: "mdi:weather-rainy",
      pouring: "mdi:weather-pouring",
      lightning: "mdi:weather-lightning",
      "lightning-rainy": "mdi:weather-lightning-rainy",
      snowy: "mdi:weather-snowy",
      "snowy-rainy": "mdi:weather-snowy-rainy",
      fog: "mdi:weather-fog",
      hail: "mdi:weather-hail",
      windy: "mdi:weather-windy",
      "windy-variant": "mdi:weather-windy-variant",
      exceptional: "mdi:weather-hurricane",
    };
    return map[state] || "mdi:weather-cloudy";
  }


  _weatherIconSvg(condition) {
    const state = String(condition || "cloudy").toLowerCase();
    const cloudyStates = [
      "partlycloudy", "cloudy", "fog", "windy", "windy-variant", "hail",
      "rainy", "snowy", "snowy-rainy", "pouring", "lightning", "lightning-rainy",
    ];
    const rainStates = ["hail", "rainy", "pouring", "lightning-rainy"];
    const snowyStates = ["snowy", "snowy-rainy"];
    const lightningStates = ["lightning", "lightning-rainy", "exceptional"];
    const windyStates = ["windy", "windy-variant"];

    const isCloudy = cloudyStates.includes(state);
    const isRainy = rainStates.includes(state);
    const isSnowy = snowyStates.includes(state);
    const isLightning = lightningStates.includes(state);
    const isWindy = windyStates.includes(state);

    const sun = state === "sunny" ? `
      <path class="sun" d="m 14.39303,8.4033507 c 0,3.3114723 -2.684145,5.9956173 -5.9956169,5.9956173 -3.3114716,0 -5.9956168,-2.684145 -5.9956168,-5.9956173 0,-3.311471 2.6841452,-5.995617 5.9956168,-5.995617 3.3114719,0 5.9956169,2.684146 5.9956169,5.995617" />
    ` : "";

    const moon = state === "clear-night" ? `
      <path class="moon" d="m 13.502891,11.382935 c -1.011285,1.859223 -2.976664,3.121381 -5.2405751,3.121381 -3.289929,0 -5.953329,-2.663833 -5.953329,-5.9537625 0,-2.263911 1.261724,-4.228856 3.120948,-5.240575 -0.452782,0.842738 -0.712753,1.806363 -0.712753,2.832381 0,3.289928 2.663833,5.9533275 5.9533291,5.9533275 1.026017,0 1.989641,-0.259969 2.83238,-0.712752" />
    ` : "";

    const partly = state === "partlycloudy" ? `
      <path class="sun" d="m14.981 4.2112c0 1.9244-1.56 3.4844-3.484 3.4844-1.9244 0-3.4844-1.56-3.4844-3.4844s1.56-3.484 3.4844-3.484c1.924 0 3.484 1.5596 3.484 3.484" />
    ` : "";

    const cloud = isCloudy ? `
      <path class="cloud-back" d="m3.8863 5.035c-0.54892 0.16898-1.04 0.46637-1.4372 0.8636-0.63077 0.63041-1.0206 1.4933-1.0206 2.455 0 1.9251 1.5589 3.4682 3.4837 3.4682h6.9688c1.9251 0 3.484-1.5981 3.484-3.5232 0-1.9251-1.5589-3.5232-3.484-3.5232h-1.0834c-0.25294-1.6916-1.6986-2.9083-3.4463-2.9083-1.7995 0-3.2805 1.4153-3.465 3.1679" />
      <path class="cloud-front" d="m4.1996 7.6995c-0.33902 0.10407-0.64276 0.28787-0.88794 0.5334-0.39017 0.38982-0.63147 0.92322-0.63147 1.5176 0 1.1896 0.96414 2.1431 2.1537 2.1431h4.3071c1.1896 0 2.153-0.98742 2.153-2.1777 0-1.1896-0.96344-2.1777-2.153-2.1777h-0.66992c-0.15593-1.0449-1.0499-1.7974-2.1297-1.7974-1.112 0-2.0274 0.87524-2.1417 1.9586" />
    ` : "";

    const rain = isRainy ? `
      <path class="rain" d="m5.2852 14.734c-0.22401 0.24765-0.57115 0.2988-0.77505 0.11395-0.20391-0.1845-0.18732-0.53481 0.036689-0.78281 0.14817-0.16298 0.59126-0.32914 0.87559-0.42369 0.12453-0.04092 0.22684 0.05186 0.19791 0.17956-0.065617 0.2921-0.18732 0.74965-0.33514 0.91299" />
      <path class="rain" d="m11.257 14.163c-0.22437 0.24765-0.57115 0.2988-0.77505 0.11395-0.2039-0.1845-0.18768-0.53481 0.03669-0.78281 0.14817-0.16298 0.59126-0.32914 0.8756-0.42369 0.12453-0.04092 0.22684 0.05186 0.19791 0.17956-0.06562 0.2921-0.18732 0.74965-0.33514 0.91299" />
      <path class="rain" d="m8.432 15.878c-0.15452 0.17039-0.3937 0.20567-0.53446 0.07867-0.14041-0.12735-0.12876-0.36865 0.025753-0.53975 0.10195-0.11218 0.40711-0.22684 0.60325-0.29175 0.085725-0.02858 0.15628 0.03563 0.13652 0.12382-0.045508 0.20108-0.12912 0.51647-0.23107 0.629" />
      <path class="rain" d="m7.9991 14.118c-0.19226 0.21237-0.49001 0.25612-0.66499 0.09737-0.17462-0.15804-0.16051-0.45861 0.03175-0.67098 0.12665-0.14005 0.50729-0.28293 0.75071-0.36336 0.10689-0.03563 0.19473 0.0441 0.17004 0.15346-0.056092 0.25082-0.16051 0.64347-0.28751 0.78352" />
    ` : "";

    const heavyRain = state === "pouring" ? `
      <path class="rain" d="m10.648 16.448c-0.19226 0.21449-0.49001 0.25894-0.66499 0.09878-0.17498-0.16016-0.16087-0.4639 0.03175-0.67874 0.12665-0.14146 0.50694-0.2854 0.75071-0.36724 0.10689-0.03563 0.19473 0.0448 0.17004 0.15558-0.05645 0.25365-0.16051 0.65017-0.28751 0.79163" />
      <path class="rain" d="m5.9383 16.658c-0.22437 0.25012-0.5715 0.30162-0.77505 0.11501-0.20391-0.18627-0.18768-0.54046 0.036689-0.79093 0.14817-0.1651 0.59126-0.33267 0.87559-0.42827 0.12418-0.04127 0.22648 0.05221 0.19791 0.18168-0.065617 0.29528-0.18732 0.75741-0.33514 0.92251" />
    ` : "";

    const snow = isSnowy ? `
      <path class="snow" d="m 8.4319893,15.348341 c 0,0.257881 -0.209197,0.467079 -0.467078,0.467079 -0.258586,0 -0.46743,-0.209198 -0.46743,-0.467079 0,-0.258233 0.208844,-0.467431 0.46743,-0.467431 0.257881,0 0.467078,0.209198 0.467078,0.467431" />
      <path class="snow" d="m 11.263878,14.358553 c 0,0.364067 -0.295275,0.659694 -0.659695,0.659694 -0.364419,0 -0.6596937,-0.295627 -0.6596937,-0.659694 0,-0.364419 0.2952747,-0.659694 0.6596937,-0.659694 0.36442,0 0.659695,0.295275 0.659695,0.659694" />
      <path class="snow" d="m 5.3252173,13.69847 c 0,0.364419 -0.295275,0.660047 -0.659695,0.660047 -0.364067,0 -0.659694,-0.295628 -0.659694,-0.660047 0,-0.364067 0.295627,-0.659694 0.659694,-0.659694 0.36442,0 0.659695,0.295627 0.659695,0.659694" />
    ` : "";

    const lightning = isLightning ? `
      <path class="lightning" d="m 9.9252695,10.935875 -1.6483986,2.341014 1.1170184,0.05929 -1.2169864,2.02141 3.0450261,-2.616159 H 9.8864918 L 10.97937,11.294651 10.700323,10.79794 h-0.508706 l-0.2663475,0.137936" />
    ` : "";

    const windy = isWindy ? `
      <path class="windy" d="m 13.59616,15.30968 c 0,0 -0.09137,-0.0071 -0.250472,-0.0187 -0.158045,-0.01235 -0.381353,-0.02893 -0.64382,-0.05715 -0.262466,-0.02716 -0.564444,-0.06385 -0.877358,-0.124531 -0.156986,-0.03034 -0.315383,-0.06844 -0.473781,-0.111478 -0.157691,-0.04551 -0.313266,-0.09842 -0.463902,-0.161219 l -0.267406,-0.0949 c -0.09984,-0.02646 -0.205669,-0.04904 -0.305153,-0.06738 -0.193322,-0.02716 -0.3838218,-0.03316 -0.5640912,-0.02011 -0.3626556,0.02611 -0.6847417,0.119239 -0.94615,0.226483 -0.2617611,0.108656 -0.4642556,0.230364 -0.600075,0.324203 -0.1358195,0.09419 -0.2049639,0.160514 -0.2049639,0.160514 0,0 0.089958,-0.01623 0.24765,-0.04445 0.1559278,-0.02575 0.3764139,-0.06174 0.6367639,-0.08714 0.2596444,-0.02646 0.5591527,-0.0441 0.8678333,-0.02328 0.076905,0.0035 0.1538111,0.01658 0.2321278,0.02293 0.077611,0.01058 0.1534581,0.02893 0.2314221,0.04022 0.07267,0.01834 0.1397,0.03986 0.213078,0.05644 l 0.238125,0.08925 c 0.09207,0.03281 0.183444,0.07055 0.275872,0.09878 0.09243,0.0261 0.185208,0.05327 0.277636,0.07161 0.184856,0.0388 0.367947,0.06174 0.543983,0.0702 0.353131,0.01905 0.678745,-0.01341 0.951442,-0.06456 0.27305,-0.05292 0.494595,-0.123119 0.646642,-0.181681 0.152047,-0.05785 0.234597,-0.104069 0.234597,-0.104069" />
    ` : "";

    return `
      <span class="weather-icon-svg weather-icon-${this._escapeHtml(state)}" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" preserveAspectRatio="xMidYMid meet">
          ${sun}
          ${moon}
          ${partly}
          ${cloud}
          ${rain}
          ${heavyRain}
          ${snow}
          ${lightning}
          ${windy}
        </svg>
      </span>
    `;
  }

  _formatTimeLabel(date, keepMinutes = false) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "--";
    const text = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date).replace(":", "h");
    return keepMinutes ? text : text.replace("h00", "h");
  }

  _hourLabel(item) {
    if (item?.isNowColumn) return "Maint.";
    return this._formatTimeLabel(item?.date, false);
  }

  _dayKey(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  _dayShortLabel(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "J+1";
    return new Intl.DateTimeFormat("fr-FR", { weekday: "short" })
      .format(date)
      .replace(/\.$/, "")
      .replace(/^./, (c) => c.toUpperCase());
  }

  _solarEventMap(entries) {
    const map = new Map();
    if (this.config.show_sun_markers === false || !entries?.length) return map;
    const sun = this._state(this.config.sun_entity || "sun.sun");
    const attrs = sun?.attributes || {};
    const events = [
      { type: "sunrise", raw: attrs.next_rising },
      { type: "sunset", raw: attrs.next_setting },
    ]
      .map((event) => {
        const date = event.raw ? new Date(event.raw) : null;
        const ms = date && !Number.isNaN(date.getTime()) ? date.getTime() : NaN;
        return { ...event, date, ms };
      })
      .filter((event) => Number.isFinite(event.ms));

    if (!events.length) return map;
    const tolerance = Math.max(20, Number(this.config.solar_marker_tolerance_minutes) || 75) * 60000;
    events.forEach((event) => {
      let bestIndex = -1;
      let bestDelta = Infinity;
      entries.forEach((item, index) => {
        if (!Number.isFinite(item.datetimeMs)) return;
        const delta = Math.abs(item.datetimeMs - event.ms);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestIndex = index;
        }
      });
      if (bestIndex >= 0 && bestDelta <= tolerance) {
        const previous = map.get(bestIndex);
        if (!previous || bestDelta < previous.delta) {
          map.set(bestIndex, { ...event, delta: bestDelta });
        }
      }
    });
    return map;
  }

  _timeCellMeta(item, index, entries, solarMap) {
    if (item?.isNowColumn) {
      return { label: "Maint.", classes: " is-current", title: "Maintenant" };
    }

    const solar = solarMap?.get(index);
    if (solar) {
      const label = this._formatTimeLabel(solar.date, true);
      const title = solar.type === "sunrise" ? "Lever du soleil" : "Coucher du soleil";
      return { label, classes: ` is-solar is-${solar.type}`, title };
    }

    const previous = entries?.[index - 1];
    const changedDay = this.config.highlight_day_changes !== false
      && index > 0
      && this._dayKey(item?.date)
      && this._dayKey(item?.date) !== this._dayKey(previous?.date);
    if (changedDay) {
      return { label: this._dayShortLabel(item?.date), classes: " is-day-marker", title: "Changement de jour" };
    }

    return { label: this._hourLabel(item), classes: "", title: "" };
  }

  _shouldShowProbability(entries) {
    const mode = String(this.config.show_probability ?? "auto").toLowerCase();
    if (["false", "never", "off"].includes(mode)) return false;
    if (["true", "always", "on"].includes(mode)) return true;
    return entries.some((item) => Number.isFinite(item.probability) && item.probability > 0);
  }

  _normalizeAngle(value) {
    const n = this._toNumber(value, null);
    if (!Number.isFinite(n)) return null;
    return ((n % 360) + 360) % 360;
  }

  _bearingRotation() {
    const mode = String(this.config.bearing_reference_mode || "house").toLowerCase();
    if (mode === "standard") return 0;
    if (mode === "custom") return this._toNumber(this.config.bearing_rotation, 0) || 0;
    return this._toNumber(this.config.bearing_house_rotation, -50) ?? -50;
  }

  _arrowBearing(bearing) {
    const n = this._normalizeAngle(bearing);
    if (!Number.isFinite(n)) return null;
    const mode = String(this.config.bearing_arrow_mode || "travel").toLowerCase();
    // Aligné avec weather-wind-forecast-card : travel = bearing + 180, source = bearing.
    const base = mode === "source" ? n : n + 180;
    return this._normalizeAngle(base + this._bearingRotation());
  }

  _bearingToDirection(bearing) {
    const n = this._normalizeAngle(bearing);
    if (!Number.isFinite(n)) return "";
    const dirs = ["N", "N-NE", "NE", "E-NE", "E", "E-SE", "SE", "S-SE", "S", "S-SO", "SO", "O-SO", "O", "O-NO", "NO", "N-NO"];
    const idx = Math.round(n / 22.5) % 16;
    return dirs[idx];
  }

  _threshold(entityId, fallback) {
    const stateValue = this._toNumber(this._state(entityId)?.state, null);
    return Number.isFinite(stateValue) && stateValue > 0 ? stateValue : Number(fallback);
  }

  _intensityLevel(value, reference) {
    const n = this._toNumber(value, null);
    const ref = this._toNumber(reference, null);
    if (!Number.isFinite(n) || !Number.isFinite(ref) || ref <= 0) return "neutral";
    const close = Number(this.config.intensity_close_ratio ?? 1.10);
    const strong = Number(this.config.intensity_strong_ratio ?? 1.30);
    if (n <= ref * close) return "low";
    if (n <= ref * strong) return "medium";
    return "high";
  }

  _levelRank(level) {
    return { neutral: 0, low: 1, weak: 1, ok: 1, medium: 2, moyen: 2, high: 3, strong: 3, fort: 3 }[String(level || "neutral").toLowerCase()] ?? 0;
  }

  _maxLevel(...levels) {
    return levels.reduce((best, level) => this._levelRank(level) > this._levelRank(best) ? level : best, "neutral");
  }

  _combinedWindLevel(item) {
    const windRef = this._threshold(this.config.wind_reference_threshold_entity, this.config.wind_reference_threshold_fallback || 35);
    const gustRef = this._threshold(this.config.gust_reference_threshold_entity, this.config.gust_reference_threshold_fallback || 45);
    const windLevel = this._intensityLevel(item.windSpeed, windRef);
    const gustLevel = Number.isFinite(item.windGust) && item.windGust > 0 ? this._intensityLevel(item.windGust, gustRef) : "neutral";
    return this._maxLevel(windLevel, gustLevel);
  }

  _levelColor(level) {
    const key = String(level || "neutral").toLowerCase();
    if (["high", "strong", "fort"].includes(key)) return "var(--error-color, #ef4444)";
    if (["medium", "moyen"].includes(key)) return "var(--warning-color, #f59e0b)";
    if (["low", "weak", "ok"].includes(key)) return "var(--success-color, #22c55e)";
    return "var(--secondary-text-color)";
  }

  _tempColor(value) {
    const t = this._toNumber(value, null);
    if (!Number.isFinite(t)) return "#f59e0b";
    if (t <= 5) return "#60a5fa";
    if (t <= 12) return "#38bdf8";
    if (t <= 20) return "#34d399";
    if (t <= 27) return "#f59e0b";
    return "#ef4444";
  }

  _temperaturePoints(entries, width, height) {
    const valid = entries.filter((item) => Number.isFinite(item.temperature));
    if (valid.length < 2) return [];
    const temps = valid.map((item) => item.temperature);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    // V1.9.3.9 : normalisation stricte sur les températures visibles.
    // Le max vient près de la zone haute disponible, le min vient juste au-dessus
    // de la baseline de pluie / abscisse virtuelle.
    const topY = 12;
    const bottomY = Math.max(topY + 28, height - 4);
    const itemWidth = Number(this.config.item_width) || 68;
    const rawRange = Math.max(0.1, max - min);
    const pad = Math.max(0.12, rawRange * 0.025);
    const scaledMin = min - pad;
    const scaledMax = max + pad;
    const range = Math.max(0.25, scaledMax - scaledMin);
    const indexOf = new Map(entries.map((item, index) => [item.datetimeMs + (item.isNowColumn ? 0.25 : 0), index]));
    return valid.map((item) => {
      const index = indexOf.get(item.datetimeMs + (item.isNowColumn ? 0.25 : 0)) ?? entries.indexOf(item) ?? 0;
      const x = index * itemWidth + itemWidth / 2;
      const y = topY + ((scaledMax - item.temperature) / range) * (bottomY - topY);
      return { x, y, item };
    });
  }

  _renderColumnSeparators(entries, width, totalHeight) {
    const itemWidth = Number(this.config.item_width) || 68;
    // V1.9.3.14 : un seul calque SVG pour toute la hauteur utile.
    // Cela évite le rendu différent entre le haut (SVG) et le bas (CSS/pseudo-element).
    const y1 = 5.5;
    const y2 = Math.max(y1 + 8, totalHeight - 2.2);
    const lines = entries.map((_item, index) => {
      if (index === 0) return "";
      const x = index * itemWidth;
      return `<line class="grid-line" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${y1.toFixed(1)}" y2="${y2.toFixed(1)}" />`;
    }).join("");
    return `
      <svg class="separator-svg" viewBox="0 0 ${width} ${totalHeight}" preserveAspectRatio="none" aria-hidden="true">
        ${lines}
      </svg>
    `;
  }

  _renderTemperatureSegments(points) {
    if (points.length < 2) return "";
    let out = "";
    const tension = 0.30;
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      const p0 = points[i - 1] || a;
      const p3 = points[i + 2] || b;
      const c1x = a.x + (b.x - p0.x) * tension;
      const c1y = a.y + (b.y - p0.y) * tension;
      const c2x = b.x - (p3.x - a.x) * tension;
      const c2y = b.y - (p3.y - a.y) * tension;
      const colorA = this._tempColor(a.item.temperature);
      const colorB = this._tempColor(b.item.temperature);
      const id = `temp-grad-${i}`;
      const d = `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      out += `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}"><stop offset="0%" stop-color="${colorA}"/><stop offset="100%" stop-color="${colorB}"/></linearGradient>`;
      out += `<path class="temp-path temp-glow" d="${d}" style="stroke:url(#${id})" />`;
      out += `<path class="temp-path" d="${d}" style="stroke:url(#${id})" />`;
    }
    return out;
  }

  _renderRainBars(entries, chartHeight) {
    const itemWidth = Number(this.config.item_width) || 68;
    const baseline = chartHeight - 1.4;
    const maxBarHeight = Math.max(24, baseline - 13);
    const barWidth = Math.max(18, Math.min(26, itemWidth * 0.38));
    return entries.map((item, index) => {
      const mm = Number.isFinite(item.precipitation) ? item.precipitation : 0;
      const isWet = mm > 0;
      const center = index * itemWidth + itemWidth / 2;
      const x = center - barWidth / 2;
      const h = isWet ? Math.max(4, (item.precipitationPercent / 100) * maxBarHeight) : 0;
      const y = baseline - h;
      return isWet
        ? `<rect class="rain-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${h.toFixed(1)}" rx="1.6" style="fill:${item.rainColor}" />`
        : "";
    }).join("");
  }

  _renderRainInfo(entries) {
    const showProbability = this._shouldShowProbability(entries);
    // V1.9.3.9 : zone permanente pour éviter toute variation de hauteur
    // selon la présence de pluie ou de probabilité.
    return `
      <div class="rain-info-row">
        ${entries.map((item) => {
          const mm = Number.isFinite(item.precipitation) ? item.precipitation : 0;
          const p = Number.isFinite(item.probability) ? Math.round(item.probability) : null;
          const mmLabel = mm > 0 ? `<span class="rain-mm">${this._escapeHtml(this._formatNumber(mm, mm >= 10 ? 0 : 1))}mm</span>` : `<span class="rain-mm rain-empty">&nbsp;</span>`;
          const probLabel = showProbability && Number.isFinite(p) && p > 0 ? `<span class="rain-prob">${p}%</span>` : `<span class="rain-prob rain-empty">&nbsp;</span>`;
          return `<div class="rain-info-cell">${mmLabel}${probLabel}</div>`;
        }).join("")}
      </div>
    `;
  }

  _renderChartArea(entries, width) {
    const height = Number(this.config.chart_height) || 78;
    const rainInfoHeight = 22;
    const totalHeight = height + rainInfoHeight;
    const points = this._temperaturePoints(entries, width, height);
    const tempSegments = this._renderTemperatureSegments(points);
    const dotLabels = points
      .map((point) => {
        const labelY = Math.max(10, Math.min(point.y - 9, height - 16));
        return `<text class="temp-label" x="${point.x.toFixed(1)}" y="${labelY.toFixed(1)}">${this._escapeHtml(this._formatNumber(point.item.temperature, 0))}°</text>`;
      }).join("");
    return `
      <div class="graph-combo" style="height:${totalHeight}px">
        ${this._renderColumnSeparators(entries, width, totalHeight)}
        <div class="chart-zone">
          <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="Prévisions combinées température et pluie">
            <defs>${tempSegments.match(/<linearGradient[\s\S]*?<\/linearGradient>/g)?.join("") || ""}</defs>
            ${this._renderRainBars(entries, height)}
            <line class="chart-baseline" x1="0" x2="${width}" y1="${(height - 1.4).toFixed(1)}" y2="${(height - 1.4).toFixed(1)}" />
            ${tempSegments.replace(/<linearGradient[\s\S]*?<\/linearGradient>/g, "")}
            ${points.map((point) => `<circle class="temp-dot${point.item.isCurrent ? " is-current" : ""}" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="2.4" style="stroke:${this._tempColor(point.item.temperature)}" />`).join("")}
            ${dotLabels}
          </svg>
        </div>
        ${this._renderRainInfo(entries)}
      </div>
    `;
  }

  _renderTimeRow(entries) {
    const solarMap = this._solarEventMap(entries);
    return `
      <div class="time-row">
        ${entries.map((item, index) => {
          const meta = this._timeCellMeta(item, index, entries, solarMap);
          return `
            <div class="time-cell${meta.classes}">
              <span class="time-label" title="${this._escapeHtml(meta.title || "")}">${this._escapeHtml(meta.label)}</span>
              ${this._weatherIconSvg(item.condition)}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  _windCompactSvg(item) {
    const rotation = Number.isFinite(item.effectiveBearing) ? item.effectiveBearing : 0;
    const color = this._levelColor(item.windLevel);
    const speed = Number.isFinite(item.windSpeed) ? Math.round(item.windSpeed) : "—";
    return `
      <div class="wind-compact level-${this._escapeHtml(item.windLevel)}" style="--wind-level-color:${color}">
        <svg class="wind-arrow-compact" viewBox="0 0 44 44" aria-hidden="true" style="transform:rotate(${rotation}deg)">
          <g>
            <line class="wind-tail" x1="22" y1="38" x2="22" y2="34" />
            <line class="wind-tip-stem" x1="22" y1="8.4" x2="22" y2="12.2" />
            <path class="wind-head" d="M22 1.2 L24.45 7.4 L22 6.55 L19.55 7.4 Z" />
          </g>
        </svg>
        <span class="wind-speed">${this._escapeHtml(speed)}</span>
      </div>
    `;
  }

  _renderWindLayer(entries) {
    if (this.config.show_wind === false) return "";
    return `
      <div class="wind-row">
        ${entries.map((item) => {
          const gust = Number.isFinite(item.windGust) && item.windGust > 0 ? `${Math.round(item.windGust)}` : "";
          const dir = this._bearingToDirection(item.windBearing);
          const gustLevel = Number.isFinite(item.windGust) && item.windGust > 0
            ? this._intensityLevel(item.windGust, this._threshold(this.config.gust_reference_threshold_entity, this.config.gust_reference_threshold_fallback || 45))
            : "neutral";
          return `
            <div class="wind-cell">
              ${this._windCompactSvg(item)}
              <div class="wind-meta">
                ${dir ? `<span>${this._escapeHtml(dir)}</span>` : ""}
                ${gust ? `<span class="gust level-${this._escapeHtml(gustLevel)}">raf. ${this._escapeHtml(gust)}</span>` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  _weatherMode() {
    const state = this._state(this.config.weather_entity)?.state || "unknown";
    if (state === "sunny") return "sunny";
    if (state === "clear-night") return "night";
    if (state === "partlycloudy") return "partly";
    if (["cloudy", "windy", "windy-variant"].includes(state)) return "cloudy";
    if (state === "rainy") return "rain";
    if (state === "pouring") return "pouring";
    if (["snowy", "snowy-rainy"].includes(state)) return "snow";
    if (["fog", "hail"].includes(state)) return "fog";
    if (["lightning", "lightning-rainy", "exceptional"].includes(state)) return "storm";
    return "cloudy";
  }


  _weatherSummaryLabel(condition) {
    const state = String(condition || "unknown").toLowerCase();
    const labels = {
      sunny: "Ensoleillé",
      "clear-night": "Ciel clair",
      partlycloudy: "Partiellement nuageux",
      cloudy: "Nuageux",
      rainy: "Pluie",
      pouring: "Forte pluie",
      lightning: "Orage",
      "lightning-rainy": "Orage pluvieux",
      snowy: "Neige",
      "snowy-rainy": "Neige et pluie",
      fog: "Brouillard",
      hail: "Grêle",
      windy: "Venteux",
      "windy-variant": "Venteux",
      exceptional: "Exceptionnel",
    };
    return labels[state] || "Météo variable";
  }

  _currentTemperatureValue() {
    const entityId = this.config.current_temperature_entity;
    const st = entityId ? this._state(entityId) : null;
    const entityValue = this._toNumber(st?.state, null);
    if (Number.isFinite(entityValue)) return { value: entityValue, source: entityId };
    const weather = this._state(this.config.weather_entity);
    const weatherValue = this._toNumber(weather?.attributes?.temperature, null);
    if (Number.isFinite(weatherValue)) return { value: weatherValue, source: this.config.weather_entity };
    return { value: null, source: "none" };
  }

  _currentSummaryText() {
    const summaryEntity = this.config.current_summary_entity;
    const summaryState = summaryEntity ? this._state(summaryEntity) : null;
    if (summaryState && !["unknown", "unavailable", "none", ""].includes(String(summaryState.state).toLowerCase())) {
      return String(summaryState.state);
    }
    return this._weatherSummaryLabel(this._state(this.config.weather_entity)?.state);
  }

  _currentDayBounds() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { startMs: start.getTime(), endMs: end.getTime() };
  }

  _explicitHeaderRangeOverride() {
    const minEntity = this.config.current_min_temperature_entity;
    const maxEntity = this.config.current_max_temperature_entity;
    if (!minEntity || !maxEntity) return null;

    const min = this._toNumber(this._state(minEntity)?.state, null);
    const max = this._toNumber(this._state(maxEntity)?.state, null);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

    return this._normalizeTemperatureRange({ min, max, source: "configured_min_max_entities" });
  }

  _isSameLocalDay(a, b) {
    if (!(a instanceof Date) || !(b instanceof Date)) return false;
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  _dailyForecastTodayRange() {
    const today = new Date();
    const rows = this._weatherDailyForecastRows();
    if (!Array.isArray(rows) || !rows.length) return null;

    // Logique standard volontairement simple, alignée sur clock-weather-card :
    // weather_entity → forecast daily du jour → templow / temperature.
    // On ne reconstruit pas le min/max depuis la timeline horaire visible.
    const todayForecast = rows.find((item) => {
      const rawDate = item?.datetime || item?.date || item?.time;
      if (!rawDate) return false;
      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return false;
      return this._isSameLocalDay(date, today);
    }) || rows.find((item) => !(item?.datetime || item?.date || item?.time)) || null;

    if (!todayForecast) return null;

    const min = this._toNumber(todayForecast.templow ?? todayForecast.temperature_low ?? todayForecast.low_temperature, null);
    const max = this._toNumber(todayForecast.temperature ?? todayForecast.temperature_high ?? todayForecast.high_temperature, null);

    if (Number.isFinite(min) && Number.isFinite(max)) {
      return this._normalizeTemperatureRange({ min, max, source: "weather_entity_daily_forecast" });
    }
    return null;
  }

  _weatherDailyTemperatureRange() {
    const weather = this._state(this.config.weather_entity);
    const attrs = weather?.attributes || {};
    const min = this._toNumber(attrs.templow ?? attrs.temperature_low ?? attrs.low_temperature ?? attrs.min_temperature ?? attrs.temperature_min, null);
    const max = this._toNumber(attrs.temperature ?? attrs.temperature_high ?? attrs.high_temperature ?? attrs.max_temperature ?? attrs.temperature_max, null);
    if (Number.isFinite(min) && Number.isFinite(max)) return this._normalizeTemperatureRange({ min, max, source: "weather_entity_attributes" });
    return null;
  }

  _normalizeTemperatureRange(range) {
    if (!range || !Number.isFinite(range.min) || !Number.isFinite(range.max)) return null;
    let min = range.min;
    let max = range.max;
    if (max < min) [min, max] = [max, min];
    if (Math.abs(max - min) < 0.5) {
      min -= 1;
      max += 1;
    }
    return { ...range, min, max };
  }

  _currentTemperatureRange(_entries = [], _currentValue = null) {
    // Comportement standard simple : weather_entity → daily forecast du jour → templow / temperature.
    // Les entités custom restent uniquement une surcharge avancée explicite.
    return this._explicitHeaderRangeOverride() || this._dailyForecastTodayRange();
  }

  _temperatureGaugePalette() {
    // Palette de jauge alignée sur les familles couleur de la courbe température,
    // avec des points intermédiaires pour obtenir une vraie échelle thermique continue.
    // Les positions ne sont jamais fixes : elles sont projetées dans [minJour, maxJour].
    return [
      [5, "#60a5fa"],   // froid / bleu
      [12, "#38bdf8"],  // frais / cyan
      [18, "#34d399"],  // doux / vert
      [22, "#facc15"],  // transition jaune visible
      [25, "#f59e0b"],  // jaune-orangé
      [28, "#fb923c"],  // orange chaud
      [32, "#ef4444"],  // très chaud
    ];
  }

  _hexToRgb(color) {
    const raw = String(color || "").trim();
    const hex = raw.startsWith("#") ? raw.slice(1) : raw;
    if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  _rgbToCss(rgb) {
    if (!rgb) return "#ffffff";
    return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
  }

  _interpolateTemperatureRgb(temp, left, right) {
    const [leftTemp, leftColor] = left;
    const [rightTemp, rightColor] = right;
    const leftRgb = this._hexToRgb(leftColor);
    const rightRgb = this._hexToRgb(rightColor);
    if (!leftRgb || !rightRgb || rightTemp === leftTemp) return leftRgb || rightRgb;
    const ratio = Math.max(0, Math.min(1, (temp - leftTemp) / (rightTemp - leftTemp)));
    return {
      r: leftRgb.r + (rightRgb.r - leftRgb.r) * ratio,
      g: leftRgb.g + (rightRgb.g - leftRgb.g) * ratio,
      b: leftRgb.b + (rightRgb.b - leftRgb.b) * ratio,
    };
  }

  _temperatureGaugeColorAt(temp) {
    const palette = this._temperatureGaugePalette();
    if (!Number.isFinite(temp)) return this._hexToRgb(this._tempColor(20));
    if (temp <= palette[0][0]) return this._hexToRgb(palette[0][1]);
    if (temp >= palette[palette.length - 1][0]) return this._hexToRgb(palette[palette.length - 1][1]);
    const upperIndex = palette.findIndex(([threshold]) => threshold >= temp);
    return this._interpolateTemperatureRgb(temp, palette[upperIndex - 1], palette[upperIndex]);
  }

  _temperatureGaugeGradient(min, max) {
    const minTemp = this._toNumber(min, null);
    const maxTemp = this._toNumber(max, null);
    const palette = this._temperatureGaugePalette();
    if (!Number.isFinite(minTemp) || !Number.isFinite(maxTemp)) {
      return `linear-gradient(90deg, ${this._rgbToCss(this._temperatureGaugeColorAt(18))}, ${this._rgbToCss(this._temperatureGaugeColorAt(28))})`;
    }

    const low = Math.min(minTemp, maxTemp);
    const high = Math.max(minTemp, maxTemp);
    const span = high - low;

    if (span < 0.1) {
      const color = this._rgbToCss(this._temperatureGaugeColorAt(low));
      return `linear-gradient(90deg, ${color} 0%, ${color} 100%)`;
    }

    // V1.9.4.0.10 — logique de gradient continue inspirée de clock-weather-card.
    // La jauge représente l'intervalle réel [minJour, maxJour].
    // Chaque seuil thermique est placé à sa vraie position :
    //   position = ((seuil - minJour) / (maxJour - minJour)) * 100
    // Les couleurs aux bornes sont interpolées pour éviter les aplats ou ruptures.
    const stops = new Map();
    const setStop = (pos, rgb) => {
      if (!rgb) return;
      const p = Math.max(0, Math.min(1, pos));
      const key = Number(p.toFixed(5));
      stops.set(key, this._rgbToCss(rgb));
    };

    setStop(0, this._temperatureGaugeColorAt(low));

    palette.forEach(([threshold, color]) => {
      if (threshold > low && threshold < high) {
        setStop((threshold - low) / span, this._hexToRgb(color));
      }
    });

    setStop(1, this._temperatureGaugeColorAt(high));

    const gradientStops = [...stops.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([pos, color]) => `${color} ${(pos * 100).toFixed(1)}%`);

    return `linear-gradient(90deg, ${gradientStops.join(", ")})`;
  }

  _renderHeaderTempGauge(currentValue, range) {
    if (!range || !Number.isFinite(currentValue)) return "";
    const min = range.min;
    const max = range.max;
    const span = Math.max(0.1, max - min);
    const pos = Math.max(0, Math.min(100, ((currentValue - min) / span) * 100));
    const minLabelColor = "rgba(226,242,255,0.82)";
    const currentColor = "#ffffff";
    const maxLabelColor = "rgba(255,255,255,0.98)";
    const trackGradient = this._temperatureGaugeGradient(min, max);
    const sourceLabel = range.source === "weather_entity_daily_forecast"
      ? "weather_entity daily forecast"
      : (range.source || "daily source");
    return `
      <div class="header-temp-range"
        title="${this._escapeHtml(this._formatNumber(min, 0))}° / ${this._escapeHtml(this._formatNumber(max, 0))}° · ${this._escapeHtml(sourceLabel)}"
        style="--range-min-label-color:${minLabelColor}; --range-current-color:${currentColor}; --range-max-label-color:${maxLabelColor}; --range-track-bg:${trackGradient}; --range-current-pos:${pos.toFixed(1)}%;">
        <span class="range-min">${this._escapeHtml(this._formatNumber(min, 0))}°</span>
        <span class="range-track"><span class="range-dot" style="left:${pos.toFixed(1)}%"></span></span>
        <span class="range-max">${this._escapeHtml(this._formatNumber(max, 0))}°</span>
      </div>
    `;
  }


  _riskConfigItems() {
    const riskEntities = Array.isArray(this.config.risk_entities) ? this.config.risk_entities : [];
    const currentRiskEntities = Array.isArray(this.config.current_risk_entities) ? this.config.current_risk_entities : [];

    // V1.9.4.2 — deux familles strictement séparées :
    // - mode weather_alert_pills : adaptateur Météo-France basé sur weather-alert-pills-card-v3.js ;
    // - autres entrées : moteur générique risques projet / maison.
    return [...riskEntities, ...currentRiskEntities].filter((item) =>
      item && typeof item === "object" && (
        item.mode === "weather_alert_pills" ||
        item.entity ||
        item.level_entity ||
        item.level ||
        item.level_when_active ||
        item.level_attribute ||
        item.active_attribute ||
        item.message_attribute ||
        item.message_source
      )
    );
  }

  _riskRenderSnapshot() {
    return this._riskConfigItems().map((cfg) => {
      if (cfg.mode === "weather_alert_pills") {
        const st = this._state(cfg.entity);
        const attrs = st?.attributes || {};
        return {
          mode: cfg.mode,
          id: cfg.id || cfg.entity,
          entity: cfg.entity,
          state: st?.state,
          showSecondaryLine: cfg.show_secondary_line,
          secondaryLineScroll: cfg.secondary_line_scroll,
          alerts: this._weatherAlertPhenomena().map((name) => [name, attrs[name]]),
        };
      }

      const entityState = cfg.entity ? this._state(cfg.entity) : null;
      const levelState = cfg.level_entity ? this._state(cfg.level_entity) : null;
      const messageState = cfg.message_entity ? this._state(cfg.message_entity) : null;
      const secondaryState = cfg.secondary_line_entity ? this._state(cfg.secondary_line_entity) : null;
      return {
        mode: cfg.mode || "generic",
        id: cfg.id || cfg.label || cfg.entity || cfg.level_entity,
        entity: cfg.entity,
        entityState: entityState?.state,
        active: cfg.active_attribute ? this._readAttribute(entityState, cfg.active_attribute) : undefined,
        levelEntity: cfg.level_entity,
        levelState: levelState?.state,
        levelAttr: cfg.level_attribute ? this._readAttribute(entityState, cfg.level_attribute) : undefined,
        messageEntity: cfg.message_entity,
        messageState: messageState?.state,
        secondaryLineEntity: cfg.secondary_line_entity,
        secondaryLineState: secondaryState?.state,
        secondaryLineAttr: cfg.secondary_line_attribute ? this._readAttribute(secondaryState, cfg.secondary_line_attribute) : undefined,
        showSecondaryLine: cfg.show_secondary_line,
        secondaryLineScroll: cfg.secondary_line_scroll,
        secondaryLineText: cfg.secondary_line_text,
        messageAttr: cfg.message_attribute ? (this._readAttribute(entityState, cfg.message_attribute) ?? this._readAttribute(levelState, cfg.message_attribute)) : undefined,
        level: cfg.level,
        levelWhenActive: cfg.level_when_active,
      };
    });
  }

  _normalizeRiskText(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  _readAttribute(stateObj, attributeName) {
    if (!stateObj || !attributeName) return undefined;
    const key = String(attributeName).trim();
    if (!key) return undefined;
    if (["state", "__state", "$state"].includes(key)) return stateObj.state;
    return stateObj.attributes?.[key];
  }

  _isInactiveRiskValue(value) {
    const txt = this._normalizeRiskText(value);
    if (!txt) return true;
    return [
      "off",
      "false",
      "0",
      "ok",
      "none",
      "aucun",
      "aucune",
      "vert",
      "green",
      "normal",
      "clear",
      "inactive",
      "unknown",
      "unavailable",
      "inconnu",
      "indisponible",
      "ras",
      "volets ok",
      "sous-sol ok",
      "sous sol ok",
      "pas d'action",
      "pas daction",
    ].includes(txt);
  }

  _isTruthyRiskValue(value) {
    if (typeof value === "boolean") return value;
    const txt = this._normalizeRiskText(value);
    if (this._isInactiveRiskValue(txt)) return false;
    if (["on", "true", "yes", "oui", "active", "actif", "1"].includes(txt)) return true;
    const num = this._toNumber(value, null);
    if (Number.isFinite(num)) return num > 0;
    return Boolean(txt);
  }

  _isActiveRiskState(stateObj) {
    if (!stateObj) return false;
    return this._isTruthyRiskValue(stateObj.state);
  }

  _riskLevelFromValue(value, cfg = {}) {
    const txt = this._normalizeRiskText(value);
    if (!txt || this._isInactiveRiskValue(txt)) return "none";

    if (txt.includes("critique") || txt.includes("critical")) return "critique";

    // Mappings réels des packages projet :
    // - sensor.example_reference_7 : ok / surveiller / fermer.
    // - sensor.example_reference_5 : aucune / faible / moyenne / forte.
    // - sensor.example_reference_6 : ok / moyen / fort.
    if (txt.includes("fermer") || txt.includes("volets conseilles")) return "fort";
    if (txt.includes("surveiller") || txt.includes("soleil a surveiller")) return "moyen";

    if (txt.includes("fort") || txt.includes("forte") || txt.includes("strong") || txt.includes("severe") || txt.includes("rouge") || txt.includes("red")) return "fort";
    if (txt.includes("orange")) return "fort";
    if (txt.includes("moyen") || txt.includes("moyenne") || txt.includes("medium") || txt.includes("moderate")) return "moyen";
    if (txt.includes("jaune") || txt.includes("yellow")) return "faible";
    if (txt.includes("faible") || txt.includes("low") || txt.includes("mineur") || txt.includes("minor")) return "faible";

    if (txt.includes("alerte") || txt.includes("alert") || txt.includes("vigilance")) return "alert";

    return cfg.show_unknown_risk === true || this.config.show_unknown_risk === true ? "neutre" : "none";
  }

  _riskPrimaryText(level, rawValue = "", cfg = {}) {
    if (cfg.primary_text) return String(cfg.primary_text);
    const raw = this._normalizeRiskText(rawValue);
    if (raw.includes("fermer") || raw.includes("volets conseilles")) return "Fermer";
    if (raw.includes("surveiller") || raw.includes("soleil a surveiller")) return "Surveiller";
    if (level === "critique") return "Alerte";
    if (level === "fort") return "Fort";
    if (level === "moyen") return "Moyen";
    if (level === "faible") return "Faible";
    if (level === "alert") return "Alerte";
    if (level === "neutre") return "Info";
    return cfg.label || "Risque";
  }

  _riskSubtitleText(label, messageRaw = "", levelRaw = "") {
    const msg = String(messageRaw ?? "").trim();
    const raw = String(levelRaw ?? "").trim();
    if (msg && this._normalizeRiskText(msg) !== this._normalizeRiskText(raw)) return msg;
    return String(label || "").trim();
  }

  _riskSecondaryText(cfg = {}, fallback = "") {
    if (cfg.show_secondary_line === false || cfg.secondary_line === false) return "";

    if (cfg.secondary_line_text !== undefined && cfg.secondary_line_text !== null) {
      return String(cfg.secondary_line_text).trim();
    }

    const entityId = cfg.secondary_line_entity || cfg.secondary_entity || "";
    if (entityId) {
      const st = this._state(entityId);
      const raw = cfg.secondary_line_attribute
        ? this._readAttribute(st, cfg.secondary_line_attribute)
        : st?.state;
      const value = String(raw ?? "").trim();
      if (value && !["unknown", "unavailable", "none"].includes(this._normalizeRiskText(value))) return value;
    }

    return String(fallback || "").trim();
  }

  _weatherAlertPhenomena() {
    // Liste exacte reprise de weather-alert-pills-card-v3.js / _activeAlerts().
    return [
      "Vent violent",
      "Pluie-inondation",
      "Orages",
      "Neige-verglas",
      "Inondation",
      "Canicule",
      "Grand-froid",
      "Avalanches",
      "Vagues-submersion",
    ];
  }

  _weatherAlertSeverity(level) {
    // Mapping exact repris de weather-alert-pills-card-v3.js / _severity().
    const raw = String(level || "").trim().toLowerCase();
    if (raw === "rouge" || raw === "red") return 3;
    if (raw === "orange") return 2;
    if (raw === "jaune" || raw === "yellow") return 1;
    return 0;
  }

  _weatherAlertPalette(level) {
    // Palette exacte reprise de weather-alert-pills-card-v3.js / _palette().
    const sev = this._weatherAlertSeverity(level);
    if (sev >= 3) return { accent: "#ff453a", soft: "rgba(255,69,58,.22)", glow: "rgba(255,69,58,.22)" };
    if (sev === 2) return { accent: "#ff9f0a", soft: "rgba(255,159,10,.22)", glow: "rgba(255,159,10,.18)" };
    if (sev === 1) return { accent: "#ffd60a", soft: "rgba(255,214,10,.22)", glow: "rgba(255,214,10,.18)" };
    return { accent: "#8e8e93", soft: "rgba(142,142,147,.18)", glow: "rgba(142,142,147,.10)" };
  }

  _weatherAlertIconFor(name) {
    // Mapping exact repris de weather-alert-pills-card-v3.js / _iconFor().
    const key = String(name || "").toLowerCase();
    if (key.includes("vent")) return "mdi:weather-windy";
    if (key.includes("pluie")) return "mdi:weather-pouring";
    if (key.includes("orage")) return "mdi:weather-lightning";
    if (key.includes("neige") || key.includes("verglas")) return "mdi:weather-snowy-heavy";
    if (key.includes("inondation") || key.includes("vagues")) return "mdi:waves";
    if (key.includes("canicule")) return "mdi:weather-sunny-alert";
    if (key.includes("froid")) return "mdi:snowflake-alert";
    if (key.includes("avalanche")) return "mdi:image-filter-hdr";
    return "mdi:alert-circle";
  }

  _weatherAlertActiveAlerts(cfg) {
    const st = this._state(cfg.entity);
    const attrs = st?.attributes || {};
    return this._weatherAlertPhenomena()
      .map((name) => ({ name, level: attrs[name] }))
      .filter((item) => this._weatherAlertSeverity(item.level) > 0);
  }

  _tapActionEntity(cfg) {
    const tap = cfg?.tap_action || cfg?.tapAction || null;
    if (tap && typeof tap === "object" && String(tap.action || "") === "more-info") return tap.entity || cfg.tap_entity || cfg.entity || cfg.level_entity;
    return cfg?.tap_entity || cfg?.more_info_entity || cfg?.entity || cfg?.level_entity || "";
  }

  _buildWeatherAlertPills(cfg, order = 0) {
    const alerts = this._weatherAlertActiveAlerts(cfg);
    const basePriority = Number.isFinite(Number(cfg.priority)) ? Number(cfg.priority) : 10;
    const actionEntity = this._tapActionEntity(cfg);
    return alerts.map((alert, index) => {
      const p = this._weatherAlertPalette(alert.level);
      const severity = this._weatherAlertSeverity(alert.level);
      return {
        kind: "weather-alert",
        label: alert.name,
        icon: this._weatherAlertIconFor(alert.name),
        levelLabel: String(alert.level || ""),
        mainText: String(alert.level || ""),
        subtitle: this._riskSecondaryText(cfg, alert.name),
        severity,
        priority: basePriority + (index / 100) + (order / 10000),
        title: `${alert.name} · ${alert.level}`,
        actionEntity,
        style: `--accent:${p.accent}; --soft:${p.soft};`,
        secondaryScroll: cfg.secondary_line_scroll === true,
        config: cfg,
        className: `weather-alert-pill risk-tile severity-${severity}`,
      };
    });
  }

  _buildGenericRiskChip(cfg, order = 0) {
    const gateState = cfg.entity ? this._state(cfg.entity) : null;
    const levelState = cfg.level_entity ? this._state(cfg.level_entity) : null;

    if (cfg.entity && !gateState) return null;

    if (cfg.entity) {
      const activeRaw = cfg.active_attribute
        ? this._readAttribute(gateState, cfg.active_attribute)
        : null;

      if (cfg.active_attribute && !this._isTruthyRiskValue(activeRaw)) return null;

      const entityIsOnlyGate = !cfg.level_source && !cfg.level_attribute && !cfg.level_when_active && cfg.level_entity;
      const entityProvidesLevel = cfg.level_source === "state" || cfg.level_attribute || cfg.level_when_active || !cfg.level_entity;
      if (entityIsOnlyGate && !this._isActiveRiskState(gateState)) return null;
      if (!cfg.active_attribute && !entityProvidesLevel && !this._isActiveRiskState(gateState)) return null;
    }

    const levelRaw =
      cfg.level ??
      cfg.level_when_active ??
      (cfg.level_source === "state" ? gateState?.state : undefined) ??
      (cfg.level_entity ? levelState?.state : undefined) ??
      (cfg.level_attribute ? this._readAttribute(gateState, cfg.level_attribute) : undefined) ??
      gateState?.state;

    const level = this._riskLevelFromValue(levelRaw, cfg);
    if (level === "none") return null;

    const messageRaw =
      (cfg.message_source === "state" ? gateState?.state : undefined) ??
      (cfg.message_entity ? this._state(cfg.message_entity)?.state : undefined) ??
      (cfg.message_attribute ? (this._readAttribute(gateState, cfg.message_attribute) ?? this._readAttribute(levelState, cfg.message_attribute)) : undefined) ??
      (cfg.level_attribute ? this._readAttribute(gateState, cfg.level_attribute) : undefined) ??
      levelState?.state ??
      gateState?.state ??
      cfg.level ??
      "";

    const label = cfg.label
      || cfg.name
      || levelState?.attributes?.friendly_name
      || gateState?.attributes?.friendly_name
      || cfg.level_entity
      || cfg.entity
      || "Risque";

    const basePriority = Number.isFinite(Number(cfg.priority)) ? Number(cfg.priority) : 50;
    const actionEntity = this._tapActionEntity(cfg);
    const blink = cfg.blink === true && (level === "critique" || level === "fort" || level === "alert");

    const mainText = this._riskPrimaryText(level, levelRaw, cfg);
    const fallbackSubtitle = cfg.subtitle || this._riskSubtitleText(label, messageRaw, levelRaw);
    const subtitle = this._riskSecondaryText(cfg, fallbackSubtitle);

    return {
      kind: "generic",
      label,
      icon: cfg.icon || "",
      level,
      mainText,
      subtitle,
      priority: basePriority + (order / 10000),
      title: `${label}${messageRaw ? ` · ${messageRaw}` : ""}`,
      actionEntity,
      secondaryScroll: cfg.secondary_line_scroll === true,
      config: cfg,
      className: `risk-pill risk-tile risk-${level}${blink ? " risk-blink" : ""}`,
    };
  }

  _riskDisplayMode() {
    const raw = String(this.config.risk_display_mode || (this.config.show_alerts_footer === false ? "header_sub_buttons" : "footer")).trim().toLowerCase();
    return raw === "header_sub_buttons" || raw === "header" || raw === "sub_buttons" ? "header_sub_buttons" : "footer";
  }

  _riskSecondaryScrollDuration(text = "", cfg = {}) {
    if (cfg.secondary_line_scroll_duration !== undefined && cfg.secondary_line_scroll_duration !== null) {
      const raw = cfg.secondary_line_scroll_duration;
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) return `${Math.max(10, Math.min(36, n))}s`;
      const str = String(raw).trim();
      if (/^\d+(\.\d+)?s$/.test(str)) return str;
    }

    const speed = String(cfg.secondary_line_scroll_speed || this.config.secondary_line_scroll_speed || "bubble").toLowerCase();
    const len = String(text || "").length;
    if (speed === "slow") return `${Math.max(20, Math.min(38, 16 + Math.round(len * 0.35)))}s`;
    if (speed === "fast") return `${Math.max(10, Math.min(18, 8 + Math.round(len * 0.18)))}s`;
    // Bubble-like par défaut : lent, doux, avec pauses en début/fin via keyframes CSS.
    return `${Math.max(16, Math.min(30, 12 + Math.round(len * 0.28)))}s`;
  }

  _riskChipData() {
    const mode = this._riskDisplayMode();
    const enabled = this.config.show_header_risk_pills !== false && this.config.show_current_risk_pills !== false;
    if (!enabled) return [];
    if (mode === "footer" && this.config.show_alerts_footer === false) return [];

    const chips = [];
    this._riskConfigItems().forEach((cfg, index) => {
      if (cfg.mode === "weather_alert_pills") {
        chips.push(...this._buildWeatherAlertPills(cfg, index));
        return;
      }
      const chip = this._buildGenericRiskChip(cfg, index);
      if (chip) chips.push(chip);
    });

    return chips.sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50));
  }

  _renderRiskPills() {
    const pills = this._riskChipData();
    if (!pills.length) return "";

    return `
      <div class="risk-pills-slider" aria-label="Risques actuels">
        ${pills.map((pill) => {
          const actionAttr = pill.actionEntity ? ` data-more-info="${this._escapeHtml(pill.actionEntity)}" role="button" tabindex="0"` : "";
          const subtitle = String(pill.subtitle || "").trim();
          const subtitleScroll = subtitle && pill.secondaryScroll === true ? " scroll" : "";
          const subtitleDuration = subtitleScroll ? ` style="--risk-subtitle-duration:${this._riskSecondaryScrollDuration(subtitle, pill.config || {})};"` : "";
          if (pill.kind === "weather-alert") {
            return `
              <span class="${this._escapeHtml(pill.className)}" style="${this._escapeHtml(pill.style)}" title="${this._escapeHtml(pill.title)}"${actionAttr}>
                <span class="risk-icon"><ha-icon icon="${this._escapeHtml(pill.icon)}"></ha-icon></span>
                <span class="risk-copy${subtitle ? "" : " no-subtitle"}">
                  <span class="risk-main">${this._escapeHtml(pill.mainText || pill.levelLabel || "Alerte")}</span>
                  ${subtitle ? `<span class="risk-subtitle${subtitleScroll}"${subtitleDuration}><span>${this._escapeHtml(subtitle)}</span></span>` : ""}
                </span>
              </span>
            `;
          }
          return `
            <span class="${this._escapeHtml(pill.className)}" title="${this._escapeHtml(pill.title)}"${actionAttr}>
              ${pill.icon ? `<span class="risk-icon"><ha-icon icon="${this._escapeHtml(pill.icon)}"></ha-icon></span>` : ""}
              <span class="risk-copy${subtitle ? "" : " no-subtitle"}">
                <span class="risk-main">${this._escapeHtml(pill.mainText || pill.label)}</span>
                ${subtitle ? `<span class="risk-subtitle${subtitleScroll}"${subtitleDuration}><span>${this._escapeHtml(subtitle)}</span></span>` : ""}
              </span>
            </span>
          `;
        }).join("")}
      </div>
    `;
  }

  _headerRiskSubButtonOptions() {
    const nested = this.config.header_risk_sub_buttons && typeof this.config.header_risk_sub_buttons === "object"
      ? this.config.header_risk_sub_buttons
      : {};
    return {
      showTooltip: nested.show_tooltip !== false,
      size: Math.max(28, Math.min(44, Number(nested.size ?? this.config.header_risk_sub_buttons_size ?? 36) || 36)),
      gap: Math.max(2, Math.min(16, Number(nested.gap ?? this.config.header_risk_sub_buttons_gap ?? 8) || 8)),
      maxItems: Math.max(1, Number(nested.max_items ?? this.config.header_risk_sub_buttons_max_items ?? 4) || 4),
    };
  }

  _renderHeaderRiskSubButtons() {
    if (this._riskDisplayMode() !== "header_sub_buttons") return "";
    const pills = this._riskChipData();
    if (!pills.length) return "";

    const opts = this._headerRiskSubButtonOptions();
    const visible = pills.slice(0, opts.maxItems);
    const extra = Math.max(0, pills.length - visible.length);
    const styleVars = `--risk-subbutton-size:${opts.size}px; --risk-subbutton-gap:${opts.gap}px;`;

    return `
      <div class="header-risk-subbuttons" style="${this._escapeHtml(styleVars)}" aria-label="Risques actuels">
        ${visible.map((pill) => {
          const actionAttr = pill.actionEntity ? ` data-more-info="${this._escapeHtml(pill.actionEntity)}" role="button" tabindex="0"` : "";
          const style = pill.kind === "weather-alert" ? ` style="${this._escapeHtml(`${styleVars} ${pill.style || ""}`)}"` : "";
          const cls = pill.kind === "weather-alert"
            ? `risk-sub-button weather-alert-sub-button severity-${pill.severity}`
            : `risk-sub-button risk-${pill.level || "neutre"}${pill.className?.includes("risk-blink") ? " risk-blink" : ""}`;
          const tooltip = opts.showTooltip ? ` title="${this._escapeHtml(pill.title || pill.label || "Risque")}" aria-label="${this._escapeHtml(pill.title || pill.label || "Risque")}"` : "";
          return `
            <button type="button" class="${this._escapeHtml(cls)}"${style}${tooltip}${actionAttr}>
              ${pill.icon ? `<ha-icon icon="${this._escapeHtml(pill.icon)}"></ha-icon>` : ""}
            </button>
          `;
        }).join("")}
        ${extra ? `<span class="risk-sub-button risk-more" title="${this._escapeHtml(String(extra))} risque(s) supplémentaire(s)" aria-label="${this._escapeHtml(String(extra))} risque(s) supplémentaire(s)">+${extra}</span>` : ""}
      </div>
    `;
  }

  _renderAlertsFooter() {
    if (this._riskDisplayMode() !== "footer") return "";
    const slider = this._renderRiskPills();
    if (!slider) return "";
    const align = String(this.config.alerts_footer_align || "start").toLowerCase();
    return `
      <div class="alerts-footer align-${align === "end" || align === "right" ? "end" : "start"}">
        ${slider}
      </div>
    `;
  }

  _setupRiskPillInteractions() {
    const containers = Array.from(this.shadowRoot?.querySelectorAll(".risk-pills-slider, .header-risk-subbuttons") || []);

    // Animation Bubble-like : uniquement si le texte secondaire dépasse réellement.
    containers.forEach((container) => {
      container.querySelectorAll(".risk-subtitle.scroll").forEach((subtitle) => {
        const inner = subtitle.querySelector("span");
        if (!inner) return;
        const overflowing = inner.scrollWidth > subtitle.clientWidth + 2;
        subtitle.classList.toggle("is-overflowing", overflowing);
      });
    });

    containers.forEach((container) => {
      if (!container || container.dataset.riskBound === "true") return;
      container.dataset.riskBound = "true";

      let startX = 0;
      let startY = 0;
      let horizontal = false;

      container.addEventListener("touchstart", (event) => {
        const t = event.touches?.[0];
        if (!t) return;
        startX = t.clientX;
        startY = t.clientY;
        horizontal = false;
        event.stopPropagation();
      }, { passive: true });

      container.addEventListener("touchmove", (event) => {
        const t = event.touches?.[0];
        if (!t) return;
        const dx = Math.abs(t.clientX - startX);
        const dy = Math.abs(t.clientY - startY);
        if (dx > 4 && dx > dy) {
          horizontal = true;
          event.stopPropagation();
        }
      }, { passive: true });

      container.addEventListener("touchend", (event) => {
        if (horizontal) event.stopPropagation();
        horizontal = false;
      }, { passive: true });

      container.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
          container.scrollLeft += event.deltaY;
          event.preventDefault();
          event.stopPropagation();
        }
      }, { passive: false });

      container.querySelectorAll("[data-more-info]").forEach((el) => {
        const open = () => this._openMoreInfo(el.dataset.moreInfo);
        el.addEventListener("click", open);
        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
          }
        });
      });
    });
  }

  _openMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _mainHeaderTapAction() {
    return this.config.main_header_tap_action || this.config.header_tap_action || { action: "navigate", navigation_path: "#meteo" };
  }

  _handleAction(actionConfig) {
    const cfg = actionConfig && typeof actionConfig === "object" ? actionConfig : { action: "navigate", navigation_path: "#meteo" };
    const action = String(cfg.action || "navigate").toLowerCase();

    if (action === "none") return;
    if (action === "more-info") {
      this._openMoreInfo(cfg.entity || this.config.weather_entity);
      return;
    }
    if (action === "navigate") {
      const path = cfg.navigation_path || cfg.path || cfg.url || "#meteo";
      if (String(path).startsWith("#")) {
        window.location.hash = path;
      } else {
        window.history.pushState(null, "", path);
        window.dispatchEvent(new Event("location-changed"));
      }
      return;
    }
    if (action === "url") {
      const url = cfg.url_path || cfg.url || cfg.navigation_path;
      if (url) window.open(url, cfg.new_tab === false ? "_self" : "_blank");
      return;
    }
    if (action === "call-service" || action === "call_service") {
      const service = cfg.service || "";
      const [domain, serviceName] = service.split(".");
      if (domain && serviceName && this._hass?.callService) {
        this._hass.callService(domain, serviceName, cfg.service_data || cfg.data || {}, cfg.target || undefined);
      }
      return;
    }
    if (action === "fire-dom-event") {
      this.dispatchEvent(new CustomEvent("ll-custom", { detail: cfg, bubbles: true, composed: true }));
    }
  }

  _setupMainHeaderAction() {
    const el = this.shadowRoot?.querySelector("[data-main-header-action]");
    if (!el || el.dataset.mainHeaderBound === "true") return;
    el.dataset.mainHeaderBound = "true";
    const run = () => this._handleAction(this._mainHeaderTapAction());
    el.addEventListener("click", (event) => { event.stopPropagation(); run(); });
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        run();
      }
    });
  }

  _renderHeader(entries = []) {
    const showHeader = this.config.show_header !== false;
    const showLegacyTitle = this.config.show_title !== false;
    if (!showHeader) {
      return showLegacyTitle ? `
        <div class="header legacy-header">
          <div>
            <div class="title">${this._escapeHtml(this.config.title || "Prévisions météo")}</div>
            <div class="subtitle">Timeline commune · température · pluie · vent</div>
          </div>
        </div>
      ` : "";
    }

    const weatherState = this._state(this.config.weather_entity)?.state || "cloudy";
    const temp = this._currentTemperatureValue();
    const tempLabel = Number.isFinite(temp.value) ? `${this._formatNumber(temp.value, 0)}°` : "--";
    const tempRange = this.config.show_header_temperature_range !== false ? this._currentTemperatureRange(entries, temp.value) : null;
    const tempGauge = tempRange ? this._renderHeaderTempGauge(temp.value, tempRange) : "";
    const summary = this._currentSummaryText();
    const isDetailed = String(this.config.header_mode || "compact") === "detailed";
    const showTitle = this.config.show_header_title !== false && this.config.show_title !== false;
    const showIcon = this.config.show_current_weather_icon !== false;
    const showTemp = this.config.show_current_temperature !== false;
    const showSummary = this.config.show_current_summary !== false;

    const compactTitle = showTitle && !showSummary ? this._escapeHtml(this.config.title || "Prévisions météo") : "";
    const summaryText = showSummary ? this._escapeHtml(summary) : compactTitle;
    const headerRiskSubButtons = this._renderHeaderRiskSubButtons();

    return `
      <div class="combined-header mode-${isDetailed ? "detailed" : "compact"}">
        <div class="header-left" data-main-header-action="true" role="button" tabindex="0" title="Ouvrir la météo">
          ${showIcon ? `<div class="header-icon">${this._weatherIconSvg(weatherState)}</div>` : ""}
          <div class="header-copy" title="${this._escapeHtml(temp.source || "")}">
            <div class="header-mainline">
              ${showTemp ? `<span class="header-temp-value">${this._escapeHtml(tempLabel)}</span>` : ""}
              ${summaryText ? `<span class="header-summary">${summaryText}</span>` : ""}
            </div>
            ${isDetailed && showTitle && showSummary ? `<div class="header-title">${this._escapeHtml(this.config.title || "Prévisions météo")}</div>` : ""}
            ${tempGauge}
          </div>
        </div>
        ${headerRiskSubButtons}
      </div>
    `;
  }

  _setupScrollInteractions() {
    const rail = this.shadowRoot?.querySelector(".combined-scroll");
    if (!rail || rail.dataset.combinedBound === "true") return;
    rail.dataset.combinedBound = "true";

    const restoreScroll = () => {
      if (Number.isFinite(this._scrollLeft)) rail.scrollLeft = this._scrollLeft;
    };
    restoreScroll();
    this._queueFrame(restoreScroll);
    this._queueTimeout(restoreScroll, 80);

    rail.addEventListener("scroll", () => { this._scrollLeft = rail.scrollLeft; }, { passive: true });

    rail.addEventListener("wheel", (event) => {
      if (!event.shiftKey && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        rail.scrollLeft += event.deltaY;
        this._scrollLeft = rail.scrollLeft;
        event.preventDefault();
      }
    }, { passive: false });

    rail.addEventListener("touchstart", () => {
      this._isInteracting = true;
      this._scrollLeft = rail.scrollLeft;
    }, { passive: true });

    rail.addEventListener("touchmove", () => {
      this._scrollLeft = rail.scrollLeft;
    }, { passive: true });

    rail.addEventListener("touchend", () => {
      this._scrollLeft = rail.scrollLeft;
      this._queueTimeout(() => {
        this._isInteracting = false;
        if (this._pendingRender) {
          this._pendingRender = false;
          this.renderCard(true);
        }
      }, 180);
    }, { passive: true });

    rail.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      this._isInteracting = true;
      this._dragState = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: rail.scrollLeft, moved: false };
      rail.setPointerCapture?.(event.pointerId);
      rail.classList.add("is-dragging");
    });

    rail.addEventListener("pointermove", (event) => {
      if (!this._dragState || this._dragState.pointerId !== event.pointerId) return;
      const dx = event.clientX - this._dragState.startX;
      if (Math.abs(dx) > 3) this._dragState.moved = true;
      rail.scrollLeft = this._dragState.startScrollLeft - dx;
      this._scrollLeft = rail.scrollLeft;
    });

    const endDrag = (event) => {
      if (!this._dragState || this._dragState.pointerId !== event.pointerId) return;
      rail.releasePointerCapture?.(event.pointerId);
      rail.classList.remove("is-dragging");
      this._dragState = null;
      this._scrollLeft = rail.scrollLeft;
      this._queueTimeout(() => {
        this._isInteracting = false;
        if (this._pendingRender) {
          this._pendingRender = false;
          this.renderCard(true);
        }
      }, 100);
    };

    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    rail.addEventListener("pointerleave", (event) => {
      if (this._dragState?.pointerId === event.pointerId) endDrag(event);
    });
  }

  renderCard(force = false) {
    if (!this.isConnected || !this.shadowRoot || !this.config) return;
    const oldRail = this.shadowRoot.querySelector?.(".combined-scroll");
    if (oldRail) this._scrollLeft = oldRail.scrollLeft;
    if (this._isInteracting && !force && oldRail) {
      this._pendingRender = true;
      return;
    }

    const entries = this._enrichEntries(this._forecastEntries());
    const itemWidth = Math.max(56, Number(this.config.item_width) || 68);
    const width = Math.max(itemWidth * Math.max(1, entries.length), itemWidth * 3);
    const mode = this._weatherMode();
    const renderKey = JSON.stringify({
      mode,
      config: {
        show_title: this.config.show_title, show_header: this.config.show_header, header_mode: this.config.header_mode,
        show_header_title: this.config.show_header_title, show_current_weather_icon: this.config.show_current_weather_icon,
        show_current_temperature: this.config.show_current_temperature, show_current_summary: this.config.show_current_summary,
        show_header_temperature_range: this.config.show_header_temperature_range,
        main_header_tap_action: this.config.main_header_tap_action || this.config.header_tap_action, show_alerts_footer: this.config.show_alerts_footer, alerts_footer_align: this.config.alerts_footer_align, alerts_footer_scroll: this.config.alerts_footer_scroll,
        risk_display_mode: this.config.risk_display_mode, header_risk_sub_buttons_show_label: this.config.header_risk_sub_buttons_show_label, header_risk_sub_buttons_show_icon: this.config.header_risk_sub_buttons_show_icon, header_risk_sub_buttons_max_items: this.config.header_risk_sub_buttons_max_items, secondary_line_scroll_speed: this.config.secondary_line_scroll_speed,
        current_temperature_entity: this.config.current_temperature_entity, current_min_temperature_entity: this.config.current_min_temperature_entity, current_max_temperature_entity: this.config.current_max_temperature_entity, current_summary_entity: this.config.current_summary_entity,
        show_current: this.config.show_current, hours_to_show: this.config.hours_to_show,
        item_width: this.config.item_width, chart_height: this.config.chart_height, weather_background_opacity: this.config.weather_background_opacity,
        sun_entity: this.config.sun_entity, show_sun_markers: this.config.show_sun_markers, highlight_day_changes: this.config.highlight_day_changes,
      },
      sun: { next_rising: this._state(this.config.sun_entity || "sun.sun")?.attributes?.next_rising, next_setting: this._state(this.config.sun_entity || "sun.sun")?.attributes?.next_setting },
      header: { weather: this._state(this.config.weather_entity)?.state, weather_temp: this._state(this.config.weather_entity)?.attributes?.temperature, current_temp: this.config.current_temperature_entity ? this._state(this.config.current_temperature_entity)?.state : null, current_min: this.config.current_min_temperature_entity ? this._state(this.config.current_min_temperature_entity)?.state : null, current_max: this.config.current_max_temperature_entity ? this._state(this.config.current_max_temperature_entity)?.state : null, current_summary: this.config.current_summary_entity ? this._state(this.config.current_summary_entity)?.state : null },
      risks: this._riskRenderSnapshot(),
      entries: entries.map((item) => [item.datetimeMs, item.isNowColumn, item.temperature, item.precipitation, item.probability, item.windSpeed, item.windGust, item.windBearing, item.condition]),
    });
    if (!force && renderKey === this._lastRenderKey && this.shadowRoot.querySelector(".combined-scroll")) {
      this._queueFrame(() => { this._setupScrollInteractions(); this._setupRiskPillInteractions(); this._setupMainHeaderAction(); });
      return;
    }
    this._lastRenderKey = renderKey;

    const header = this._renderHeader(entries);
    const alertsFooter = this._renderAlertsFooter();

    const body = entries.length ? `
      <div class="combined-scroll">
        <div class="combined-canvas" style="--item-width:${itemWidth}px; --slot-count:${entries.length}; width:${width}px">
          ${this._renderTimeRow(entries)}
          ${this._renderChartArea(entries, width)}
          ${this._renderWindLayer(entries)}
        </div>
      </div>
    ` : `<div class="empty">${this._escapeHtml(this.config.empty_label || "Aucune prévision disponible")}</div>`;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <ha-card class="combined-card weather-ios-${mode}" style="--weather-ios-opacity:${Number(this.config.weather_background_opacity ?? 0.58)};--weather-ios-speed:${Number(this.config.weather_background_speed ?? 0.9)}">
        ${header}
        ${body}
        ${alertsFooter}
      </ha-card>
    `;
    this._queueFrame(() => { this._setupScrollInteractions(); this._setupRiskPillInteractions(); this._setupMainHeaderAction(); });
  }

  _styles() {
    return `
      :host {
        display: block;
        --combined-border: rgba(255,255,255,0.13);
        --combined-soft-text: var(--secondary-text-color, rgba(255,255,255,0.66));
        --combined-rain: var(--blue-color, #38bdf8);
        --combined-rain-soft: rgba(56,189,248,0.14);
        --combined-surface: color-mix(in srgb, var(--ha-card-background, var(--card-background-color, #1c1c1e)) 42%, transparent);
      }

      .combined-card {
        position: relative;
        overflow: hidden !important;
        isolation: isolate;
        border-radius: 24px;
        background-clip: padding-box;
        contain: paint;
        transform: translateZ(0);
        clip-path: inset(0 round 24px);
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        padding: 12px 12px 13px;
        color: var(--primary-text-color);
        background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008)), var(--combined-surface);
        border: 1px solid var(--combined-border);
        box-shadow: 0 14px 32px rgba(0,0,0,0.12);
        backdrop-filter: blur(4px) saturate(1.16);
      }

      .combined-card::before,
      .combined-card::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        z-index: 0;
      }

      .combined-card::before {
        opacity: var(--weather-ios-opacity, 0.58);
        animation: weather-ios-bg-shift calc(18s / var(--weather-ios-speed, 1)) ease-in-out infinite alternate;
      }
      .combined-card::after { opacity: calc(var(--weather-ios-opacity, 0.58) * 0.78); mix-blend-mode: screen; }
      .weather-ios-sunny::before { background: radial-gradient(circle at 82% 18%, rgba(255,220,92,0.85), rgba(255,220,92,0.20) 22%, transparent 40%), linear-gradient(135deg, rgba(72,152,255,0.96), rgba(150,210,255,0.58), rgba(255,220,150,0.48)); }
      .weather-ios-sunny::after { background: radial-gradient(circle at 80% 18%, rgba(255,244,180,0.66), transparent 24%); }
      .weather-ios-night::before { background: radial-gradient(circle at 80% 20%, rgba(230,235,255,0.18), transparent 28%), linear-gradient(135deg, rgba(16,26,62,0.86), rgba(44,42,92,0.45), rgba(20,24,52,0.55)); }
      .weather-ios-night::after { background-image: radial-gradient(circle at 18% 28%, rgba(255,255,255,0.75) 0 1px, transparent 2px), radial-gradient(circle at 62% 32%, rgba(255,255,255,0.70) 0 1px, transparent 2px); }
      .weather-ios-partly::before { background: radial-gradient(circle at 82% 16%, rgba(255,220,80,0.70), rgba(255,220,80,0.18) 22%, transparent 36%), radial-gradient(ellipse at 18% 70%, rgba(255,255,255,0.38), transparent 56%), linear-gradient(135deg, rgba(82,156,255,0.78), rgba(150,204,255,0.48), rgba(242,221,180,0.36)); }
      .weather-ios-cloudy::before { background: radial-gradient(ellipse at 20% 40%, rgba(255,255,255,0.32), transparent 40%), radial-gradient(ellipse at 75% 70%, rgba(255,255,255,0.22), transparent 44%), linear-gradient(135deg, rgba(95,118,155,0.56), rgba(148,160,184,0.32), rgba(88,94,124,0.36)); }
      .weather-ios-rain::before, .weather-ios-pouring::before { background: radial-gradient(ellipse at 22% 35%, rgba(255,255,255,0.18), transparent 38%), linear-gradient(135deg, rgba(48,72,112,0.72), rgba(80,100,132,0.38), rgba(42,50,76,0.42)); }
      .weather-ios-rain::after, .weather-ios-pouring::after { background-image: repeating-linear-gradient(105deg, transparent 0 10px, rgba(120,190,255,0.36) 11px 13px, transparent 14px 28px); background-size: 130px 90px; animation: weather-ios-rain calc(0.9s / var(--weather-ios-speed, 1)) linear infinite; }
      .weather-ios-snow::before { background: radial-gradient(ellipse at 20% 45%, rgba(255,255,255,0.28), transparent 42%), linear-gradient(135deg, rgba(150,178,210,0.55), rgba(205,218,234,0.34), rgba(144,156,182,0.38)); }
      .weather-ios-fog::before { background: linear-gradient(135deg, rgba(112,122,140,0.42), rgba(155,160,172,0.28), rgba(105,108,124,0.34)); }
      .weather-ios-fog::after { background: linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.18) 28%, transparent 44%), linear-gradient(0deg, transparent 18%, rgba(255,255,255,0.15) 52%, transparent 72%); filter: blur(8px); }
      .weather-ios-storm::before { background: radial-gradient(ellipse at 20% 35%, rgba(255,255,255,0.14), transparent 36%), linear-gradient(135deg, rgba(30,38,70,0.72), rgba(74,66,112,0.38), rgba(30,28,56,0.44)); }
      .weather-ios-storm::after { background: repeating-linear-gradient(105deg, transparent 0 10px, rgba(120,190,255,0.36) 11px 13px, transparent 14px 28px), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.55), transparent 16%); background-size: 130px 90px, 100% 100%; animation: weather-ios-rain calc(0.85s / var(--weather-ios-speed, 1)) linear infinite; }

      @keyframes weather-ios-bg-shift { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(1.045) translate3d(0,-2%,0); } }
      @keyframes weather-ios-rain { from { background-position: 0 -30px; } to { background-position: -18px 42px; } }
      @keyframes risk-chip-pulse { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.18); } }

      .header, .combined-header, .combined-scroll, .empty { position: relative; z-index: 1; }

      .header { display: flex; align-items: center; justify-content: space-between; margin: 0 2px 8px; }
      .title { font-size: 15px; font-weight: 760; line-height: 1.12; letter-spacing: -0.01em; }
      .subtitle { margin-top: 3px; font-size: 11px; color: var(--combined-soft-text); line-height: 1.2; }
      .combined-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin: -1px 1px 8px;
        padding: 0 3px 0 1px;
        border-radius: 0;
        background: transparent;
        border: 0;
        box-shadow: none;
        backdrop-filter: none;
      }
      .combined-header.mode-detailed { align-items: center; }
      .header-left { min-width: 0; display: flex; align-items: center; gap: 10px; flex: 1 1 auto; }
      .header-icon { flex: 0 0 auto; width: 58px; height: 58px; display: grid; place-items: center; align-self: center; border-radius: 0; background: transparent; box-shadow: none; transform: translateY(1px); }
      .header-icon .weather-icon-svg { width: 54px; height: 54px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.24)); }
      .header-icon .weather-icon-svg svg { width: 54px; height: 54px; overflow: visible; }
      .header-copy { min-width: 0; display: grid; gap: 3px; align-content: center; justify-items: start; }
      .header-mainline { display: flex; align-items: baseline; gap: 7px; min-width: 0; }
      .header-title { font-size: 12px; font-weight: 720; line-height: 1.08; letter-spacing: -0.01em; color: color-mix(in srgb, var(--primary-text-color) 78%, transparent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 4px rgba(0,0,0,0.16); }
      .header-summary { font-size: 12.2px; font-weight: 720; line-height: 1.08; color: color-mix(in srgb, var(--primary-text-color) 86%, transparent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 3px rgba(0,0,0,0.16); }
      .header-temp-value { font-size: 26px; font-weight: 890; line-height: .95; letter-spacing: -0.04em; color: var(--primary-text-color); text-shadow: 0 2px 6px rgba(0,0,0,0.22); }
      .header-temp-range { margin-top: 4px; display: grid; grid-template-columns: auto minmax(46px, 72px) auto; align-items: center; gap: 5px; width: 100%; max-width: 142px; color: color-mix(in srgb, var(--primary-text-color) 88%, transparent); font-size: 9px; font-weight: 780; line-height: 1; }
      .range-track { position: relative; display: block; height: 3px; border-radius: 999px; background: var(--range-track-bg, linear-gradient(90deg, #60a5fa, #34d399, #f59e0b, #ef4444)); box-shadow: 0 0 0 1px rgba(255,255,255,0.24), 0 1px 4px rgba(0,0,0,0.18); }
      .range-dot { position: absolute; top: 50%; width: 6px; height: 6px; border-radius: 50%; transform: translate(-50%, -50%); background: var(--range-current-color, #ffffff); border: 1px solid rgba(255,255,255,0.96); box-shadow: 0 0 0 1px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.26); }
      .range-min, .range-max { opacity: .98; white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,0.20); }
      .range-min { color: var(--range-min-label-color, #9fdcff); }
      .range-max { color: var(--range-max-label-color, #ffffff); }
      .header-temp, .header-temp-label { display: none; }
      .header-left[data-main-header-action] { cursor: pointer; border-radius: 18px; }
      .header-left[data-main-header-action]:focus-visible { outline: 2px solid rgba(255,255,255,0.34); outline-offset: 3px; }
      .alerts-footer {
        margin-top: 7px;
        padding: 1px 1px 0;
        min-width: 0;
        box-sizing: border-box;
      }
      .alerts-footer.align-end .risk-pills-slider { justify-content: flex-end; }
      .risk-pills-slider {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 7px;
        flex-wrap: nowrap;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
        touch-action: pan-x;
        padding: 0 0 1px;
      }
      .risk-pills-slider::-webkit-scrollbar, .header-risk-subbuttons::-webkit-scrollbar { display: none; }
      .risk-tile {
        flex: 0 0 auto;
        width: auto;
        min-width: 76px;
        max-width: 114px;
        min-height: 32px;
        border-radius: 999px;
        padding: 3px 9px 3px 5px;
        display: inline-grid;
        grid-template-columns: 26px minmax(0, 1fr);
        align-items: center;
        gap: 6px;
        color: rgba(255,255,255,0.97);
        border: 1px solid rgba(255,255,255,0.13);
        box-shadow: none;
        background-clip: padding-box;
        overflow: hidden;
        isolation: isolate;
        text-shadow: 0 1px 3px rgba(0,0,0,0.20);
        white-space: nowrap;
        cursor: default;
        box-sizing: border-box;
        outline: none;
      }
      .risk-tile[role="button"] { cursor: pointer; }
      .risk-tile[role="button"]:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(255,255,255,0.18) inset; }
      .risk-icon {
        width: 26px;
        height: 26px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        background: rgba(255,255,255,0.13);
        box-shadow: none;
        color: currentColor;
        flex: 0 0 auto;
        line-height: 0;
      }
      .risk-icon ha-icon { --mdc-icon-size: 16px; width: 16px; height: 16px; display: grid; place-items: center; margin: 0; line-height: 0; color: currentColor; }
      .risk-copy { min-width: 0; display: grid; gap: 1px; align-content: center; justify-items: start; overflow: hidden; }
      .risk-copy.no-subtitle { justify-items: start; align-content: center; }
      .risk-main { max-width: 100%; overflow: hidden; text-overflow: ellipsis; font-size: 12.2px; font-weight: 880; line-height: 1.0; letter-spacing: -0.02em; }
      .risk-copy.no-subtitle .risk-main { line-height: 1.08; }
      .risk-subtitle { max-width: 100%; overflow: hidden; font-size: 9px; font-weight: 700; line-height: 1.0; opacity: .86; color: rgba(255,255,255,0.88); }
      .risk-subtitle > span { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; vertical-align: top; }
      .risk-subtitle.scroll > span { max-width: 100%; }
      .risk-subtitle.scroll.is-overflowing > span { max-width: none; padding-right: 22px; animation: risk-subtitle-marquee var(--risk-subtitle-duration, 18s) ease-in-out infinite; }
      @keyframes risk-subtitle-marquee { 0%, 22% { transform: translateX(0); } 72%, 100% { transform: translateX(calc(-100% + 74px)); } }
      /* Source de vérité visuelle : couleurs footer v1.17.5.
         Les sub-buttons header consomment les mêmes backgrounds que les risk pills du footer. */
      .risk-pill.risk-faible, .risk-sub-button.risk-faible { background: linear-gradient(135deg, rgba(255,214,10,0.44), rgba(255,214,10,0.18)); border-color: rgba(255,214,10,0.34); color: white; }
      .risk-pill.risk-moyen, .risk-sub-button.risk-moyen { background: linear-gradient(135deg, rgba(245,158,11,0.56), rgba(251,191,36,0.26)); border-color: rgba(251,191,36,0.40); color: white; }
      .risk-pill.risk-fort, .risk-sub-button.risk-fort { background: linear-gradient(135deg, rgba(239,68,68,0.64), rgba(248,113,113,0.30)); border-color: rgba(248,113,113,0.44); color: white; }
      .risk-pill.risk-critique, .risk-sub-button.risk-critique { background: linear-gradient(135deg, rgba(255,69,58,0.78), rgba(127,29,29,0.34)); border-color: rgba(255,69,58,0.58); color: white; box-shadow: none; }
      .risk-pill.risk-alert, .risk-sub-button.risk-alert { background: linear-gradient(135deg, rgba(239,68,68,0.58), rgba(245,158,11,0.26)); border-color: rgba(251,191,36,0.36); color: white; }
      .risk-pill.risk-neutre, .risk-sub-button.risk-neutre, .risk-more { background: linear-gradient(135deg, rgba(148,163,184,0.34), rgba(255,255,255,0.12)); border-color: rgba(255,255,255,0.23); color: rgba(255,255,255,0.90); }
      .risk-pill.risk-blink { animation: risk-chip-pulse 1.6s ease-in-out infinite; }
      .weather-alert-pill {
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--soft) 96%, transparent), rgba(255,255,255,.045) 76%),
          rgba(255,255,255,.045);
        box-shadow: none;
      }
      .weather-alert-pill .risk-icon { color: var(--accent); background: var(--soft); }
      .weather-alert-pill .risk-main { color: var(--accent); }
      .header-risk-subbuttons {
        flex: 0 0 auto;
        margin-left: auto;
        display: flex;
        gap: var(--risk-subbutton-gap, 8px);
        align-items: center;
        justify-content: flex-end;
        min-width: 0;
        max-width: 44%;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
        touch-action: pan-x;
        padding: 0;
      }
      .risk-sub-button {
        width: var(--risk-subbutton-size, 36px);
        height: var(--risk-subbutton-size, 36px);
        min-width: var(--risk-subbutton-size, 36px);
        min-height: var(--risk-subbutton-size, 36px);
        max-width: var(--risk-subbutton-size, 36px);
        max-height: var(--risk-subbutton-size, 36px);
        border-radius: 999px;
        border: 0;
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        flex: 0 0 auto;
        position: relative;
        overflow: hidden;
        background: var(--combined-risk-soft, rgba(255,255,255,0.12));
        color: white;
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        box-shadow: none;
        text-shadow: none;
      }
      .risk-sub-button ha-icon {
        --mdc-icon-size: 18px;
        width: 18px;
        height: 18px;
        display: grid;
        place-items: center;
        margin: 0;
        padding: 0;
        line-height: 0;
        color: currentColor;
      }
      .risk-sub-button[role="button"] { cursor: pointer; }
      .risk-sub-button:focus-visible, .risk-sub-button[role="button"]:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(255,255,255,0.22) inset; }
      /* Vigilance : le header sub-button reprend la couleur du risk_icon footer weather-alert-pill v1.17.5. */
      .weather-alert-sub-button { background: var(--soft); color: var(--accent); }

      .combined-scroll {
        overflow-x: auto;
        overflow-y: hidden;
        padding: 1px 1px 3px;
        scrollbar-width: none;
        overscroll-behavior-x: contain;
        touch-action: pan-x;
        cursor: grab;
        user-select: none;
        -webkit-overflow-scrolling: touch;
      }
      .combined-scroll::-webkit-scrollbar { display: none; }
      .combined-scroll.is-dragging { cursor: grabbing; }
      .combined-canvas { min-width: 100%; display: grid; gap: 0; }
      .time-row, .wind-row { display: grid; grid-template-columns: repeat(var(--slot-count), var(--item-width)); grid-auto-flow: column; grid-auto-columns: var(--item-width); }
      .time-row { padding: 2px 0 5px; }
      .time-cell { position: relative; text-align: center; font-size: 11.8px; font-weight: 760; color: var(--combined-soft-text); line-height: 1.05; display: grid; justify-items: center; gap: 6px; min-height: 40px; align-content: start; }
      .time-label { display: inline-flex; align-items: center; justify-content: center; min-height: 13px; }
      .weather-icon-svg { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; opacity: 0.98; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.20)); transform: translateY(0); }
      .weather-icon-svg svg { width: 28px; height: 28px; display: block; overflow: visible; }
      .weather-icon-svg .sun { fill: var(--weather-icon-sun-color, #fdd93c); }
      .weather-icon-svg .moon { fill: var(--weather-icon-moon-color, #fcf497); }
      .weather-icon-svg .cloud-back { fill: var(--weather-icon-cloud-back-color, #d4d4d4); }
      .weather-icon-svg .cloud-front { fill: var(--weather-icon-cloud-front-color, #f9f9f9); }
      .weather-icon-svg .rain { fill: var(--weather-icon-rain-color, #30b3ff); }
      .weather-icon-svg .snow { fill: var(--weather-icon-snow-color, #f9f9f9); stroke: var(--weather-icon-snow-stroke-color, #d4d4d4); stroke-width: .8; }
      .weather-icon-svg .lightning { fill: var(--weather-icon-sun-color, #fdd93c); }
      .weather-icon-svg .windy, .weather-icon-svg .fog { fill: var(--weather-icon-cloud-front-color, #f9f9f9); opacity: .92; }
      .weather-icon-sunny svg { transform: scale(1.08); transform-origin: center; }
      .weather-icon-clear-night svg { transform: scale(1.02); transform-origin: center; }
      .weather-icon-partlycloudy svg { transform: scale(1.05); transform-origin: center; }
      .time-cell.is-current, .time-cell.is-day-marker, .time-cell.is-solar { color: var(--primary-text-color); }
      .time-cell.is-current .time-label,
      .time-cell.is-day-marker .time-label,
      .time-cell.is-solar .time-label { padding: 1px 6px; border-radius: 999px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18), 0 2px 8px rgba(0,0,0,0.08); }
      .time-cell.is-current .time-label { background: linear-gradient(135deg, rgba(59,130,246,0.54), rgba(96,165,250,0.32)); color: #ffffff; }
      .time-cell.is-day-marker .time-label { background: linear-gradient(135deg, rgba(59,130,246,0.56), rgba(96,165,250,0.34)); color: #ffffff; }
      .time-cell.is-sunrise .time-label { background: rgba(249, 115, 22, 0.27); color: #fed7aa; }
      .time-cell.is-sunset .time-label { background: rgba(99, 102, 241, 0.30); color: #ddd6fe; }
      .graph-combo { position: relative; overflow: hidden; }
      .separator-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 0; }
      .chart-zone { position: relative; height: ${Number(this.config.chart_height) || 78}px; overflow: hidden; z-index: 1; }
      .chart-svg { display: block; width: 100%; height: 100%; overflow: visible; }
      .grid-line { stroke: rgba(255,255,255,0.205); stroke-width: .75; stroke-dasharray: 2.2 5.0; stroke-linecap: round; vector-effect: non-scaling-stroke; shape-rendering: geometricPrecision; }
      .temp-path { fill: none; stroke-width: 2.55; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 4px rgba(255,255,255,0.08)); }
      .temp-glow { stroke-width: 7.5; opacity: 0.115; filter: none; }
      .temp-dot { fill: color-mix(in srgb, var(--ha-card-background, #1c1c1e) 88%, transparent); stroke-width: 1.45; vector-effect: non-scaling-stroke; }
      .temp-dot.is-current { fill: var(--primary-text-color); }
      .temp-label { text-anchor: middle; paint-order: stroke; stroke: rgba(0,0,0,0.24); stroke-width: 2px; vector-effect: non-scaling-stroke; fill: var(--primary-text-color); font-size: 11.7px; font-weight: 820; }
      .rain-bar { vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 5px rgba(56,189,248,0.09)); }
      .chart-baseline { stroke: rgba(255,255,255,0.145); stroke-width: .9; vector-effect: non-scaling-stroke; }
      .rain-info-row { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(var(--slot-count), var(--item-width)); height: 22px; min-height: 22px; max-height: 22px; align-items: end; padding: 1px 0 1px; box-sizing: border-box; }
      .rain-info-cell { position: relative; min-width: 0; display: grid; justify-items: center; align-content: end; gap: 0; line-height: 1.0; min-height: 18px; }
      .rain-mm { color: var(--primary-text-color); font-size: 9.4px; font-weight: 760; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.20); }
      .rain-prob { color: var(--combined-rain); font-size: 9.3px; font-weight: 760; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.16); }
      .rain-empty { opacity: 0; }
      .wind-row { padding: 2px 0 0; }
      .wind-cell { position: relative; min-width: 0; display: grid; justify-items: center; gap: 3px; padding: 0 2px; }
      .wind-cell + .wind-cell::before { content: none; }
      .wind-compact { position: relative; width: 24px; height: 24px; border-radius: 999px; display: grid; place-items: center; color: var(--wind-level-color, var(--primary-text-color)); background: radial-gradient(circle at 35% 26%, rgba(255,255,255,0.22), transparent 36%), color-mix(in srgb, var(--wind-level-color, var(--primary-text-color)) 16%, rgba(255,255,255,0.04)); border: 1px solid color-mix(in srgb, var(--wind-level-color, var(--primary-text-color)) 52%, rgba(255,255,255,0.14)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 12px rgba(0,0,0,0.08); }
      .wind-arrow-compact { position: absolute; inset: -9px; width: 42px; height: 42px; overflow: visible; color: var(--wind-level-color, var(--primary-text-color)); opacity: 0.96; }
      .wind-head { fill: currentColor; stroke: color-mix(in srgb, currentColor 74%, rgba(255,255,255,0.72)); stroke-width: .55; stroke-linejoin: round; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.16)); }
      .wind-tip-stem { stroke: currentColor; stroke-width: 1.15; stroke-linecap: round; opacity: 0.78; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.12)); }
      .wind-tail { stroke: currentColor; stroke-width: 1.25; stroke-linecap: round; opacity: 0.52; }
      .wind-speed { position: relative; z-index: 1; font-size: 10.2px; font-weight: 850; line-height: 1; color: var(--primary-text-color); text-shadow: 0 1px 3px rgba(0,0,0,0.22); }
      .wind-meta { color: var(--combined-soft-text); font-size: 8.5px; font-weight: 650; line-height: 1.05; text-align: center; white-space: nowrap; display: grid; gap: 1px; }
      .wind-meta .gust.level-medium { color: var(--warning-color, #f59e0b); }
      .wind-meta .gust.level-high { color: var(--error-color, #ef4444); }
      .wind-meta .gust.level-low { color: rgba(129, 212, 160, 0.95); }
      .empty { border-radius: 18px; padding: 16px 12px; text-align: center; color: var(--combined-soft-text); font-size: 13px; background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.11); }
      @media (max-width: 460px) { .combined-card { border-radius: 22px; clip-path: inset(0 round 22px); padding: 11px 10px 12px; } .combined-header { margin-bottom: 7px; padding: 0 2px 0 0; gap: 8px; } .header-left { gap: 8px; } .header-icon { width: 54px; height: 54px; transform: translateY(1px); } .header-icon .weather-icon-svg, .header-icon .weather-icon-svg svg { width: 50px; height: 50px; } .header-mainline { gap: 6px; } .header-title { font-size: 10.8px; } .header-summary { font-size: 11.1px; } .header-temp-value { font-size: 23px; } .header-temp-range { grid-template-columns: auto minmax(40px, 62px) auto; gap: 4px; font-size: 8.2px; margin-top: 4px; } .alerts-footer { margin-top: 6px; padding: 0 1px; } .risk-pills-slider { gap: 6px; } .risk-tile { min-width: 72px; max-width: 108px; min-height: 31px; padding: 3px 8px 3px 5px; border-radius: 999px; grid-template-columns: 25px minmax(0,1fr); gap: 5px; } .risk-icon { width: 25px; height: 25px; } .risk-icon ha-icon { --mdc-icon-size: 15.5px; width: 15.5px; height: 15.5px; } .risk-main { font-size: 11.8px; } .risk-subtitle { font-size: 8.8px; } .header-risk-subbuttons { max-width: 38%; --risk-subbutton-size: 34px; --risk-subbutton-gap: 6px; } .risk-sub-button ha-icon { --mdc-icon-size: 17px; width: 17px; height: 17px; } .range-track { height: 3px; } .time-cell { font-size: 11.8px; } .weather-icon-svg { width: 28px; height: 28px; } .weather-icon-svg svg { width: 28px; height: 28px; } .wind-compact { width: 23px; height: 23px; } .wind-arrow-compact { width: 41px; height: 41px; } }
    `;
  }
}

if (!customElements.get("weather-combined-forecast-card")) {
  customElements.define("weather-combined-forecast-card", WeatherCombinedForecastCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === "weather-combined-forecast-card")) {
  window.customCards.push({
    type: "weather-combined-forecast-card",
    name: "Weather Combined Forecast",
    description: "Météo actuelle, prévisions, pluie, vent et risques configurables.",
    documentationURL: "https://github.com/smornierHA/ha-board/blob/main/docs/CARDS.md#weather-combined-forecast",
    preview: true,
  });
}

// Patch only fields emitted by ha-form; preserve unknown YAML and nested objects.
class WeatherCombinedForecastEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this._generation = 0;
  }
  setConfig(config) { this._config = structuredClone(config || {}); this._updateForm(); }
  set hass(hass) { this._hass = hass; this._updateForm(); }
  connectedCallback() { this._mountForm(); }
  disconnectedCallback() { ++this._generation; clearTimeout(this._waitTimer); }
  async _mountForm() {
    const generation = ++this._generation;
    this.shadowRoot.textContent = 'Chargement de l’éditeur…';
    const ready = await Promise.race([
      customElements.whenDefined('ha-form').then(() => true),
      new Promise(resolve => { this._waitTimer = setTimeout(() => resolve(false), 10000); }),
    ]);
    clearTimeout(this._waitTimer);
    if (!this.isConnected || generation !== this._generation) return;
    if (!ready) {
      this.shadowRoot.textContent = 'Éditeur indisponible. Rouvrir la carte ou utiliser YAML.';
      return;
    }
    this._form = document.createElement('ha-form');
    this._form.addEventListener('value-changed', event => this._valueChanged(event));
    this.shadowRoot.replaceChildren(this._form);
    this._updateForm();
  }
  _updateForm() {
    if (!this._form) return;
    const {schema,computeLabel} = WeatherCombinedForecastCard.getConfigForm();
    this._form.hass = this._hass;
    this._form.schema = schema;
    this._form.computeLabel = computeLabel;
    this._formData = {
      ...WeatherCombinedForecastCard.getDefaultConfig(),
      ...structuredClone(this._config || {}),
    };
    this._form.data = structuredClone(this._formData);
  }
  _valueChanged(event) {
    event.stopPropagation();
    const data = event.detail?.value;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return;
    const {schema} = WeatherCombinedForecastCard.getConfigForm();
    const editable = new Set();
    const collect = items => items.forEach(item => {
      if (item.selector) editable.add(item.name);
      if (item.schema) collect(item.schema);
    });
    collect(schema);
    const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
    const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
    const defaults = WeatherCombinedForecastCard.getDefaultConfig();
    const previous = this._formData || {...defaults, ...this._config};
    const editableValues = Object.keys(data).filter(key => editable.has(key));
    const fullSnapshot = editableValues.length > 1;
    const next = structuredClone(this._config || {});

    for (const key of editable) {
      if (own(data, key)) {
        if (same(data[key], previous[key])) continue;
        if (data[key] === undefined || (own(defaults, key) && same(data[key], defaults[key]))) {
          delete next[key];
        } else {
          next[key] = structuredClone(data[key]);
        }
      } else if (fullSnapshot && own(previous, key) && own(next, key)) {
        delete next[key];
      }
    }

    this._config = next;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail:{config:structuredClone(this._config)}, bubbles:true, composed:true,
    }));
    this._updateForm();
  }
}
if (!customElements.get('weather-combined-forecast-editor')) {
  customElements.define('weather-combined-forecast-editor', WeatherCombinedForecastEditor);
}
