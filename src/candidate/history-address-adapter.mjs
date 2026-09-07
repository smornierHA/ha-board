const VALID_KINDS = new Set(['recorded', 'reverse-geocoded']);

function finiteCoordinate(value, min, max) {
  if (value == null || value === '' || typeof value === 'boolean') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

function normalizedPoint(point) {
  const latitude = finiteCoordinate(point?.latitude, -90, 90);
  const longitude = finiteCoordinate(point?.longitude, -180, 180);
  const timestamp = Date.parse(String(point?.timestamp || ''));
  const entity = String(point?.entity || '').trim();
  if (!entity || latitude == null || longitude == null || !Number.isFinite(timestamp)) {
    throw new TypeError('Historical point requires entity, coordinates and an ISO timestamp.');
  }
  return { entity, latitude, longitude, timestamp };
}

function normalizedResult(result) {
  if (result == null) return null;
  const address = String(result.address || '').trim();
  if (!address || !VALID_KINDS.has(result.kind)) {
    throw new TypeError('Historical address result requires an address and an explicit provenance kind.');
  }
  return { address, kind: result.kind };
}

export class HistoricalAddressAdapter {
  constructor({ resolve, maxEntries = 64 } = {}) {
    this.configure({ resolve, maxEntries });
  }

  configure({ resolve, maxEntries = this.maxEntries || 64 } = {}) {
    if (typeof resolve !== 'function') throw new TypeError('A historical address resolver is required.');
    if (!Number.isInteger(maxEntries) || maxEntries < 1 || maxEntries > 512) {
      throw new RangeError('maxEntries must be an integer from 1 to 512.');
    }
    this.cancel();
    this.resolveAddress = resolve;
    this.maxEntries = maxEntries;
    this.cache = new Map();
    this.inflight = new Map();
    this.generation = (this.generation || 0) + 1;
    this.detached = false;
  }

  key(point) {
    return [point.entity, point.timestamp, point.latitude.toFixed(5), point.longitude.toFixed(5)].join('|');
  }

  async lookup(input) {
    if (this.detached) return null;
    const point = normalizedPoint(input);
    const key = this.key(point);
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached;
    }
    if (this.inflight.has(key)) return this.inflight.get(key).promise;

    const controller = new AbortController();
    const generation = this.generation;
    const promise = Promise.resolve()
      .then(() => this.resolveAddress({ ...point, timestamp: new Date(point.timestamp).toISOString() }, { signal: controller.signal }))
      .then(normalizedResult)
      .then((result) => {
        if (controller.signal.aborted || this.detached || generation !== this.generation) return null;
        this.cache.set(key, result);
        while (this.cache.size > this.maxEntries) this.cache.delete(this.cache.keys().next().value);
        return result;
      })
      .catch((error) => {
        if (controller.signal.aborted || this.detached || generation !== this.generation) return null;
        throw error;
      })
      .finally(() => {
        if (this.inflight.get(key)?.promise === promise) this.inflight.delete(key);
      });
    this.inflight.set(key, { controller, promise });
    return promise;
  }

  cancel() {
    for (const { controller } of this.inflight?.values?.() || []) controller.abort();
    this.inflight?.clear?.();
    this.generation = (this.generation || 0) + 1;
  }

  detach() {
    this.detached = true;
    this.cancel();
  }
}
