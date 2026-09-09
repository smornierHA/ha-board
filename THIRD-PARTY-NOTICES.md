# Third-party notices

This file records identified third-party portions and exact review boundaries. It does not assign a global license to HA-BOARD.

## Home Assistant frontend weather icon paths

`src/candidate/weather-combined-forecast-card.js` and its distributed copy contain 16 SVG path values used to render Home Assistant weather conditions. They correspond to the weather icon selection in:

- Project: Home Assistant frontend
- Commit: `18f79dfc919e2019102c4fde0606fdb449f4cc15`
- Source: `src/data/weather.ts` (Git blob `3f72034577698af270c629184ac3ef4e088d2dd4`)
- License: Apache License 2.0, copied in `home-assistant-frontend-Apache-2.0.txt` beside the distributed JavaScript and in `third_party/` in the source tree.

Modifications in HA-BOARD: the 16 paths are assembled conditionally in one inline SVG; HA-BOARD adds CSS classes, colors, sizing, condition groups and escaping. No Home Assistant runtime module is imported for these paths.

## HACS method test fixture

`tests/fixtures/hacs_plugin_update_dashboard_resources.py` reproduces the installed `update_dashboard_resources` method so the ordering hazard can be tested with fictitious in-memory resources. The installed `custom_components/hacs/repositories/plugin.py` was read through HA-MCP and had SHA256 `6e6ff3a9ccee66479ee6d66a170561996f78eeb21bb3b9aa582dab7073e6395f` on 9 September 2026.

- Project: HACS integration
- Reference source: `custom_components/hacs/repositories/plugin.py`
- Public comparison commit: `adb7d83e33d24325535fb43b8226572405143757`
- License: MIT, copied in `third_party/hacs-MIT.txt`.

This fixture is repository test material. It is not imported by either distributed JavaScript file.

## Reviewed references without copied third-party portions

The temperature range and gradient were compared with `pkissling/clock-weather-card` at commit `8fc1415dde5cf8d55d61c86ae2eb4a34b46e7732` (`src/clock-weather-card.ts`, MIT). The HA-BOARD source has its own functions, palette and rendering structure; the targeted comparison found no identical non-comment source line of 40 or more normalized characters. The reference is functional inspiration, not an identified copied portion.

The `weather_alert_pills` adapter reuses the phenomenon list, severity, palette and icon mapping from the project-local `weather-alert-pills-card-v3.js` supplied with the private HA source. That file contained no third-party author or license notice. The adapter is project-origin code covered by the user's explicit public migration mandate; it does not import or bundle the original card. No external origin was identified for this portion.
