import { useState, useEffect, useCallback, useRef } from 'react';
import { SmartFetchOptions, SmartFetchResult, SmartFetchState } from './types';
import { cacheManager } from './cache';
import { createCacheKey, normalizeOptions, performFetch } from './utils';

export function useSmartFetch<T = any>(
  url: string,
  options: SmartFetchOptions = {}
): SmartFetchResult<T> {
  const [state, setState] = useState<SmartFetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  // Use refs to store current values for cleanup
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setState({ data: null, error: null, loading: false });
      return;
    }

    const normalizedOptions = normalizeOptions(options);
    const cacheKey = createCacheKey(url, normalizedOptions);

    // Check cache first
    const cachedEntry = cacheManager.get<T>(cacheKey);
    if (cachedEntry) {
      setState({
        data: cachedEntry.data,
        error: null,
        loading: false,
      });
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    setState((prev: SmartFetchState<T>) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await performFetch(url, {
        ...normalizedOptions,
        signal: abortControllerRef.current.signal,
      });

      // Check if component is still mounted before updating state
      if (isMountedRef.current) {
        // Cache the successful response
        cacheManager.set(cacheKey, data, normalizedOptions.cacheTime);

        setState({
          data,
          error: null,
          loading: false,
        });
      }
    } catch (error) {
      // Check if component is still mounted and error is not from abort
      if (isMountedRef.current && (error as Error).name !== 'AbortError') {
        setState({
          data: null,
          error: error as Error,
          loading: false,
        });
      }
    }
  }, [url, JSON.stringify(options)]);

  const refetch = useCallback(async () => {
    // Clear cache for this specific request before refetching
    const normalizedOptions = normalizeOptions(options);
    const cacheKey = createCacheKey(url, normalizedOptions);
    cacheManager.get(cacheKey) && cacheManager.clear();
    
    await fetchData();
  }, [fetchData, url, JSON.stringify(options)]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch,
  };
}