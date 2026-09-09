import asyncio
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


planner = load("garage_resource_migration", ROOT / "scripts/garage_resource_migration.py")
hacs_fixture = load("hacs_plugin_fixture_garage", ROOT / "tests/fixtures/hacs_plugin_update_dashboard_resources.py")


class Resources:
    def __init__(self, items):
        self.items = [dict(item) for item in items]
        self.loaded = True

    def async_items(self):
        return list(self.items)

    async def async_load(self):
        self.loaded = True

    async def async_update_item(self, resource_id, patch):
        next(item for item in self.items if item["id"] == resource_id).update(patch)

    async def async_create_item(self, item):
        self.items.append({"id": "created", **item})

    async def async_delete_item(self, resource_id):
        self.items = [item for item in self.items if item["id"] != resource_id]


class Logger:
    def info(self, *_args):
        pass


class HacsPlugin:
    update_dashboard_resources = hacs_fixture.update_dashboard_resources

    def __init__(self, resources, people_url):
        self.resources = resources
        self.url = people_url
        self.logger = Logger()
        self.string = "ha-board"

    def _get_resource_handler(self):
        return self.resources

    def generate_dashboard_resource_namespace(self):
        return "/hacsfiles/ha-board"

    def generate_dashboard_resource_url(self):
        return self.url


def apply_calls(resources, calls):
    async def apply():
        for call in calls:
            args = dict(call["arguments"])
            if args.get("resource_id") == "<garage-id-after-ordering>":
                args["resource_id"] = next(item["id"] for item in resources.items if planner._is_garage(item))
            if call["tool"] == "ha_config_delete_dashboard_resource":
                await resources.async_delete_item(args["resource_id"])
            elif "resource_id" in args:
                await resources.async_update_item(args["resource_id"], {"url": args["url"], "res_type": args["resource_type"]})
            else:
                await resources.async_create_item({"url": args["url"], "res_type": args["resource_type"]})
    asyncio.run(apply())


def sample():
    return [
        {"id": "other-a", "url": "/local/example-a.js", "res_type": "module"},
        {"id": "garage", "url": planner.GARAGE_ORIGINAL, "res_type": "module"},
        {"id": "people", "url": "/hacsfiles/ha-board/ha-board.js?hacstag=1", "res_type": "module"},
        {"id": "weather", "url": "/hacsfiles/ha-board/weather-combined-forecast-card.js?v=0.2.0-rc.1", "res_type": "module"},
        {"id": "other-b", "url": "/local/example-b.js", "res_type": "module"},
    ]


class GarageResourceMigration(unittest.TestCase):
    def test_three_modules_download_activation_future_update_and_rollback(self):
        resources = Resources(sample())
        original_ids = [item["id"] for item in resources.items]
        weather_before = next(item["url"] for item in resources.items if planner._is_weather(item))
        plan = planner.plan_garage_switch(resources.items)
        self.assertEqual(plan["mode"], "append-garage-after-namespace")
        apply_calls(resources, plan["before_hacs_update"])
        self.assertEqual([item["id"] for item in resources.items if item["id"].startswith("other-")], ["other-a", "other-b"])
        self.assertLess(next(index for index,item in enumerate(resources.items) if planner._is_people(item)), next(index for index,item in enumerate(resources.items) if planner._is_garage(item)))

        # Installed HACS method changes only the first namespace entry (People).
        people_v2 = "/hacsfiles/ha-board/ha-board.js?hacstag=2"
        asyncio.run(HacsPlugin(resources, people_v2).update_dashboard_resources())
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_weather(item)), weather_before)
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_garage(item)), planner.GARAGE_ORIGINAL)

        apply_calls(resources, plan["activate_garage"])
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_garage(item)), planner.GARAGE_TARGET)
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_weather(item)), weather_before)

        # A later HACS update again changes People only.
        people_v3 = "/hacsfiles/ha-board/ha-board.js?hacstag=3"
        asyncio.run(HacsPlugin(resources, people_v3).update_dashboard_resources())
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_garage(item)), planner.GARAGE_TARGET)
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_weather(item)), weather_before)
        self.assertEqual([item["id"] for item in resources.items if item["id"] != "created"], [item for item in original_ids if item != "garage"])

        apply_calls(resources, plan["rollback_garage_only"])
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_garage(item)), planner.GARAGE_ORIGINAL)
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_weather(item)), weather_before)
        self.assertEqual(next(item["url"] for item in resources.items if planner._is_people(item)), people_v3)
        self.assertEqual([item["id"] for item in resources.items if item["id"] != "created"], [item for item in original_ids if item != "garage"])

    def test_refuses_duplicates_wrong_order_and_wrong_type(self):
        resources = sample()
        with self.assertRaisesRegex(planner.ResourcePlanError, "at most one Garage"):
            planner.plan_garage_switch(resources + [{"id": "g2", "url": planner.GARAGE_TARGET, "res_type": "module"}])
        wrong_order = [resources[0], resources[1], resources[3], resources[2], resources[4]]
        with self.assertRaisesRegex(planner.ResourcePlanError, "People must remain"):
            planner.plan_garage_switch(wrong_order)
        resources[1]["res_type"] = "css"
        with self.assertRaisesRegex(planner.ResourcePlanError, "must be a module"):
            planner.plan_garage_switch(resources)


if __name__ == "__main__":
    unittest.main()
