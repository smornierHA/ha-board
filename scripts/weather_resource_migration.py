#!/usr/bin/env python3
"""Plan the weather-only Lovelace resource switch through supported HA APIs.

This planner never connects to Home Assistant. It turns an expurgated resource
snapshot into reviewable calls for ha_config_*_dashboard_resource.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit

PEOPLE_PATH = "/hacsfiles/ha-board/ha-board.js"
WEATHER_PATH = "/hacsfiles/ha-board/weather-combined-forecast-card.js"
WEATHER_TARGET = f"{WEATHER_PATH}?v=0.2.0-rc.1"
WEATHER_ORIGINAL = "/local/weather-combined-forecast-card-v1.17.10.js"


class ResourcePlanError(ValueError):
    pass


def _path(url: str) -> str:
    return urlsplit(url).path


def _is_people(resource: dict) -> bool:
    return _path(str(resource.get("url", ""))) == PEOPLE_PATH


def _is_weather(resource: dict) -> bool:
    path = _path(str(resource.get("url", "")))
    return "weather-combined-forecast-card" in path


def _set_call(*, url: str, resource_id: str | None = None) -> dict:
    arguments = {"url": url, "resource_type": "module"}
    if resource_id is not None:
        arguments["resource_id"] = resource_id
    return {"tool": "ha_config_set_dashboard_resource", "arguments": arguments}


def _delete_call(resource_id: str) -> dict:
    return {
        "tool": "ha_config_delete_dashboard_resource",
        "arguments": {"resource_id": resource_id},
    }


def plan_weather_switch(
    resources: list[dict],
    *,
    target_url: str = WEATHER_TARGET,
    original_url: str = WEATHER_ORIGINAL,
) -> dict:
    """Return a weather-only plan that leaves People before Weather.

    Zero weather resources is accepted only as a resumable state after the
    reviewed deletion step. Duplicate People or Weather resources are refused.
    """
    people = [(index, item) for index, item in enumerate(resources) if _is_people(item)]
    weather = [(index, item) for index, item in enumerate(resources) if _is_weather(item)]
    if len(people) != 1:
        raise ResourcePlanError(f"expected exactly one People resource, found {len(people)}")
    if len(weather) > 1:
        raise ResourcePlanError(f"expected at most one Weather resource, found {len(weather)}")
    for _, item in people + weather:
        if not item.get("id"):
            raise ResourcePlanError("each matched resource must include its Home Assistant id")
        if item.get("type", item.get("res_type", "module")) != "module":
            raise ResourcePlanError("People and Weather resources must be modules")
    if weather and _path(str(weather[0][1]["url"])) not in {WEATHER_PATH, WEATHER_ORIGINAL}:
        raise ResourcePlanError("unexpected Weather URL; compare source delta before planning")

    people_index, people_resource = people[0]
    order_operations: list[dict] = []
    mode: str

    if not weather:
        mode = "resume-after-weather-delete"
        order_operations.append(_set_call(url=original_url))
        activation_weather_id = "<weather-id-after-ordering>"
    else:
        weather_index, weather_resource = weather[0]
        weather_id = str(weather_resource["id"])
        if people_index < weather_index:
            mode = "update-weather-in-place"
            activation_weather_id = weather_id
        else:
            mode = "append-weather-after-people"
            order_operations.extend([_delete_call(weather_id), _set_call(url=original_url)])
            activation_weather_id = "<weather-id-after-ordering>"

    return {
        "mode": mode,
        "preflight": {
            "people_id": people_resource["id"],
            "people_url": people_resource["url"],
            "weather_original_url": original_url,
            "weather_original_sha256": "da5a13fce2b78fe7109394918a1fb80861955ff9d2319d22be1f66197df74f1b",
        },
        "before_hacs_update": order_operations,
        "hacs_download_gate": "Re-list and verify People before Weather, then download the reviewed release through HACS and verify every manifest asset before activation.",
        "activate_weather": [_set_call(url=target_url, resource_id=activation_weather_id)],
        "verify": {
            "people_count": 1,
            "weather_count": 1,
            "people_before_weather": True,
            "weather_url": target_url,
            "unrelated_resource_order_unchanged": True,
        },
        "rollback_weather_only": [_set_call(url=original_url, resource_id=activation_weather_id)],
        "next_release": "Change only the weather resource query version/cache token after its new asset is downloaded; HACS updates only the People resource automatically.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("snapshot", type=Path, help="Expurgated JSON list or object with a resources list")
    args = parser.parse_args()
    document = json.loads(args.snapshot.read_text(encoding="utf-8"))
    resources = document["resources"] if isinstance(document, dict) else document
    print(json.dumps(plan_weather_switch(resources), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
