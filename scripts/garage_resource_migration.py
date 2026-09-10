#!/usr/bin/env python3
"""Plan a Garage-only resource switch through supported Home Assistant APIs.

This planner never connects to Home Assistant. It consumes an expurgated list,
keeps all resource identifiers/order, and emits only the targeted update call.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit

PEOPLE_PATH = "/hacsfiles/ha-board/ha-board.js"
WEATHER_PATH = "/hacsfiles/ha-board/weather-combined-forecast-card.js"
GARAGE_PATH = "/hacsfiles/ha-board/garage-control-card.js"
GARAGE_TARGET = f"{GARAGE_PATH}?v=0.3.0-rc.1"
GARAGE_ORIGINAL = "/local/garage-control-card.js?v=1.0.1"
GARAGE_ORIGINAL_SHA256 = "5edd41a20a51f76998e282c9974cff211f631c7c31ea4c771d2cd173ae3c2f48"


class ResourcePlanError(ValueError):
    pass


def _path(url: str) -> str:
    return urlsplit(url).path


def _is_people(resource: dict) -> bool:
    return _path(str(resource.get("url", ""))) == PEOPLE_PATH


def _is_weather(resource: dict) -> bool:
    return _path(str(resource.get("url", ""))) == WEATHER_PATH


def _is_garage(resource: dict) -> bool:
    path = _path(str(resource.get("url", "")))
    return path in {GARAGE_PATH, _path(GARAGE_ORIGINAL)}


def _set_call(*, url: str, resource_id: str | None = None) -> dict:
    arguments = {"url": url, "resource_type": "module"}
    if resource_id is not None:
        arguments["resource_id"] = resource_id
    return {"tool": "ha_config_set_dashboard_resource", "arguments": arguments}


def _delete_call(resource_id: str) -> dict:
    return {"tool": "ha_config_delete_dashboard_resource", "arguments": {"resource_id": resource_id}}


def plan_garage_switch(resources: list[dict], *, target_url: str = GARAGE_TARGET, original_url: str = GARAGE_ORIGINAL) -> dict:
    people = [(index, item) for index, item in enumerate(resources) if _is_people(item)]
    weather = [(index, item) for index, item in enumerate(resources) if _is_weather(item)]
    garage = [(index, item) for index, item in enumerate(resources) if _is_garage(item)]
    for label, matches in (("People", people), ("Weather", weather)):
        if len(matches) != 1:
            raise ResourcePlanError(f"expected exactly one {label} resource, found {len(matches)}")
        item = matches[0][1]
        if not item.get("id"):
            raise ResourcePlanError(f"{label} resource must include its Home Assistant id")
        if item.get("type", item.get("res_type", "module")) != "module":
            raise ResourcePlanError(f"{label} resource must be a module")
    if len(garage) > 1:
        raise ResourcePlanError(f"expected at most one Garage resource, found {len(garage)}")
    if garage:
        item = garage[0][1]
        if not item.get("id"):
            raise ResourcePlanError("Garage resource must include its Home Assistant id")
        if item.get("type", item.get("res_type", "module")) != "module":
            raise ResourcePlanError("Garage resource must be a module")
    if people[0][0] > weather[0][0]:
        raise ResourcePlanError("People must remain the first HA-BOARD namespace resource before a HACS update")
    if garage and _path(str(garage[0][1]["url"])) not in {_path(original_url), GARAGE_PATH}:
        raise ResourcePlanError("unexpected Garage URL; compare source delta before planning")

    order_operations: list[dict] = []
    if not garage:
        mode = "resume-after-garage-delete"
        order_operations.append(_set_call(url=original_url))
        garage_id = "<garage-id-after-ordering>"
    else:
        garage_index, garage_resource = garage[0]
        if garage_index < people[0][0]:
            mode = "append-garage-after-namespace"
            order_operations.extend([_delete_call(str(garage_resource["id"])), _set_call(url=original_url)])
            garage_id = "<garage-id-after-ordering>"
        else:
            mode = "update-garage-in-place"
            garage_id = str(garage_resource["id"])
    return {
        "mode": mode,
        "preflight": {
            "people_id": people[0][1]["id"],
            "weather_id": weather[0][1]["id"],
            "garage_id": garage[0][1]["id"] if garage else None,
            "garage_original_url": original_url,
            "garage_original_sha256": GARAGE_ORIGINAL_SHA256,
        },
        "before_hacs_update": order_operations,
        "hacs_download_gate": "Re-list and require People to be the first HA-BOARD namespace resource. Download the reviewed release, then verify all three JS modules and notices before activation.",
        "activate_garage": [_set_call(url=target_url, resource_id=garage_id)],
        "verify": {
            "people_count": 1,
            "weather_count": 1,
            "garage_count": 1,
            "people_first_in_namespace": True,
            "garage_url": target_url,
            "weather_url_unchanged": True,
            "unrelated_resource_order_unchanged": True,
        },
        "rollback_garage_only": [_set_call(url=original_url, resource_id=garage_id)],
        "next_release": "HACS updates only People automatically. Keep Weather and Garage resource IDs/order and change each query version only after its corresponding asset is verified.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("snapshot", type=Path, help="Expurgated JSON list or object with a resources list")
    args = parser.parse_args()
    document = json.loads(args.snapshot.read_text(encoding="utf-8"))
    resources = document["resources"] if isinstance(document, dict) else document
    print(json.dumps(plan_garage_switch(resources), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
