import { SmartFetchOptions, HttpMethod } from './types';

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function createCacheKey(url: string, options: SmartFetchOptions): string {
  const method = options.method || 'GET';
  const bodyString = options.body ? JSON.stringify(options.body) : '';
  const headersString = options.headers ? JSON.stringify(options.headers) : '';
  
  return `${method}:${url}:${bodyString}:${headersString}`;
}

export function normalizeOptions(options: SmartFetchOptions = {}): Required<SmartFetchOptions> {
  return {
    method: options.method || 'GET',
    body: options.body || null,
    headers: options.headers || {},
    cacheTime: options.cacheTime || DEFAULT_CACHE_TIME,
  };
}

export function shouldIncludeBody(method: HttpMethod): boolean {
  return ['POST', 'PUT', 'PATCH'].includes(method);
}

export async function performFetch(url: string, options: SmartFetchOptions & { signal?: AbortSignal }): Promise<any> {
  const normalizedOptions = normalizeOptions(options);
  
  const fetchOptions: RequestInit = {
    method: normalizedOptions.method,
    headers: {
      'Content-Type': 'application/json',
      ...normalizedOptions.headers,
    },
    signal: options.signal,
  };

  // Only include body for methods that support it
  if (shouldIncludeBody(normalizedOptions.method) && normalizedOptions.body) {
    fetchOptions.body = JSON.stringify(normalizedOptions.body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Handle different response types
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else if (contentType && contentType.includes('text/')) {
    return await response.text();
  } else {
    // For methods like DELETE that might not return content
    return response.status === 204 ? null : await response.text();
  }
}