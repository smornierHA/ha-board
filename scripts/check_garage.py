#!/usr/bin/env python3
"""Targeted Garage source, dependency, privacy and distribution checks."""

import hashlib
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
provenance = json.loads((root / "garage-provenance.json").read_text(encoding="utf-8"))
distribution = json.loads((root / "dist/manifest.json").read_text(encoding="utf-8"))


def verify(record):
    data = (root / record["path"]).read_bytes()
    assert len(data) == record["bytes"], record["path"]
    assert hashlib.sha256(data).hexdigest() == record["sha256"], record["path"]


for key in ("public_export", "candidate_source", "distribution"):
    verify(provenance[key])

candidate = (root / provenance["candidate_source"]["path"]).read_text(encoding="utf-8")
bundle = (root / provenance["distribution"]["path"]).read_text(encoding="utf-8")
public_export = (root / provenance["public_export"]["path"]).read_text(encoding="utf-8")
assert 'from "lit-element"' in candidate
assert "cdn.jsdelivr.net" not in candidate
assert "cdn.jsdelivr.net" in public_export  # immutable historical behavior, never distributed
assert "cdn.jsdelivr.net" not in bundle
assert not re.search(r"^\s*import\s", bundle, re.MULTILINE)

lock = json.loads((root / "package-lock.json").read_text(encoding="utf-8"))
assert lock["packages"][""]["dependencies"]["lit-element"] == "4.2.0"
assert lock["packages"]["node_modules/lit-element"]["version"] == "4.2.0"
assert provenance["dependency_review"]["status"] == "verified"
assert provenance["privacy_review"] == "verified-fictitious-only"

privacy_paths = (
    "src/garage-control-card.js", "src/candidate/garage-control-card.js",
    "examples/garage-demo.html", "tests/garage-contracts.mjs",
    "docs/GARAGE-OPTIONS.md", "docs/GARAGE-PROVENANCE.md",
)
allowed_non_entities = {
    "_action", "aspect_ratio", "camera_view", "close_cover", "entity",
    "fit_mode", "hass", "icon", "name", "open_cover", "stop_cover", "toggle",
}
for path in privacy_paths:
    text = (root / path).read_text(encoding="utf-8")
    assert not re.search(r"(?:^|[\"'])https?://(?:192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)", text), path
    assert "/api/image/serve/" not in text, path
    for _domain, name in re.findall(r"\b(binary_sensor|camera|cover|image|sensor|switch)\.([a-z0-9_]+)", text):
        assert name.startswith("example") or name in allowed_non_entities, (path, _domain, name)

artifacts = {item["file"]: item for item in distribution["artifacts"]}
for name, expected in {
    "ha-board.js": (38462, "80caf1146f0af5a175a6a2763239fe1ee935259beb28c7ffa4a57c04ca82baf6"),
    "weather-combined-forecast-card.js": (142577, "f853e1d46c887209ed3dad4c56d592a79bc9e769102654095ea2a7c6f6edc093"),
}.items():
    assert (artifacts[name]["bytes"], artifacts[name]["sha256"]) == expected
assert artifacts["garage-control-card.js"]["sha256"] == provenance["distribution"]["sha256"]
print("Garage source/export/distribution, exact Lit lock, privacy and Personnes/Météo invariants verified.")
