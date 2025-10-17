import { createCacheKey, normalizeOptions, shouldIncludeBody } from '../utils';

describe('Utils', () => {
  describe('createCacheKey', () => {
    it('should create consistent cache keys', () => {
      const url = '/api/users';
      const options = { method: 'GET' as const };
      
      const key1 = createCacheKey(url, options);
      const key2 = createCacheKey(url, options);
      
      expect(key1).toBe(key2);
    });

    it('should create different keys for different methods', () => {
      const url = '/api/users';
      const getKey = createCacheKey(url, { method: 'GET' });
      const postKey = createCacheKey(url, { method: 'POST' });
      
      expect(getKey).not.toBe(postKey);
    });

    it('should include body in cache key', () => {
      const url = '/api/users';
      const body1 = { name: 'John' };
      const body2 = { name: 'Jane' };
      
      const key1 = createCacheKey(url, { method: 'POST', body: body1 });
      const key2 = createCacheKey(url, { method: 'POST', body: body2 });
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('normalizeOptions', () => {
    it('should set default values', () => {
      const normalized = normalizeOptions();
      
      expect(normalized.method).toBe('GET');
      expect(normalized.body).toBe(null);
      expect(normalized.headers).toEqual({});
      expect(normalized.cacheTime).toBe(300000); // 5 minutes
    });

    it('should preserve provided values', () => {
      const options = {
        method: 'POST' as const,
        body: { name: 'Test' },
        headers: { 'Authorization': 'Bearer token' },
        cacheTime: 10000,
      };
      
      const normalized = normalizeOptions(options);
      
      expect(normalized).toEqual(options);
    });
  });

  describe('shouldIncludeBody', () => {
    it('should return true for methods that support body', () => {
      expect(shouldIncludeBody('POST')).toBe(true);
      expect(shouldIncludeBody('PUT')).toBe(true);
      expect(shouldIncludeBody('PATCH')).toBe(true);
    });

    it('should return false for methods that do not support body', () => {
      expect(shouldIncludeBody('GET')).toBe(false);
      expect(shouldIncludeBody('DELETE')).toBe(false);
      expect(shouldIncludeBody('HEAD')).toBe(false);
      expect(shouldIncludeBody('OPTIONS')).toBe(false);
    });
  });
});