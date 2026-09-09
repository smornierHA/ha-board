import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const sourceFile = process.env.GARAGE_SOURCE || "src/candidate/garage-control-card.js";
const timers = new Map();
const listeners = new Map();
const registry = new Map();
let timerId = 0;

class Element {
  constructor() { this.isConnected = false; this.events = []; }
  attachShadow() { this.shadowRoot = { textContent: "", replaceChildren() {} }; return this.shadowRoot; }
  dispatchEvent(event) { this.events.push(event); return true; }
  requestUpdate() {}
  connectedCallback() { this.isConnected = true; }
  disconnectedCallback() { this.isConnected = false; }
}
class LitElement extends Element {}
const template = (strings, ...values) => ({ strings: [...strings], values });
const windowMock = {
  customCards: [],
  location: { hash: "", pathname: "/lovelace", search: "" },
  history: {
    pushState(_state, _title, value) { windowMock.location.hash = value.includes("#") ? `#${value.split("#").at(-1)}` : ""; },
    replaceState() { windowMock.location.hash = ""; },
  },
  addEventListener(name, handler) { const set = listeners.get(name) || new Set(); set.add(handler); listeners.set(name, set); },
  removeEventListener(name, handler) { listeners.get(name)?.delete(handler); },
  setTimeout(handler) { const id = ++timerId; timers.set(id, handler); return id; },
  clearTimeout(id) { timers.delete(id); },
  loadCardHelpers: async () => ({ createCardElement: async (config) => ({ config, hass: null }) }),
};
const context = vm.createContext({
  console, Promise, Date, Math, Intl, Map, Set, structuredClone, queueMicrotask,
  HTMLElement: Element,
  CustomEvent: class { constructor(type, options = {}) { this.type = type; Object.assign(this, options); } },
  window: windowMock,
  document: { createElement: (name) => new (registry.get(name) || Element)() },
  customElements: {
    get: (name) => registry.get(name),
    define: (name, constructor) => { assert(!registry.has(name), `duplicate ${name}`); registry.set(name, constructor); },
    whenDefined: async () => true,
  },
  globalThis: null,
});
context.globalThis = context;
context.__litMock = { LitElement, html: template, css: template };
const source = fs.readFileSync(sourceFile, "utf8");
assert(!source.includes("cdn.jsdelivr.net"), "candidate must not import Lit from a CDN");
const runnable = source.replace(/import\s*\{\s*LitElement,\s*html,\s*css\s*\}\s*from\s*"lit-element";/, "const {LitElement, html, css} = globalThis.__litMock;");
vm.runInContext(runnable, context, { filename: sourceFile });

const Card = registry.get("garage-control-card");
const Editor = registry.get("garage-control-card-editor");
const tick = async () => { for (let index = 0; index < 8; index += 1) await Promise.resolve(); };
const state = (value, attributes = {}) => ({ state: value, attributes, last_changed: "2026-09-09T10:00:00Z", last_updated: "2026-09-09T10:00:00Z" });
const baseConfig = {
  type: "custom:garage-control-card",
  garage_entity: "switch.example_garage_command",
  garage_service: "switch.toggle",
  garage_command_mode: "pulse",
  garage_state_entity: "binary_sensor.example_garage_open",
  garage_open_state: "on",
  garage_closed_state: "off",
  camera_entities: [
    { entity: "camera.example_garage", name: "Garage", camera_view: "live" },
    { entity: "camera.example_driveway", name: "Allée", camera_view: "live" },
  ],
  show_motion_badge: false,
};
function deferred() { let resolve; let reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function makeCard(overrides = {}, callService = async () => undefined) {
  const card = new Card();
  card.setConfig({ ...baseConfig, ...overrides });
  card.hass = {
    states: {
      "switch.example_garage_command": state("off"),
      "binary_sensor.example_garage_open": state("off"),
      "camera.example_garage": state("idle"),
      "camera.example_driveway": state("idle"),
    },
    callService,
  };
  card.connectedCallback();
  return card;
}
function detach(card) { card.disconnectedCallback(); }
function runTimer(id) { const handler = timers.get(id); assert(handler, `missing timer ${id}`); timers.delete(id); handler(); }

let passed = 0;
async function test(name, body) { await body(); passed += 1; console.log("PASS", name); }

await test("effective defaults preserve explicit false and zero", () => {
  const card = makeCard({ show_motion_badge: false, action_lock_ms: 0 });
  assert.equal(card._config.show_motion_badge, false);
  assert.equal(card._config.action_lock_ms, 0);
  assert.equal(card._config.show_person_badge, true);
  detach(card);
});

await test("G1 detach during unresolved service clears busy and ignores late success", async () => {
  const service = deferred();
  const card = makeCard({}, () => service.promise);
  const action = card._runGarageAction();
  assert.equal(card._garageBusy, true);
  detach(card);
  assert.equal(card._garageBusy, false);
  assert.equal(card._pendingAction, null);
  assert.equal(timers.size, 0);
  service.resolve();
  await action;
  assert.equal(card._garageBusy, false);
  assert.equal(timers.size, 0);
  card.connectedCallback();
  assert.equal(card._garageBusy, false);
  detach(card);
});

await test("late rejection after reconfiguration is ignored", async () => {
  const service = deferred();
  const card = makeCard({}, () => service.promise);
  const action = card._runGarageAction();
  card.setConfig({ ...baseConfig, name: "Garage reconfiguré" });
  assert.equal(card._garageBusy, false);
  service.reject(new Error("late"));
  await action;
  assert.equal(card._error, "");
  assert.equal(card._garageFeedback, null);
  detach(card);
});

await test("anti-double-click sends one mocked service call", async () => {
  const service = deferred(); let calls = 0;
  const card = makeCard({}, () => { calls += 1; return service.promise; });
  const first = card._runGarageAction();
  const second = card._runGarageAction();
  assert.equal(calls, 1);
  service.resolve(); await Promise.all([first, second]);
  assert.equal(calls, 1);
  detach(card);
});

await test("service success waits for physical state confirmation", async () => {
  const card = makeCard();
  await card._runGarageAction();
  assert.equal(card._pendingAction.expectedState, "open");
  assert.equal(card._garageFeedback.meta, "Confirmation de l’état en attente");
  assert.notEqual(card._garageFeedback.cls, "success");
  const oldHass = { ...card.hass, states: structuredClone(card.hass.states) };
  card.hass.states["binary_sensor.example_garage_open"] = state("on");
  card.updated(new Map([["hass", oldHass]]));
  assert.equal(card._pendingAction, null);
  assert.equal(card._garageFeedback.text, "Garage ouvert");
  assert.equal(card._garageFeedback.cls, "success");
  detach(card);
});

await test("confirmation timeout reports sent but unconfirmed", async () => {
  const card = makeCard();
  await card._runGarageAction();
  runTimer(card._confirmationTimer);
  assert.equal(card._pendingAction, null);
  assert.equal(card._garageFeedback.text, "Commande garage envoyée");
  assert.equal(card._garageFeedback.meta, "État non confirmé");
  detach(card);
});

await test("pulse stateful and cover plans preserve services", () => {
  const pulse = makeCard();
  assert.equal(pulse._actionPlan().service, "switch.toggle");
  detach(pulse);
  const stateful = makeCard({ garage_command_mode: "stateful", garage_state_entity: "" });
  assert.equal(stateful._stateEntityId(), "switch.example_garage_command");
  assert.equal(stateful._actionPlan().service, "switch.toggle");
  detach(stateful);
  const cover = makeCard({ garage_entity: "cover.example_garage", garage_state_entity: "", garage_service: undefined });
  cover.hass.states["cover.example_garage"] = state("closed");
  assert.equal(cover._actionPlan().service, "cover.open_cover");
  cover.hass.states["cover.example_garage"] = state("opening");
  assert.equal(cover._actionPlan().service, "cover.stop_cover");
  detach(cover);
});

await test("unknown and unavailable states stay distinct", () => {
  const card = makeCard();
  card.hass.states["binary_sensor.example_garage_open"] = state("unknown");
  assert.equal(card._garageStateInfo().key, "unknown");
  card.hass.states["binary_sensor.example_garage_open"] = state("unavailable");
  assert.equal(card._garageStateInfo().key, "unavailable");
  card.hass.states["switch.example_garage_command"] = state("unavailable");
  assert.equal(card._actionPlan().disabled, true);
  detach(card);
});

await test("camera A/B/A ignores stale async loads", async () => {
  const requests = [];
  windowMock.loadCardHelpers = async () => ({ createCardElement: (config) => { const item = deferred(); requests.push({ ...item, config }); return item.promise; } });
  const card = makeCard();
  await tick();
  card._dialogOpen = true;
  const waitForRequests = async (count) => {
    for (let index = 0; index < 20 && requests.length < count; index += 1) await tick();
    assert.equal(requests.length, count);
  };
  const first = card._ensureCameraCard(true); await waitForRequests(1);
  card._setActiveCamera(1); await waitForRequests(2);
  card._setActiveCamera(0); await waitForRequests(3);
  assert.deepEqual(requests.map((item) => item.config.entity), ["camera.example_garage", "camera.example_driveway", "camera.example_garage"]);
  requests[1].resolve({ marker: "B" }); requests[0].resolve({ marker: "old-A" }); requests[2].resolve({ marker: "new-A" });
  await first; await tick();
  assert.equal(card._cameraCard.marker, "new-A");
  assert.equal(card._cameraCardEntity, "camera.example_garage");
  detach(card);
  windowMock.loadCardHelpers = async () => ({ createCardElement: async (config) => ({ config, hass: null }) });
});

await test("open dialog reconnect recreates one selected camera", async () => {
  const requests = [];
  windowMock.loadCardHelpers = async () => ({ createCardElement: (config) => {
    const item = deferred(); requests.push({ ...item, config }); return item.promise;
  } });
  const card = makeCard();
  card._dialogOpen = true;
  windowMock.location.hash = card._config.popup_hash;
  card._setActiveCamera(1);
  await tick();
  assert.equal(requests.length, 1);
  requests[0].resolve({ marker: "selected-B" });
  await tick();
  assert.equal(card._cameraCard.marker, "selected-B");
  assert.equal(card._cameraCardEntity, "camera.example_driveway");

  detach(card);
  assert.equal(card._dialogOpen, true);
  assert.equal(card._cameraCard, null);
  card.connectedCallback();
  await tick();
  assert.equal(requests.length, 2);
  assert.equal(requests[1].config.entity, "camera.example_driveway");
  requests[1].resolve({ marker: "reconnected-B" });
  await tick();
  assert.equal(card._cameraCard.marker, "reconnected-B");
  assert.equal(card._cameraCardEntity, "camera.example_driveway");
  assert.equal(requests.length, 2);
  detach(card);
  windowMock.location.hash = "";
  windowMock.loadCardHelpers = async () => ({ createCardElement: async (config) => ({ config, hass: null }) });
});

await test("immediate detach cancels reconfiguration camera task and stale failure", async () => {
  const requests = [];
  windowMock.loadCardHelpers = async () => ({ createCardElement: (config) => {
    const item = deferred(); requests.push({ ...item, config }); return item.promise;
  } });
  const card = makeCard();
  card._dialogOpen = true;
  windowMock.location.hash = card._config.popup_hash;
  const initial = card._ensureCameraCard(true);
  await tick();
  requests[0].resolve({ marker: "ready-A" });
  await initial;
  assert.equal(card._cameraCard.marker, "ready-A");

  const stale = card._ensureCameraCard(true);
  await tick();
  assert.equal(requests.length, 2);
  card.setConfig({ ...baseConfig, name: "Garage reconfiguré" });
  detach(card);
  await tick();
  assert.equal(requests.length, 2);
  requests[1].reject(new Error("obsolete camera failure"));
  await stale;
  assert.equal(card._attached, false);
  assert.equal(card._cameraCard, null);
  assert.equal(card._cameraCardEntity, null);
  assert.equal(card._error, "");
  windowMock.location.hash = "";
  windowMock.loadCardHelpers = async () => ({ createCardElement: async (config) => ({ config, hass: null }) });
});

await test("several instances keep command locks isolated", async () => {
  const aService = deferred(); let aCalls = 0; let bCalls = 0;
  const a = makeCard({}, () => { aCalls += 1; return aService.promise; });
  const b = makeCard({}, async () => { bCalls += 1; });
  const pending = a._runGarageAction();
  await b._runGarageAction();
  assert.equal(a._garageBusy, true);
  assert.equal(bCalls, 1);
  assert.equal(aCalls, 1);
  aService.resolve(); await pending;
  detach(a); detach(b);
});

await test("editor preserves false zero objects and unknown keys across reopen", () => {
  const config = { ...baseConfig, show_motion_badge: false, action_lock_ms: 0, unknown: { keep: [1, 2] }, camera_entities: [{ entity: "camera.example_garage", custom: true }] };
  const editor = new Editor(); editor._form = {}; editor.setConfig(config);
  assert.equal(editor._formData.show_motion_badge, false);
  assert.equal(editor._formData.action_lock_ms, 0);
  const value = structuredClone(editor._formData); value.name = "Garage fictif";
  editor._valueChanged({ stopPropagation() {}, detail: { value } });
  const saved = editor.events.at(-1).detail.config;
  assert.deepEqual(saved.unknown, config.unknown);
  assert.equal(saved.show_motion_badge, false);
  assert.equal(saved.action_lock_ms, 0);
  assert.deepEqual(saved.camera_entities, config.camera_entities);
  const reopened = new Editor(); reopened._form = {}; reopened.setConfig(saved);
  assert.deepEqual(reopened._config, saved);
});

await test("editor covers defaults and catalog has versionless documented name", () => {
  const form = Card.getConfigForm(); const fields = new Set();
  const collect = (items) => items.forEach((item) => { if (item.selector) fields.add(item.name); if (item.schema) collect(item.schema); });
  collect(form.schema);
  for (const key of Object.keys(Card.getDefaultConfig())) assert(fields.has(key), key);
  const catalog = windowMock.customCards.find((item) => item.type === "garage-control-card");
  assert.equal(catalog.name, "Garage Control Card");
  assert(!/\bv?\d+\.\d+/.test(catalog.name));
  assert(catalog.documentationURL.includes("docs/CARDS.md#garage-control-card"));
});

await test("cleanup removes listeners timers and pending state", () => {
  const card = makeCard();
  card._setFeedback({ text: "test" }, 1000);
  assert(timers.size > 0);
  detach(card);
  assert.equal(timers.size, 0);
  assert.equal(card._garageBusy, false);
  assert.equal(card._pendingAction, null);
  assert.equal(listeners.get("hashchange")?.size || 0, 0);
  assert.equal(listeners.get("keydown")?.size || 0, 0);
});

const distribution = fs.readFileSync("dist/garage-control-card.js", "utf8");
assert(!distribution.includes("cdn.jsdelivr.net"));
assert(!/^\s*import\s/m.test(distribution));
assert(distribution.includes("lit-element 4.2.0 incorporated"));
assert(distribution.includes("garage-control-card-editor"));
console.log(JSON.stringify({ sourceFile, passed, distribution: "static standalone checks", services: "mocked only", haAcceptance: false }));
