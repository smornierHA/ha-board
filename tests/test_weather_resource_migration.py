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


planner = load("weather_resource_migration", ROOT / "scripts/weather_resource_migration.py")
hacs_fixture = load("hacs_plugin_fixture", ROOT / "tests/fixtures/hacs_plugin_update_dashboard_resources.py")


class Resources:
    def __init__(self, items):
        self.items = [dict(item) for item in items]
        self.loaded = True
        self.serial = 100

    def async_items(self):
        return list(self.items)

    async def async_load(self):
        self.loaded = True

    async def async_update_item(self, resource_id, patch):
        next(item for item in self.items if item["id"] == resource_id).update(patch)

    async def async_create_item(self, item):
        self.serial += 1
        self.items.append({"id": f"created-{self.serial}", **item})

    async def async_delete_item(self, resource_id):
        self.items = [item for item in self.items if item["id"] != resource_id]


class Logger:
    def info(self, *_args):
        pass


class HacsPlugin:
    update_dashboard_resources = hacs_fixture.update_dashboard_resources

    def __init__(self, resources, url):
        self.resources = resources
        self.url = url
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
            if args.get("resource_id") == "<weather-id-after-ordering>":
                args["resource_id"] = next(item["id"] for item in resources.items if planner._is_weather(item))
            if call["tool"] == "ha_config_delete_dashboard_resource":
                await resources.async_delete_item(args["resource_id"])
            elif "resource_id" in args:
                await resources.async_update_item(args["resource_id"], {"url": args["url"], "res_type": args["resource_type"]})
            else:
                await resources.async_create_item({"url": args["url"], "res_type": args["resource_type"]})
    asyncio.run(apply())


def urls(resources):
    return [item["url"] for item in resources.items]


class WeatherResourceMigration(unittest.TestCase):
    def scenario(self, weather_first):
        other_before = {"id": "other-a", "url": "/local/other-a.js", "res_type": "module"}
        other_after = {"id": "other-b", "url": "/local/other-b.js", "res_type": "module"}
        people = {"id": "people", "url": "/hacsfiles/ha-board/ha-board.js?hacstag=1", "res_type": "module"}
        weather = {"id": "weather", "url": planner.WEATHER_ORIGINAL, "res_type": "module"}
        middle = [weather, people] if weather_first else [people, weather]
        resources = Resources([other_before, *middle, other_after])
        plan = planner.plan_weather_switch(resources.items)
        apply_calls(resources, plan["before_hacs_update"])
        self.assertEqual([item["id"] for item in resources.items if not planner._is_weather(item)], ["other-a", "people", "other-b"])
        self.assertEqual(urls(resources)[0], other_before["url"])
        self.assertEqual(urls(resources)[-1], other_after["url"] if not weather_first else planner.WEATHER_ORIGINAL)
        self.assertLess(urls(resources).index(people["url"]), urls(resources).index(planner.WEATHER_ORIGINAL))

        # The HACS download/update sees People first while Weather stays local.
        next_people_url = "/hacsfiles/ha-board/ha-board.js?hacstag=2"
        asyncio.run(HacsPlugin(resources, next_people_url).update_dashboard_resources())
        self.assertIn(next_people_url, urls(resources))
        self.assertIn(planner.WEATHER_ORIGINAL, urls(resources))

        # Weather activation is explicit because HACS does not update its URL.
        apply_calls(resources, plan["activate_weather"])
        self.assertIn(planner.WEATHER_TARGET, urls(resources))

        # A later HACS update still changes only People in either initial order.
        newest_people_url = "/hacsfiles/ha-board/ha-board.js?hacstag=3"
        asyncio.run(HacsPlugin(resources, newest_people_url).update_dashboard_resources())
        self.assertIn(newest_people_url, urls(resources))
        self.assertNotIn(next_people_url, urls(resources))
        self.assertLess(urls(resources).index(newest_people_url), urls(resources).index(planner.WEATHER_TARGET))
        self.assertEqual([url for url in urls(resources) if url.startswith("/local/other")], [other_before["url"], other_after["url"]])
        apply_calls(resources, plan["rollback_weather_only"])
        self.assertIn(newest_people_url, urls(resources))
        self.assertIn(planner.WEATHER_ORIGINAL, urls(resources))
        self.assertEqual([url for url in urls(resources) if url.startswith("/local/other")], [other_before["url"], other_after["url"]])
        self.assertEqual([item["id"] for item in resources.items if not planner._is_weather(item)], ["other-a", "people", "other-b"])
        return plan

    def test_actual_hacs_method_after_weather_first_switch(self):
        self.assertEqual(self.scenario(True)["mode"], "append-weather-after-people")

    def test_actual_hacs_method_after_people_first_switch(self):
        self.assertEqual(self.scenario(False)["mode"], "update-weather-in-place")

    def test_resume_after_delete_and_duplicate_refusal(self):
        people = {"id": "people", "url": "/hacsfiles/ha-board/ha-board.js", "res_type": "module"}
        plan = planner.plan_weather_switch([people])
        self.assertEqual(plan["mode"], "resume-after-weather-delete")
        self.assertEqual(plan["before_hacs_update"][0]["arguments"]["url"], planner.WEATHER_ORIGINAL)
        with self.assertRaisesRegex(planner.ResourcePlanError, "at most one Weather"):
            planner.plan_weather_switch([people, {"id": "w1", "url": planner.WEATHER_ORIGINAL}, {"id": "w2", "url": planner.WEATHER_TARGET}])
        with self.assertRaisesRegex(planner.ResourcePlanError, "compare source delta"):
            planner.plan_weather_switch([people, {"id": "w", "url": "/local/weather-combined-forecast-card-v99.js"}])


if __name__ == "__main__":
    unittest.main()
