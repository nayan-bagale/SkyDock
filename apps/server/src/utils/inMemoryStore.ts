import { OTP_EXPIRATION_TIME } from "../constants";

type CacheValue = {
  value: any;
  expiresAt: number;
};

const store = new Map<string, CacheValue>();

/**
 * Sets a key-value pair in the in-memory store with expiration.
 * @param key The key to store.
 * @param value The value to store.
 * @param ttl Time-to-live in milliseconds.
 */
function set(key: string, value: any, ttl: number = OTP_EXPIRATION_TIME): void {
  const expiresAt = Date.now() + ttl;
  store.set(key, { value, expiresAt });
}

/**
 * Gets the value for a given key if not expired.
 * @param key The key to retrieve.
 * @returns The value or null if expired/not found.
 */
function get<T = any>(key: string): T | null {
  const cached = store.get(key);

  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    store.delete(key); // auto cleanup
    return null;
  }

  return cached.value as T;
}

/**
 * Deletes a key from the store.
 * @param key The key to delete.
 */
function del(key: string): void {
  store.delete(key);
}

/**
 * Clears the entire store.
 */
function clear(): void {
  store.clear();
}

/**
 * Checks if a key exists and is not expired.
 * @param key The key to check.
 * @returns True if exists and not expired.
 */
function has(key: string): boolean {
  const cached = store.get(key);

  if (!cached) return false;

  if (Date.now() > cached.expiresAt) {
    store.delete(key);
    return false;
  }

  return true;
}

export default {
  set,
  get,
  del,
  has,
  clear,
};
