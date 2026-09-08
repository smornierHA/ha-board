import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NODE = r"""
const fs = require('fs');
const vm = require('vm');
const target = process.argv[1];

const registry = new Map();
class FakeNode {
  constructor() { this.html = ''; this.listeners = new Map(); }
  set innerHTML(value) { this.html = value; }
  get innerHTML() { return this.html; }
  querySelector(selector) { return selector === 'ha-card' ? this.card || (this.card = new FakeNode()) : null; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
}
class HTMLElement {
  attachShadow() { return this.shadowRoot = new FakeNode(); }
  dispatchEvent() { return true; }
}
class Event { constructor(type, init = {}) { this.type = type; Object.assign(this, init); } }
const window = { customCards: [], dispatchEvent() {}, setTimeout, clearTimeout };
const context = vm.createContext({
  HTMLElement,
  customElements: { get: name => registry.get(name), define: (name, klass) => registry.set(name, klass) },
  window,
  history: { pushState() {} },
  Event,
  CustomEvent: Event,
  console,
  setTimeout,
  clearTimeout,
});
vm.runInContext(fs.readFileSync(target, 'utf8'), context, { filename: target });

const Rich = registry.get('person-rich-card-v34');
if (!Rich) throw new Error('Person Rich non enregistré');

const entity = (state, attributes = {}, extra = {}) => ({ state, attributes, ...extra });
const hass = {
  states: {
    'person.alice': entity('not_home', { friendly_name: 'Alice Exemple', entity_picture: '/local/example-avatar.svg' }),
    'device_tracker.alice_example': entity('not_home', { latitude: 48.5, longitude: 2.3 }),
    'sensor.example_geocode': entity('10 rue Exemple 75001 Ville Exemple France'),
    'sensor.example_battery': entity('78'),
    'sensor.example_battery_state': entity('Charging'),
  }
};

function render(mode) {
  const card = new Rich();
  card.setConfig({
    entity: 'person.alice',
    tracker: 'device_tracker.alice_example',
    geocoded_location: 'sensor.example_geocode',
    battery: 'sensor.example_battery',
    battery_state: 'sensor.example_battery_state',
    mode,
  });
  card.hass = hass;
  return { html: card.shadowRoot.innerHTML, location: card.location(card.e('person.alice')), card };
}

const compact = render('compact');
const detail = render('detail');
console.log(JSON.stringify({
  compactHtml: compact.html,
  detailHtml: detail.html,
  compactCity: compact.location.city,
  detailCity: detail.location.city,
  address: detail.location.address,
  roissyHyphen: detail.card.city('95700 Roissy-en-France'),
  roissySpaces: detail.card.city('95700 Roissy en France'),
  valDeFrance: detail.card.city('95470 Val de France'),
}));
"""

class CityFallbackRegression(unittest.TestCase):
    def run_target(self, relative_path):
        completed = subprocess.run(
            ["node", "-e", NODE, str(ROOT / relative_path)],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=True,
        )
        return json.loads(completed.stdout)

    def assert_contract(self, data):
        full_address = "10 rue Exemple 75001 Ville Exemple France"
        self.assertEqual(data["compactCity"], "Ville Exemple")
        self.assertEqual(data["detailCity"], "Ville Exemple")
        self.assertEqual(data["address"], full_address)
        self.assertIn("<span>Ville Exemple</span>", data["compactHtml"])
        self.assertNotIn("<span>Ville Exemple France</span>", data["compactHtml"])
        self.assertIn("<span>Ville Exemple</span>", data["detailHtml"])
        self.assertIn("<b>Ville Exemple</b>", data["detailHtml"])
        self.assertIn(f'<i class="address">{full_address}</i>', data["detailHtml"])
        self.assertEqual(data["roissyHyphen"], "Roissy-en-France")
        self.assertEqual(data["roissySpaces"], "Roissy en France")
        self.assertEqual(data["valDeFrance"], "Val de France")

    def test_source_and_bundle_without_structured_city(self):
        for target in ("src/candidate/person-rich-card-v34.js", "dist/ha-board.js"):
            with self.subTest(target=target):
                self.assert_contract(self.run_target(target))

if __name__ == "__main__":
    unittest.main()
