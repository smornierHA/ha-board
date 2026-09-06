# POC geolocation — unchanged baseline contract results

Generated: 2026-09-06T10:28:10.754Z. Node v24.19.0.

Local Node vm with minimal DOM, storage and HA helper doubles; not a real browser and not Home Assistant.

**7 contracts pass; 12 fail; 0 harness errors. Product sources unchanged.**

Source SHA-256:

- `person-history-map-card-v14.js`: `5f7eafddc9ad338e71030d759e373d51bfc6bf384e291b26cd11e5708031c0a4`
- `person-rich-card-v34.js`: `9b89f12c630750fe67000434b2ee9a9b92efab76413e83babad6a6ce17a18477`

| Test | Result | Contract |
| --- | --- | --- |
| H01 | PASS | History delegates to native map with configured history hours and aspect ratio. |
| H02 | PASS | Individual filters support multiple selections and stable entity colors. |
| H03 | PASS | Tous toggles all to none; the empty selection survives reload. |
| H04 | PASS | Explicit different storage keys isolate two instances. |
| H05 | FAIL | A later setConfig wins when native-card creations finish in reverse order. |
| H06 | FAIL | A filter clicked during initial card creation is applied to the mounted map. |
| H07 | FAIL | Failure to load native helpers is caught and surfaced inside the card. |
| H08 | FAIL | A card detached while native-card creation is pending ignores that completion. |
| H09 | FAIL | Default filter persistence is scoped to the card instance. |
| H10 | FAIL | Unrelated hass updates preserve the current filter DOM and keyboard focus. |
| R01 | PASS | Unavailable batteries stay unknown, levels are bounded, and charging remains visible. |
| R02 | PASS | Avatar, compact battery structure and Enter navigation remain available. |
| R03 | PASS | Detail activation emits hass-more-info for the configured entity. |
| R04 | FAIL | Unavailable geocoding data with retained attributes is identified as unavailable. |
| R05 | FAIL | Null coordinates do not count as valid GPS coordinates. |
| R06 | FAIL | Coordinate values outside latitude/longitude ranges are not accepted. |
| R07 | FAIL | A location with no position-specific timestamp is not labeled as a current fix. |
| R08 | FAIL | A supplied GPS accuracy of 1500 m is exposed as location uncertainty. |
| R09 | FAIL | Unrelated hass updates preserve the focused Person Rich card DOM. |

Limits: No native HA map implementation, real history API, real tile provider or CARTO watermark is exercised. No browser rendering, CSS layout, Memoji asset loading, mobile/desktop, light/dark theme or production acceptance is established. GPS freshness requires a verified source-specific fix timestamp. Entity last_updated is not substituted for that timestamp. Rejections are captured by the harness process solely to record baseline failures; the product code is unchanged.

Reproduce from the project root: `node tests/baseline.mjs`. Override `POC_SOURCE_DIR` for another exact source export; `POC_REPORT_DIR` for output. Exit code 1 means demonstrated unmet contracts (baseline is deliberately not green).
