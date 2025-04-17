class Cache {
  constructor(maxAge = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const age = Date.now() - item.timestamp;
    if (age > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  // Clear expired items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Create instances with different cache durations
export const shortCache = new Cache(5 * 60 * 1000); // 5 minutes
export const mediumCache = new Cache(30 * 60 * 1000); // 30 minutes
export const longCache = new Cache(24 * 60 * 60 * 1000); // 24 hours

// Utility function to wrap API calls with caching
export async function withCache(key, callback, cache = shortCache) {
  // Try to get from cache first
  const cachedData = cache.get(key);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, call the callback
  const data = await callback();
  cache.set(key, data);
  return data;
} 