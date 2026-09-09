"""Exact method body observed read-only in installed HACS on 2026-09-09.

Source file: custom_components/hacs/repositories/plugin.py
Full installed file SHA256: 6e6ff3a9ccee66479ee6d66a170561996f78eeb21bb3b9aa582dab7073e6395f
The fixture is executed only with an in-memory resource handler.
HACS is MIT-licensed; attribution is recorded in THIRD-PARTY-NOTICES.md.
"""


async def update_dashboard_resources(self) -> None:
    """Update dashboard resources."""
    if not (resources := self._get_resource_handler()):
        return

    if not resources.loaded:
        await resources.async_load()

    namespace = self.generate_dashboard_resource_namespace()
    url = self.generate_dashboard_resource_url()

    for entry in resources.async_items():
        if (entry_url := entry["url"]).startswith(namespace):
            if entry_url != url:
                self.logger.info(
                    "%s Updating existing dashboard resource from %s to %s",
                    self.string,
                    entry_url,
                    url,
                )
                await resources.async_update_item(entry["id"], {"url": url})
            return

    # Nothing was updated, add the resource
    self.logger.info("%s Adding dashboard resource %s", self.string, url)
    await resources.async_create_item({"res_type": "module", "url": url})
