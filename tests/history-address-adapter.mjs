import assert from 'node:assert/strict';
import { HistoricalAddressAdapter } from '../src/candidate/history-address-adapter.mjs';

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};
const point = (longitude, timestamp) => ({
  entity: 'person.alice', latitude: 48.5, longitude, timestamp,
});

const records = new Map([
  ['2026-09-07T08:00:00.000Z', { address: '10 rue Exemple, 75001 Ville A, France', kind: 'recorded' }],
  ['2026-09-07T09:00:00.000Z', { address: '20 avenue Exemple, 75002 Ville B, France', kind: 'recorded' }],
]);
const recorded = new HistoricalAddressAdapter({ resolve: async ({ timestamp }) => records.get(timestamp) || null });
const first = await recorded.lookup(point(2.30, '2026-09-07T08:00:00.000Z'));
const second = await recorded.lookup(point(2.31, '2026-09-07T09:00:00.000Z'));
assert.equal(first.address, '10 rue Exemple, 75001 Ville A, France');
assert.equal(second.address, '20 avenue Exemple, 75002 Ville B, France');
assert.notEqual(first.address, second.address, 'Each historical point keeps its own recorded address.');
assert.equal(await recorded.lookup(point(2.32, '2026-09-07T10:00:00.000Z')), null, 'No current address is substituted for a point without a record.');

let calls = 0;
const waiting = deferred();
const bounded = new HistoricalAddressAdapter({ maxEntries: 2, resolve: async () => { calls++; return waiting.promise; } });
const duplicateA = bounded.lookup(point(2.40, '2026-09-07T10:00:00.000Z'));
const duplicateB = bounded.lookup(point(2.40, '2026-09-07T10:00:00.000Z'));
waiting.resolve({ address: '30 boulevard Exemple, 75003 Ville C, France', kind: 'reverse-geocoded' });
assert.deepEqual(await duplicateA, await duplicateB);
assert.equal(calls, 1, 'Concurrent requests for the same point are deduplicated.');
await bounded.lookup(point(2.41, '2026-09-07T11:00:00.000Z'));
await bounded.lookup(point(2.42, '2026-09-07T12:00:00.000Z'));
assert.equal(bounded.cache.size, 2, 'The cache is bounded.');

const late = deferred();
const cancellable = new HistoricalAddressAdapter({ resolve: async () => late.promise });
const stale = cancellable.lookup(point(2.50, '2026-09-07T13:00:00.000Z'));
cancellable.configure({ resolve: async () => ({ address: '40 route Exemple, 75004 Ville D, France', kind: 'recorded' }) });
late.resolve({ address: 'Adresse périmée', kind: 'recorded' });
assert.equal(await stale, null, 'A response from the previous configuration is refused.');
const detached = cancellable.lookup(point(2.51, '2026-09-07T14:00:00.000Z'));
cancellable.detach();
assert.equal(await detached, null, 'A response after detach is refused.');

console.log('Historical address adapter: 3/3 synthetic contracts pass.');
