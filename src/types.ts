export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface SmartFetchOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  cacheTime?: number;
}

export interface SmartFetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface SmartFetchResult<T> extends SmartFetchState<T> {
  refetch: () => Promise<void>;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  cacheTime: number;
}

export interface CacheManager {
  get<T>(key: string): CacheEntry<T> | null;
  set<T>(key: string, data: T, cacheTime: number): void;
  clear(): void;
  isExpired(entry: CacheEntry<any>): boolean;
}