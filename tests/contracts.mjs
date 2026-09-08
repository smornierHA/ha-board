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
        for (const name of ['.filters', '.count', '#map', '.empty', '.retry', 'ha-card']) if (value.includes(name === '#map' ? 'id="map"' : name === 'ha-card' ? '<ha-card' : `class="${name.slice(1)}`)) this.nodes.set(name, new Node(name));
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
  const context = vm.createContext({ HTMLElement, customElements: { get: name => registry.get(name), define: (name, klass) => registry.set(name, klass) }, window: { setTimeout, clearTimeout, loadCardHelpers: loader || (async () => ({ createCardElement: async config => fakeMap(config) })), dispatchEvent: event => windowEvents.push(event) }, document: doc, Event, CustomEvent: Event, history: { pushState: (_state, _title, url) => historyEntries.push(url) }, localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }, console });
  if(process.env.POC_BUNDLE)vm.runInContext(fs.readFileSync(process.env.POC_BUNDLE,'utf8'),context,{filename:'ha-board.js'});else for (const file of files) vm.runInContext(source[file], context, { filename: file });
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
  return { ok: markup.includes('Date non fiable') && markup.includes('Horodatage de position futur'), observed: { futureTimestampFlagged: markup.includes('Date non fiable') } };
});

await test('H11', 'cold-load', 'An initially unupgraded native map waits for its definition and receives latest filters and hass.', async()=>{
  const ready=deferred(),native={localName:'hui-map-card'};
  const env=harness({loader:async()=>({createCardElement:()=>native})});
  env.context.customElements.whenDefined=()=>ready.promise;
  env.context.customElements.upgrade=el=>{el.setConfig=c=>{el.config=c;};};
  const card=env.history();card.setConfig(historyConfig());await tick();
  const waiting=!card.map;card.shadowRoot.querySelector('.filters').querySelectorAll('[data-id]')[1].onclick();
  const h={states:{}};card.hass=h;ready.resolve();await tick();
  return {ok:waiting&&card.map===native&&native.hass===h&&native.config.entities.filter(x=>x.entity.startsWith('person.')).length===1,observed:{waiting,nativeMounted:card.map===native,latestHass:native.hass===h}};
});
await test('H12', 'cold-load', 'A timed out load can be retried; an old completion never replaces the retry.', async()=>{
  const old=deferred();let timeout,loads=0;
  const env=harness({loader:()=>++loads===1?old.promise:Promise.resolve({createCardElement:fakeMap})});
  env.context.window.setTimeout=fn=>{timeout=fn;return 1;};env.context.window.clearTimeout=()=>{};
  const card=env.history();card.setConfig(historyConfig());await tick();timeout();await tick();
  const error=card.shadowRoot.innerHTML.includes('Réessayer');
  card.shadowRoot.querySelector('.retry').onclick();await tick();const current=card.map;
  old.resolve({createCardElement:fakeMap});await tick();
  return {ok:error&&!!current&&card.map===current,observed:{error,retryMounted:!!current,lateCompletionIgnored:card.map===current}};
});
await test('H13', 'cold-load', 'Detaching cancels pending timeout and remounting creates a usable map.', async()=>{
  let loads=0,cleared=0;const pending=deferred();
  const env=harness({loader:()=>++loads===1?pending.promise:Promise.resolve({createCardElement:fakeMap})});
  env.context.window.setTimeout=()=>1;env.context.window.clearTimeout=()=>cleared++;
  const card=env.history();card.setConfig(historyConfig());await tick();card.disconnectedCallback();await tick();
  const cancelled=cleared>0;card.connectedCallback();await tick();
  return {ok:cancelled&&!!card.map,observed:{cancelled,mapAfterReconnect:!!card.map}};
});
await test('R12', 'location', 'Home presence retains GPS accuracy and a separately labelled geocoded address.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({gps:'sensor.example_gps',geocoded_location:'sensor.example_geocode'}));
  card.hass=richHass({'person.alice':entity('home'),'sensor.example_gps':entity('Maison'),'sensor.example_geocode':entity('Ville Exemple'),'device_tracker.alice_example':entity('home',{latitude:0,longitude:0,gps_accuracy:17})});
  const l=card.location(card.e('person.alice')),html=card.shadowRoot.innerHTML;
  return {ok:l.coords&&l.precision===17&&l.geocode==='Ville Exemple'&&l.city==='Maison'&&html.includes('Ville Exemple')&&html.includes('Dernière position connue'),observed:{coords:l.coords,precision:l.precision,presence:l.presence}};
});
await test('R13', 'location', 'A text sensor does not hide tracker accuracy or lend its date to geocoding.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({gps:'sensor.example_gps',geocoded_location:'sensor.example_geocode',position_timestamp_attribute:'fix_time'}));
  card.hass=richHass({'sensor.example_gps':entity('Ville Exemple'),'sensor.example_geocode':entity('Adresse Exemple'),'device_tracker.alice_example':entity('not_home',{latitude:0,longitude:0,gps_accuracy:1500,fix_time:'2026-09-05T10:00:00Z'})});
  const l=card.location(card.e('person.alice'));
  return {ok:l.coords&&l.precision===1500&&l.timestamp===Date.parse('2026-09-05T10:00:00Z')&&l.geocode==='Adresse Exemple',observed:{coords:l.coords,precision:l.precision,sourceTimestamp:l.timestamp}};
});
await test('R14', 'location', 'A named HA zone wins over city and address candidates in compact and detail headers.', async()=>{
  const env=harness(),compact=env.rich();compact.setConfig(richConfig({mode:'compact',geocoded_location:'sensor.example_geocode'}));
  compact.hass=richHass({'person.alice':entity('Bureau 2',{friendly_name:'Alice Exemple'}),'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3,city:'Ville Tracker'}),'sensor.example_geocode':entity('10 rue Exemple, 75001 Ville Géocodée, France')});
  const location=compact.location(compact.e('person.alice')),compactHtml=compact.shadowRoot.innerHTML;
  const detail=env.rich();detail.setConfig(richConfig({geocoded_location:'sensor.example_geocode'}));detail.hass=compact.h;
  return {ok:location.city==='Bureau 2'&&compactHtml.includes('Bureau 2')&&detail.shadowRoot.innerHTML.includes('Bureau 2'),observed:{city:location.city,compactHeader:compactHtml.includes('Bureau 2'),detailHeader:detail.shadowRoot.innerHTML.includes('Bureau 2')}};
});
await test('R15', 'location', 'A structured geocoded city replaces the old Hors zone fallback when tracker coordinates exist.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({mode:'compact',geocoded_location:'sensor.example_geocode'}));
  card.hass=richHass({'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3}),'sensor.example_geocode':entity('10 rue Exemple, 75001 Ville Texte, France',{city:'Ville Structurée'})});
  const location=card.location(card.e('person.alice'));
  return {ok:location.city==='Ville Structurée'&&!card.shadowRoot.innerHTML.includes('Hors zone'),observed:{city:location.city,oldFallbackVisible:card.shadowRoot.innerHTML.includes('Hors zone')}};
});
await test('R16', 'location', 'City extraction is conservative and never returns a street, country or coordinates.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig());
  const values={address:card.city('10 rue Exemple, 75001 Ville Exemple, France'),street:card.city('10 rue Exemple'),country:card.city('France'),otherCountry:card.city('United States'),coordinates:card.city('48.50000, 2.30000'),technical:card.city('Hors zone')};
  return {ok:values.address==='Ville Exemple'&&values.street===null&&values.country===null&&values.otherCountry===null&&values.coordinates===null&&values.technical===null,observed:values};
});
await test('R17', 'location', 'Away-from-home duration is not presented as time spent in the displayed city.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({mode:'compact',duration:'sensor.example_duration',geocoded_location:'sensor.example_geocode'}));
  card.hass=richHass({'sensor.example_duration':entity('depuis 2 h'),'sensor.example_geocode':entity('75001 Ville Exemple'),'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3})});
  return {ok:card.location(card.e('person.alice')).city==='Ville Exemple'&&!card.shadowRoot.innerHTML.includes('2 h'),observed:{markupContainsAwayDuration:card.shadowRoot.innerHTML.includes('2 h')}};
});
await test('R18', 'location-detail', 'The regular last-position view shows city and address; coordinates and quality stay in native details.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({geocoded_location:'sensor.example_geocode',position_timestamp_attribute:'fix_time',geocoded_timestamp_attribute:'address_time'}));
  card.hass=richHass({'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3,gps_accuracy:12,city:'Ville Exemple',fix_time:'2026-09-07T10:00:00Z'}),'sensor.example_geocode':entity('10 rue Exemple, 75001 Ville Exemple, France',{city:'Ville Exemple',address_time:'2026-09-07T10:00:00Z'})});
  const html=card.shadowRoot.innerHTML,regular=html.split('<details class="quality">')[0];
  return {ok:regular.includes('Ville Exemple')&&regular.includes('10 rue Exemple')&&!regular.includes('48.50000')&&html.includes('<details class="quality">')&&html.includes('48.50000')&&html.includes('Précision ±12 m')&&html.includes('Source position</b>device_tracker.alice_example')&&html.includes('Date position')&&html.includes('Source adresse</b>sensor.example_geocode')&&html.includes('Date adresse'),observed:{regularCoordinatesVisible:regular.includes('48.50000'),detailsPresent:html.includes('<details class="quality">'),positionAndAddressProvenance:html.includes('Source position')&&html.includes('Source adresse'),positionAndAddressDates:html.includes('Date position')&&html.includes('Date adresse')}};
});
await test('R19', 'location-detail', 'An explicitly older geocoded address is not merged with a newer position.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({geocoded_location:'sensor.example_geocode',position_timestamp_attribute:'fix_time',geocoded_timestamp_attribute:'address_time'}));
  card.hass=richHass({'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3,city:'Ville Exemple',fix_time:'2026-09-07T10:00:00Z'}),'sensor.example_geocode':entity('10 rue Ancienne, 75001 Ville Exemple, France',{city:'Ville Exemple',address_time:'2026-09-07T09:00:00Z'})});
  const location=card.location(card.e('person.alice')),html=card.shadowRoot.innerHTML,regular=html.split('<details class="quality">')[0];
  return {ok:location.addressSeparated&&location.separationReason.includes('plus ancienne')&&regular.includes('Adresse non rapprochée')&&!regular.includes('10 rue Ancienne')&&html.includes('10 rue Ancienne'),observed:{addressSeparated:location.addressSeparated,reason:location.separationReason}};
});
await test('R20', 'location-detail', 'Unknown and unavailable sources yield a sober unavailable location without retained attributes.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({geocoded_location:'sensor.example_geocode'}));
  card.hass=richHass({'person.alice':entity('unknown'),'device_tracker.alice_example':entity('unavailable',{latitude:48.5,longitude:2.3,city:'Ville Retenue'}),'sensor.example_geocode':entity('unavailable',{formatted_address:'Adresse Retenue'})});
  const location=card.location(card.e('person.alice')),html=card.shadowRoot.innerHTML;
  return {ok:location.status==='unavailable'&&location.city==='Localisation inconnue'&&!html.includes('Ville Retenue')&&!html.includes('Adresse Retenue')&&html.includes('Indisponible'),observed:{status:location.status,city:location.city}};
});
await test('R21', 'location-detail', 'Geocoded timestamp options are visually editable and the quality disclosure is keyboard-native.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig());card.hass=richHass();
  const names=new Set(card.constructor.getConfigForm().schema.map(item=>item.name)),html=card.shadowRoot.innerHTML;
  return {ok:names.has('geocoded_timestamp_entity')&&names.has('geocoded_timestamp_attribute')&&names.has('geocoded_stale_after_minutes')&&html.includes('<details class="quality">')&&html.includes('<summary>Qualité'),observed:{editorFields:[...names].filter(name=>name.startsWith('geocoded_')),nativeDetails:html.includes('<details class="quality">')}};
});
await test('R22', 'location-detail', 'A dated old address stays separate from a current named zone even without a GPS timestamp.', async()=>{
  const env=harness(),card=env.rich(),oldAddress=new Date(Date.now()-120*60000).toISOString();card.setConfig(richConfig({geocoded_location:'sensor.example_geocode',geocoded_timestamp_attribute:'address_time',geocoded_stale_after_minutes:30}));
  card.hass=richHass({'person.alice':entity('Bureau 2',{friendly_name:'Alice Exemple'}),'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3}),'sensor.example_geocode':entity('10 rue Ancienne, 75001 Ville Exemple, France',{address_time:oldAddress})});
  const location=card.location(card.e('person.alice'));
  return {ok:location.city==='Bureau 2'&&location.addressSeparated&&location.separationReason.includes('zone actuelle'),observed:{city:location.city,addressSeparated:location.addressSeparated,reason:location.separationReason}};
});
await test('R23', 'location-detail', 'An address recorded before entry into the current zone stays separate even without coordinates or a configured age threshold.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({geocoded_location:'sensor.example_geocode',geocoded_timestamp_attribute:'address_time'}));
  card.hass=richHass({'person.alice':entity('Bureau 2',{friendly_name:'Alice Exemple'},{last_changed:'2026-09-07T10:00:00Z'}),'device_tracker.alice_example':entity('unavailable'),'sensor.example_geocode':entity('10 rue Ancienne, 75001 Ville Exemple, France',{address_time:'2026-09-07T09:00:00Z'})});
  const location=card.location(card.e('person.alice')),html=card.shadowRoot.innerHTML,regular=html.split('<details class="quality">')[0];
  return {ok:location.city==='Bureau 2'&&location.addressSeparated&&location.separationReason.includes('antérieure à la zone actuelle')&&regular.includes('Adresse non rapprochée')&&!regular.includes('10 rue Ancienne')&&html.includes('Zone depuis')&&html.includes('10 rue Ancienne'),observed:{city:location.city,addressSeparated:location.addressSeparated,reason:location.separationReason,zoneDateInDetails:html.includes('Zone depuis')}};
});
await test('R24', 'location', 'Technical away labels and long error states are never exposed as a city or current address.', async()=>{
  const env=harness(),card=env.rich();card.setConfig(richConfig({gps:'sensor.example_gps',geocoded_location:'sensor.example_geocode'}));
  card.hass=richHass({'sensor.example_gps':entity('Hors zone'),'sensor.example_geocode':entity('API key required: synthetic provider error')});
  const location=card.location(card.e('person.alice')),html=card.shadowRoot.innerHTML;
  return {ok:location.city==='Localisation inconnue'&&location.address===null&&!html.includes('API key required')&&!html.includes('Hors zone'),observed:{city:location.city,address:location.address,technicalTextVisible:html.includes('API key required')||html.includes('Hors zone')}};
});
await test('R25', 'city-freshness', 'An older geocoded city is labelled as the last known city in compact and detail while retaining its source and date.', async()=>{
  const env=harness(),card=env.rich(),fixTime=new Date().toISOString(),cityTime=new Date(Date.now()-120*60000).toISOString();
  const config=richConfig({mode:'compact',geocoded_location:'sensor.example_geocode',position_timestamp_attribute:'fix_time',geocoded_timestamp_attribute:'address_time'}),hass=richHass({'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3,fix_time:fixTime}),'sensor.example_geocode':entity('10 rue Ancienne, 75001 Ville Exemple, France',{city:'Ville Exemple',address_time:cityTime})});
  card.setConfig(config);card.hass=hass;const location=card.location(card.e('person.alice')),compact=card.shadowRoot.innerHTML;
  const detail=env.rich();detail.setConfig({...config,mode:'detail'});detail.hass=hass;const detailRegular=detail.shadowRoot.innerHTML.split('<details class="quality">')[0];
  return {ok:location.city==='Ville Exemple'&&location.cityDisplay==='Ville Exemple · dernière ville connue'&&location.cityLastKnown&&location.citySource==='sensor.example_geocode'&&location.cityTimestamp===Date.parse(cityTime)&&compact.includes('Ville Exemple · dernière ville connue')&&detailRegular.includes('Ville Exemple · dernière ville connue'),observed:{city:location.city,cityDisplay:location.cityDisplay,citySource:location.citySource,cityTimestamp:location.cityTimestamp,compactQualified:compact.includes('dernière ville connue'),detailQualified:detailRegular.includes('dernière ville connue')}};
});
await test('R26', 'city-freshness', 'An undated geocoded city is labelled as the last known city rather than presented as current.', async()=>{
  const env=harness(),card=env.rich(),fixTime=new Date().toISOString();
  const config=richConfig({mode:'compact',geocoded_location:'sensor.example_geocode',position_timestamp_attribute:'fix_time',geocoded_timestamp_attribute:'address_time'}),hass=richHass({'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3,fix_time:fixTime}),'sensor.example_geocode':entity('75001 Ville Exemple',{city:'Ville Exemple'})});
  card.setConfig(config);card.hass=hass;const location=card.location(card.e('person.alice')),compact=card.shadowRoot.innerHTML;
  const detail=env.rich();detail.setConfig({...config,mode:'detail'});detail.hass=hass;const detailRegular=detail.shadowRoot.innerHTML.split('<details class="quality">')[0];
  return {ok:location.city==='Ville Exemple'&&location.cityDisplay==='Ville Exemple · dernière ville connue'&&location.cityLastKnown&&location.citySource==='sensor.example_geocode'&&location.cityTimestamp===null&&compact.includes('Ville Exemple · dernière ville connue')&&detailRegular.includes('Ville Exemple · dernière ville connue'),observed:{city:location.city,cityDisplay:location.cityDisplay,citySource:location.citySource,cityTimestamp:location.cityTimestamp,compactQualified:compact.includes('dernière ville connue'),detailQualified:detailRegular.includes('dernière ville connue')}};
});
await test('R27', 'city-freshness', 'A future geocoded city is excluded from the current compact and detail presentation.', async()=>{
  const env=harness(),card=env.rich(),fixTime=new Date().toISOString(),futureTime=new Date(Date.now()+24*60*60000).toISOString();
  const config=richConfig({mode:'compact',geocoded_location:'sensor.example_geocode',position_timestamp_attribute:'fix_time',geocoded_timestamp_attribute:'address_time'}),hass=richHass({'device_tracker.alice_example':entity('not_home',{latitude:48.5,longitude:2.3,fix_time:fixTime}),'sensor.example_geocode':entity('75001 Ville Future',{city:'Ville Future',address_time:futureTime})});
  card.setConfig(config);card.hass=hass;const location=card.location(card.e('person.alice')),compact=card.shadowRoot.innerHTML;
  const detail=env.rich();detail.setConfig({...config,mode:'detail'});detail.hass=hass;const detailRegular=detail.shadowRoot.innerHTML.split('<details class="quality">')[0];
  return {ok:location.city==='Localisation inconnue'&&location.citySource===null&&!compact.includes('Ville Future')&&!detailRegular.includes('Ville Future'),observed:{city:location.city,citySource:location.citySource,compactShowsFuture:compact.includes('Ville Future'),detailShowsFuture:detailRegular.includes('Ville Future'),addressSeparated:location.addressSeparated,separationReason:location.separationReason}};
});
await test('E01', 'visual-editor', 'Both discoverable cards provide native form editors and unversioned names with documentation links.', async()=>{
  const env=harness();const cards=[env.history(),env.rich()];
  const forms=cards.map(c=>c.constructor.getConfigForm());
  const meta=env.context.window.customCards;
  return {ok:forms.every(f=>f.schema.length>0)&&meta.length===2&&meta.every(m=>!/[Vv]\d/.test(m.name)&&m.documentationURL),observed:{fields:forms.map(f=>f.schema.length),names:meta.map(m=>m.name)}};
});
await test('E02', 'visual-editor', 'History uses editable person rows; Rich exposes all entity fields, modes and source freshness settings.', async()=>{
  const env=harness(),history=env.history().constructor.getConfigForm(),rich=env.rich().constructor.getConfigForm();
  const people=history.schema.find(s=>s.name==='persons').selector.object;
  const names=new Set(rich.schema.map(s=>s.name));
  const required=['entity','mode','tracker','gps','geocoded_location','battery','battery_state','tablet_tracker','position_timestamp_entity','position_timestamp_attribute','position_stale_after_minutes','geocoded_timestamp_entity','geocoded_timestamp_attribute','geocoded_stale_after_minutes','navigation_path','location_entities'];
  return {ok:people.multiple&&people.fields.entity.required&&people.fields.name&&people.fields.color&&required.every(x=>names.has(x)),observed:{multiplePersonRows:people.multiple,missingRichFields:required.filter(x=>!names.has(x))}};
});

const report = {
  schemaVersion: 1, createdAt: new Date().toISOString(), nodeVersion: process.version,
  bundle: process.env.POC_BUNDLE ? {path:'dist/ha-board.js',sha256:crypto.createHash('sha256').update(fs.readFileSync(process.env.POC_BUNDLE)).digest('hex')} : null,
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
