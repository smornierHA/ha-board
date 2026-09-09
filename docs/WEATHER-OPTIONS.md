# Options Weather Combined Forecast

Types et valeurs par défaut du candidat public. Les identifiants `example` sont fictifs ; configurer les sources HA dans l’éditeur. Les objets risques et actions conservent leurs clés imbriquées. Les options YAML inconnues sont préservées. L’éditeur affiche les valeurs effectives depuis la même définition de défauts que la carte et retire une surcharge remise à son défaut. Limite héritée : `precipitation_unit`, `temperature_unit`, `wind_unit` ne modifient pas les libellés d’affichage ; leurs clés YAML sont conservées mais ces trois options ne sont pas proposées comme contrôles modifiables. Aucune conversion, source métrique attendue.

| Option | Type | Défaut public |
|---|---|---|
| `title` | string | `"Prévisions météo"` |
| `show_title` | boolean | `true` |
| `show_header` | boolean | `true` |
| `header_mode` | string | `"compact"` |
| `show_header_title` | boolean | `true` |
| `show_current_weather_icon` | boolean | `true` |
| `show_current_temperature` | boolean | `true` |
| `show_current_summary` | boolean | `true` |
| `show_header_temperature_range` | boolean | `true` |
| `show_header_metrics` | boolean | `false` |
| `show_current_risk_pills` | boolean | `true` |
| `show_header_risk_pills` | boolean | `true` |
| `show_alerts_footer` | boolean | `true` |
| `alerts_footer_position` | string | `"bottom"` |
| `alerts_footer_align` | string | `"start"` |
| `alerts_footer_scroll` | boolean | `true` |
| `risk_display_mode` | string | `"footer"` |
| `header_risk_sub_buttons_show_label` | boolean | `false` |
| `header_risk_sub_buttons_show_icon` | boolean | `true` |
| `header_risk_sub_buttons_max_items` | number | `4` |
| `header_risk_sub_buttons` | object | `{"show_label":false,"show_tooltip":true,"size":36,"gap":8}` |
| `secondary_line_scroll_speed` | string | `"bubble"` |
| `main_header_tap_action` | object | `{"action":"navigate","navigation_path":"#meteo"}` |
| `risk_entities` | array | `[]` |
| `current_risk_entities` | array | `[]` |
| `current_temperature_entity` | string | `""` |
| `current_min_temperature_entity` | string | `""` |
| `current_max_temperature_entity` | string | `""` |
| `current_summary_entity` | string | `""` |
| `forecast_entity` | string | `"sensor.example_hourly"` |
| `forecast_attribute` | string | `"forecast"` |
| `weather_entity` | string | `"weather.example"` |
| `sun_entity` | string | `"sun.sun"` |
| `hours_to_show` | number | `12` |
| `show_current` | boolean | `true` |
| `include_past_current_slot` | boolean | `true` |
| `highlight_day_changes` | boolean | `true` |
| `show_sun_markers` | boolean | `true` |
| `solar_marker_tolerance_minutes` | number | `75` |
| `datetime_key` | string | `"datetime"` |
| `temperature_key` | string | `"temperature"` |
| `precipitation_key` | string | `"precipitation"` |
| `primary_probability_key` | string | `"precipitation_probability"` |
| `wind_speed_key` | string | `"wind_speed"` |
| `wind_gust_speed_key` | string | `"wind_gust_speed"` |
| `wind_bearing_key` | string | `"wind_bearing"` |
| `show_temperature` | boolean | `true` |
| `show_rain` | boolean | `true` |
| `show_probability` | string | `"auto"` |
| `show_wind` | boolean | `true` |
| `probability_entity` | string | `"sensor.example_rain_probability"` |
| `probability_attribute` | string | `"forecast"` |
| `probability_datetime_key` | string | `"datetime"` |
| `probability_value_key` | string | `"rain_probability_3h"` |
| `probability_match_mode` | string | `"window"` |
| `probability_window_hours` | number | `3` |
| `probability_max_delta_hours` | number | `3` |
| `secondary_sources` | object | `{"probability":{"entity":"sensor.example_rain_probability","attribute":"forecast","datetime_key":"datetime","value_key":"rain_probability_3h","match_mode":"window","window_hours":3,"max_delta_hours":3}}` |
| `bearing_reference_mode` | string | `"house"` |
| `bearing_rotation` | number | `-50` |
| `bearing_house_rotation` | number | `-50` |
| `bearing_arrow_mode` | string | `"travel"` |
| `wind_reference_threshold_entity` | string | `"input_number.example_wind_threshold"` |
| `wind_reference_threshold_fallback` | number | `35` |
| `gust_reference_threshold_entity` | string | `"input_number.example_gust_threshold"` |
| `gust_reference_threshold_fallback` | number | `45` |
| `intensity_close_ratio` | number | `1.1` |
| `intensity_strong_ratio` | number | `1.3` |
| `item_width` | number | `68` |
| `chart_height` | number | `80` |
| `forecast_icon_size` | number | `28` |
| `wind_row_height` | number | `44` |
| `precipitation_unit` | string | `"mm"` |
| `temperature_unit` | string | `"°C"` |
| `wind_unit` | string | `"km/h"` |
| `highlight_current` | boolean | `true` |
| `weather_background_opacity` | number | `0.58` |
| `weather_background_speed` | number | `0.9` |
| `empty_label` | string | `"Aucune prévision disponible"` |
