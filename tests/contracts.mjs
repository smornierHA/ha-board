import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Contract tests for the exact exported baseline. No product rewrite or dependency.
const here = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(process.env.POC_SOURCE_DIR || path.join(here, '../src'));
const outDir = path.resolve(process.env.POC_REPORT_DIR || path.join(here, '../artifacts'));
fs.mkdirSync(outDir, { recursive: true });
const files = ['person-history-map-card-v14.js', 'person-rich-card-v34.js'];
const source = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(sourceDir, file), 'utf8')]));
const observedRejections = [];
process.on('unhandledRejection', err => observedRejections.push(String(err?.message || err)));
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function fakeMap(config) { return { config, setConfig(value) { this.config = value; } }; }

function harness({ storage = new Map(), loader } = {}) {
  const registry = new Map(), doc = { activeElement: null }, windowEvents = [], historyEntries = [];
  class Node {
    constructor(kind) { this.kind = kind; this.nodes = new Map(); this.style = {}; this.children = []; this.listeners = new Map(); this.dataset = {}; this.writes = 0; }
    set innerHTML(value) {
      if ([...this.nodes.values()].includes(doc.activeElement)) doc.activeElement = null;
      this.html = value; this.nodes = new Map(); this.children = []; this.writes++;
      if (this.kind === 'shadow') {
        for (const name of ['.filters', '.count', '#map', '.empty', 'ha-card']) if (value.includes(name === '#map' ? 'id="map"' : name === 'ha-card' ? '<ha-card' : `class="${name.slice(1)}`)) this.nodes.set(name, new Node(name));
      }
      if (this.kind === '.filters') {
        if (value.includes('data-all')) this.nodes.set('[data-all]', new Node('button'));
        this.buttons = [...value.matchAll(/data-id="([^"]+)"/g)].map(match => { const node = new Node('button'); node.dataset.id = match[1]; return node; });
      }
    }
    get innerHTML() { return this.html || ''; }
    querySelector(selector) { return this.nodes.get(selector) || null; }
    querySelectorAll(selector) { return selector === '[data-id]' ? (this.buttons || []) : []; }
    appendChild(child) { this.children.push(child); this.appends = (this.appends || 0) + 1; return child; }
    addEventListener(type, listener) { this.listeners.set(type, listener); }
    focus() { doc.activeElement = this; }
    fire(type, event = {}) { return this.listeners.get(type)?.(event); }
  }
  class HTMLElement {
    constructor() { this.isConnected = true; this.events = []; }
    attachShadow() { return this.shadowRoot = new Node('shadow'); }
    dispatchEvent(event) { this.events.push(event); return true; }
  }
  class Event { constructor(type, detail = {}) { this.type = type; Object.assign(this, detail); } }
  const context = vm.createContext({ HTMLElement, customElements: { get: name => registry.get(name), define: (name, klass) => registry.set(name, klass) }, window: { loadCardHelpers: loader || (async () => ({ createCardElement: async config => fakeMap(config) })), dispatchEvent: event => windowEvents.push(event) }, document: doc, Event, CustomEvent: Event, history: { pushState: (_state, _title, url) => historyEntries.push(url) }, localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }, console });
  for (const file of files) vm.runInContext(source[file], context, { filename: file });
  return { history: () => new (registry.get('person-history-map-card-v14'))(), rich: () => new (registry.get('person-rich-card-v34'))(), storage, doc, windowEvents, historyEntries, context };
}

const persons = () => [{ entity: 'person.alice', name: 'Alice Exemple', color: '#4269d0' }, { entity: 'person.bob', name: 'Bob Exemple', color: '#f4bd4a' }];
const historyConfig = extra => ({ persons: persons(), zone_entity: 'zone.example_home', ...extra });
const richConfig = extra => ({ entity: 'person.alice', tracker: 'device_tracker.alice_example', battery: 'sensor.example_battery', battery_state: 'sensor.example_battery_state', ...extra });
const entity = (state, attributes = {}, extra = {}) => ({ state, attributes, ...extra });
const richHass = additions => ({ states: { 'person.alice': entity('not_home', { friendly_name: 'Alice Exemple', entity_picture: '/local/example-avatar.svg' }), ...additions } });
const results = [];
async function test(id, category, contract, run) {
  try { const result = await run(); results.push({ id, category, contract, status: result.ok ? 'pass' : 'fail', observed: result.observed }); }
  catch (error) { results.push({ id, category, contract, status: 'harness_error', observed: String(error.stack || error) }); }
}

await test('H01', 'preserved', 'History delegates to native map with configured history hours and aspect ratio.', async () => {
  const env = harness(), card = env.history(); card.setConfig(historyConfig({ hours_to_show: 48 })); await tick();
  return { ok: card.map.config.type === 'map' && card.map.config.hours_to_show === 48 && card.map.config.aspect_ratio === '4:3', observed: card.map.config };
});
await test('H02', 'preserved', 'Individual filters support multiple selections and stable entity colors.', async () => {
  const env = harness(), card = env.history(); card.setConfig(historyConfig()); await tick();
  card.shadowRoot.querySelector('.filters').querySelectorAll('[data-id]')[0].onclick();
  const afterRemove = JSON.parse(JSON.stringify(card.map.config.entities));
  card.shadowRoot.querySelector('.filters').querySelectorAll('[data-id]')[0].onclick();
  return { ok: afterRemove[0].entity === 'person.bob' && afterRemove[0].color === '#f4bd4a' && card.sel.size === 2, observed: { afterRemove, selectedAfterRestore: [...card.sel] } };
});
await test('H03', 'preserved', 'Tous toggles all to none; the empty selection survives reload.', async () => {
  const env = harness(), card = env.history(); card.setConfig(historyConfig({ storage_key: 'example-reload' })); await tick();
  card.shadowRoot.querySelector('.filters').querySelector('[data-all]').onclick();
  const second = env.history(); second.setConfig(historyConfig({ storage_key: 'example-reload' })); await tick();
  const empty = second.sel.size === 0 && second.shadowRoot.querySelector('.empty').style.display === 'grid';
  second.shadowRoot.querySelector('.filters').querySelector('[data-all]').onclick();
  return { ok: empty && second.sel.size === 2, observed: { emptyPersisted: empty, selectedAfterTous: [...second.sel] } };
});
await test('H04', 'preserved', 'Explicit different storage keys isolate two instances.', async () => {
  const env = harness(), a = env.history(); a.setConfig(historyConfig({ storage_key: 'example-a' })); await tick();
  a.shadowRoot.querySelector('.filters').querySelector('[data-all]').onclick();
  const b = env.history(); b.setConfig(historyConfig({ storage_key: 'example-b' })); await tick();
  return { ok: b.sel.size === 2, observed: { selectedInSecondInstance: [...b.sel] } };
});
await test('H05', 'regression', 'A later setConfig wins when native-card creations finish in reverse order.', async () => {
  const jobs = [], env = harness({ loader: async () => ({ createCardElement: config => { const job = deferred(); jobs.push({ ...job, config }); return job.promise; } }) }), card = env.history();
  card.setConfig(historyConfig()); await tick();
  card.setConfig(historyConfig({ persons: [{ entity: 'person.charlie', name: 'Charlie Exemple' }] })); await tick();
  jobs[1].resolve(fakeMap(jobs[1].config)); await tick(); jobs[0].resolve(fakeMap(jobs[0].config)); await tick();
  const shown = card.map.config.entities.filter(item => item.entity.startsWith('person.')).map(item => item.entity);
  return { ok: shown.length === 1 && shown[0] === 'person.charlie', observed: { configuredPersons: card.c.persons.map(item => item.entity), actuallyMountedPersons: shown } };
});
await test('H06', 'regression', 'A filter clicked during initial card creation is applied to the mounted map.', async () => {
  const pending = deferred(); let requested; const env = harness({ loader: async () => ({ createCardElement: config => { requested = config; return pending.promise; } }) }), card = env.history();
  card.setConfig(historyConfig()); await tick();
  card.shadowRoot.querySelector('.filters').querySelectorAll('[data-id]')[1].onclick();
  pending.resolve(fakeMap(requested)); await tick();
  const shown = card.map.config.entities.filter(item => item.entity.startsWith('person.')).map(item => item.entity);
  return { ok: shown.length === 1 && shown[0] === 'person.alice', observed: { selected: [...card.sel], actuallyMountedPersons: shown } };
});
await test('H07', 'regression', 'Failure to load native helpers is caught and surfaced inside the card.', async () => {
  const before = observedRejections.length, env = harness({ loader: async () => { throw new Error('Synthetic helper unavailable'); } }), card = env.history();
  card.setConfig(historyConfig()); await tick(); await tick();
  const rejections = observedRejections.slice(before), html = card.shadowRoot.innerHTML;
  return { ok: rejections.length === 0 && /role=["']alert|indisponible|réessayer/i.test(html), observed: { unhandledRejections: rejections, visibleErrorRendered: /role=["']alert|indisponible|réessayer/i.test(html), mapMounted: !!card.map } };
});
await test('H08', 'regression', 'A card detached while native-card creation is pending ignores that completion.', async () => {
  const pending = deferred(), env = harness({ loader: async () => ({ createCardElement: config => pending.promise.then(() => fakeMap(config)) }) }), card = env.history();
  card.setConfig(historyConfig()); await tick(); card.isConnected = false; card.disconnectedCallback?.();
  pending.resolve(); await tick(); const host = card.shadowRoot.querySelector('#map');
  return { ok: !card.map && host.children.length === 0, observed: { detached: !card.isConnected, hasDisconnectLifecycle: typeof card.disconnectedCallback === 'function', childMountedAfterDetach: host.children.length === 1 } };
});
await test('H09', 'regression', 'Default filter persistence is scoped to the card instance.', async () => {
  const env = harness(), a = env.history(); a.setConfig(historyConfig()); await tick(); a.shadowRoot.querySelector('.filters').querySelector('[data-all]').onclick();
  const b = env.history(); b.setConfig(historyConfig()); await tick();
  return { ok: b.sel.size === 2, observed: { defaultStorageKey: a.c.storage_key, secondIndependentInstanceSelectedCount: b.sel.size, mitigation: 'Explicit distinct storage_key per configured instance already works (H04).' } };
});
await test('H10', 'regression', 'Unrelated hass updates preserve the current filter DOM and keyboard focus.', async () => {
  const env = harness(), card = env.history(); card.setConfig(historyConfig()); await tick();
  const button = card.shadowRoot.querySelector('.filters').querySelector('[data-all]'); button.focus();
  card.hass = { states: { 'sensor.unrelated_example': entity('42') } };
  return { ok: env.doc.activeElement === button && card.shadowRoot.querySelector('.filters').querySelector('[data-all]') === button, observed: { filterButtonReplaced: card.shadowRoot.querySelector('.filters').querySelector('[data-all]') !== button, keyboardFocusPreserved: env.doc.activeElement === button } };
});
await test('R01', 'preserved', 'Unavailable batteries stay unknown, levels are bounded, and charging remains visible.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig()); card.hass = richHass({ 'sensor.example_battery': entity('unavailable'), 'sensor.example_battery_state': entity('Charging') });
  const unavailable = card.battery('sensor.example_battery', 'sensor.example_battery_state');
  card.hass = richHass({ 'sensor.example_battery': entity('140'), 'sensor.example_battery_state': entity('Charging') });
  const high = card.battery('sensor.example_battery', 'sensor.example_battery_state');
  return { ok: !unavailable.ok && high.pct === 100 && high.charging && card.shadowRoot.innerHTML.includes('mdi:lightning-bolt'), observed: { unavailable: { ok: unavailable.ok, pct: unavailable.pct }, upperBoundPct: high.pct, chargingIconInMarkup: card.shadowRoot.innerHTML.includes('mdi:lightning-bolt') } };
});
await test('R02', 'preserved', 'Avatar, compact battery structure and Enter navigation remain available.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig({ mode: 'compact', navigation_path: '/lovelace/example-people' })); card.hass = richHass();
  let prevented = false; card.shadowRoot.querySelector('ha-card').fire('keydown', { key: 'Enter', preventDefault: () => { prevented = true; } });
  return { ok: card.shadowRoot.innerHTML.includes('/local/example-avatar.svg') && card.shadowRoot.innerHTML.includes('iosBattery compactBattery') && env.historyEntries[0] === '/lovelace/example-people' && env.windowEvents[0]?.type === 'location-changed' && prevented, observed: { avatarReferenceRetained: card.shadowRoot.innerHTML.includes('/local/example-avatar.svg'), compactBatteryMarkup: card.shadowRoot.innerHTML.includes('iosBattery compactBattery'), navigationPaths: env.historyEntries, dispatchedEvents: env.windowEvents.map(item => item.type), nativeBrowserNavigationTested: false } };
});
await test('R03', 'preserved', 'Detail activation emits hass-more-info for the configured entity.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig()); card.hass = richHass(); card.shadowRoot.querySelector('ha-card').fire('click');
  const event = card.events[0];
  return { ok: event?.type === 'hass-more-info' && event.detail.entityId === 'person.alice' && event.bubbles && event.composed, observed: event };
});
await test('R04', 'regression', 'Unavailable geocoding data with retained attributes is identified as unavailable.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig({ geocoded_location: 'sensor.example_geocode' })); card.hass = richHass({ 'sensor.example_geocode': entity('unavailable', { city: 'Ville Exemple', latitude: 0, longitude: 0 }) });
  const value = card.location(card.e('person.alice'));
  return { ok: value.city !== 'Ville Exemple', observed: { sourceState: 'unavailable', locationReturned: value, currentPositionLabelPresent: card.shadowRoot.innerHTML.includes('<small>Position actuelle</small>') } };
});
await test('R05', 'regression', 'Null coordinates do not count as valid GPS coordinates.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig()); card.hass = richHass({ 'device_tracker.alice_example': entity('not_home', { latitude: null, longitude: null }) });
  const value = card.location(card.e('person.alice'));
  return { ok: !value.coords, observed: { inputCoordinates: { latitude: null, longitude: null }, locationReturned: value } };
});
await test('R06', 'regression', 'Coordinate values outside latitude/longitude ranges are not accepted.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig()); card.hass = richHass({ 'device_tracker.alice_example': entity('not_home', { latitude: 999, longitude: 999 }) });
  const value = card.location(card.e('person.alice'));
  return { ok: !value.coords, observed: { inputCoordinates: { latitude: 999, longitude: 999 }, locationReturned: value } };
});
await test('R07', 'regression', 'A location with no position-specific timestamp is not labeled as a current fix.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig()); card.hass = richHass({ 'device_tracker.alice_example': entity('not_home', { latitude: 0, longitude: 0 }, { last_updated: '2026-09-06T10:00:00Z' }) });
  const current = card.shadowRoot.innerHTML.includes('<small>Position actuelle</small>');
  return { ok: !current, observed: { positionTimestampAvailable: false, stateLastUpdatedAvailable: true, labelIsCurrentPosition: current, interpretation: 'last_updated timestamps an HA state update; it does not establish the time of a GPS fix.' } };
});
await test('R08', 'regression', 'A supplied GPS accuracy of 1500 m is exposed as location uncertainty.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig()); card.hass = richHass({ 'device_tracker.alice_example': entity('not_home', { latitude: 0, longitude: 0, gps_accuracy: 1500 }) });
  const markup = card.shadowRoot.innerHTML;
  return { ok: markup.includes('1500') || markup.includes('1,5 km') || markup.includes('1.5 km'), observed: { suppliedGpsAccuracyMeters: 1500, precisionExposedInMarkup: markup.includes('1500') || markup.includes('1,5 km') || markup.includes('1.5 km') } };
});
await test('R09', 'regression', 'Unrelated hass updates preserve the focused Person Rich card DOM.', async () => {
  const env = harness(), card = env.rich(); card.setConfig(richConfig()); card.hass = richHass();
  const control = card.shadowRoot.querySelector('ha-card'); control.focus(); card.hass = richHass({ 'sensor.unrelated_example': entity('42') });
  return { ok: env.doc.activeElement === control && card.shadowRoot.querySelector('ha-card') === control, observed: { cardDomReplaced: card.shadowRoot.querySelector('ha-card') !== control, keyboardFocusPreserved: env.doc.activeElement === control } };
});


await test('R10', 'freshness', 'An explicit old source-fix timestamp can be marked stale without using HA last_updated.', async () => {
  const env = harness(), card = env.rich();
  const oldFix = new Date(Date.now() - 90 * 60 * 1000).toISOString();
  card.setConfig(richConfig({ position_timestamp_attribute: 'fix_time', position_stale_after_minutes: 30 }));
  card.hass = richHass({ 'device_tracker.alice_example': entity('not_home', { latitude: 0, longitude: 0, fix_time: oldFix, gps_accuracy: 12 }) });
  const markup = card.shadowRoot.innerHTML;
  return { ok: markup.includes('Position ancienne') && markup.includes('Précision ±12 m'), observed: { staleMarked: markup.includes('Position ancienne'), precisionShown: markup.includes('Précision ±12 m') } };
});
await test('R11', 'freshness', 'A future source-fix timestamp is flagged as unreliable rather than fresh.', async () => {
  const env = harness(), card = env.rich();
  const futureFix = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  card.setConfig(richConfig({ position_timestamp_attribute: 'fix_time' }));
  card.hass = richHass({ 'device_tracker.alice_example': entity('not_home', { latitude: 0, longitude: 0, fix_time: futureFix }) });
  const markup = card.shadowRoot.innerHTML;
  return { ok: markup.includes('fraîcheur non fiable'), observed: { futureTimestampFlagged: markup.includes('fraîcheur non fiable') } };
});

const report = {
  schemaVersion: 1, createdAt: new Date().toISOString(), nodeVersion: process.version,
  environment: 'Local Node vm with minimal DOM, storage and HA helper doubles; not a real browser and not Home Assistant.',
  personalData: 'Only fictional entities, names, paths, places and synthetic coordinates are used by this harness.',
  productModified: true,
  sources: files.map(file => ({ file, sha256: crypto.createHash('sha256').update(source[file]).digest('hex') })),
  limitations: ['No native HA map implementation, real history API, real tile provider or CARTO watermark is exercised.', 'No browser rendering, CSS layout, Memoji asset loading, mobile/desktop, light/dark theme or production acceptance is established.', 'GPS freshness requires a verified source-specific fix timestamp. Entity last_updated is not substituted for that timestamp.', 'Rejections are captured by the harness process solely to record baseline failures; the product code is unchanged.'],
  summary: { total: results.length, pass: results.filter(item => item.status === 'pass').length, fail: results.filter(item => item.status === 'fail').length, harnessError: results.filter(item => item.status === 'harness_error').length },
  tests: results
};
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'contract-report.json'), JSON.stringify(report, null, 2) + '\n');
const rows = results.map(item => `| ${item.id} | ${item.status.toUpperCase()} | ${item.contract} |`).join('\n');
fs.writeFileSync(path.join(outDir, 'contract-report.md'), `# POC geolocation — strict contract results after reliability fixes\n\nGenerated: ${report.createdAt}. Node ${process.version}.\n\n${report.environment}\n\n**${report.summary.pass} contracts pass; ${report.summary.fail} fail; ${report.summary.harnessError} harness errors. Product sources corrected from the preserved import baseline.**\n\nSource SHA-256:\n\n${report.sources.map(item => '- `' + item.file + '`: `' + item.sha256 + '`').join('\n')}\n\n| Test | Result | Contract |\n| --- | --- | --- |\n${rows}\n\nLimits: ${report.limitations.join(' ')}\n\nReproduce from the project root: \`node tests/baseline.mjs\`. Override \`POC_SOURCE_DIR\` for another exact source export; \`POC_REPORT_DIR\` for output. Exit code 1 means demonstrated unmet contracts (baseline is deliberately not green).\n`);
console.log(JSON.stringify({ ...report.summary, reports: ['contract-report.json', 'contract-report.md'], productModified: true }));
process.exitCode = report.summary.fail || report.summary.harnessError ? 1 : 0;
