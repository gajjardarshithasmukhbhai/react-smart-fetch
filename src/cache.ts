import { CacheEntry, CacheManager } from './types';

class MemoryCacheManager implements CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  set<T>(key: string, data: T, cacheTime: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      cacheTime,
    };
    
    this.cache.set(key, entry);
  }

  clear(): void {
    this.cache.clear();
  }

  isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.cacheTime;
  }

  // Utility method to get cache size (for debugging)
  size(): number {
    return this.cache.size;
  }

  // Utility method to cleanup expired entries
  cleanup(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cacheManager = new MemoryCacheManager();