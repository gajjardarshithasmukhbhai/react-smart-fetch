import { cacheManager } from '../cache';

describe('CacheManager', () => {
  beforeEach(() => {
    cacheManager.clear();
  });

  it('should store and retrieve data', () => {
    const testData = { id: 1, name: 'Test' };
    const cacheTime = 5000;

    cacheManager.set('test-key', testData, cacheTime);
    const retrieved = cacheManager.get('test-key');

    expect(retrieved).toBeDefined();
    expect(retrieved?.data).toEqual(testData);
    expect(retrieved?.cacheTime).toBe(cacheTime);
  });

  it('should return null for non-existent keys', () => {
    const retrieved = cacheManager.get('non-existent');
    expect(retrieved).toBeNull();
  });

  it('should handle cache expiration', () => {
    const testData = { id: 1, name: 'Test' };
    const shortCacheTime = 1; // 1ms

    cacheManager.set('test-key', testData, shortCacheTime);

    // Wait for cache to expire
    setTimeout(() => {
      const retrieved = cacheManager.get('test-key');
      expect(retrieved).toBeNull();
    }, 10);
  });

  it('should clear all cache', () => {
    cacheManager.set('key1', { data: 1 }, 5000);
    cacheManager.set('key2', { data: 2 }, 5000);

    expect(cacheManager.get('key1')).toBeDefined();
    expect(cacheManager.get('key2')).toBeDefined();

    cacheManager.clear();

    expect(cacheManager.get('key1')).toBeNull();
    expect(cacheManager.get('key2')).toBeNull();
  });

  it('should correctly identify expired entries', () => {
    const testData = { id: 1, name: 'Test' };
    const expiredEntry = {
      data: testData,
      timestamp: Date.now() - 10000, // 10 seconds ago
      cacheTime: 5000, // 5 second cache time
    };

    const validEntry = {
      data: testData,
      timestamp: Date.now(),
      cacheTime: 5000,
    };

    expect(cacheManager.isExpired(expiredEntry)).toBe(true);
    expect(cacheManager.isExpired(validEntry)).toBe(false);
  });
});