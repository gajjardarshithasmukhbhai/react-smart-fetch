import { renderHook, waitFor } from '@testing-library/react';
import { useSmartFetch } from '../useSmartFetch';
import { cacheManager } from '../cache';

// Mock fetch globally
const mockFetch = jest.fn();
Object.defineProperty(window, 'fetch', {
  value: mockFetch,
  writable: true,
});

describe('useSmartFetch', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    cacheManager.clear();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test User' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() =>
      useSmartFetch('/api/users/1')
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() =>
      useSmartFetch('/api/users/1')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(expect.any(Error));
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should use cached data on second request', async () => {
    const mockData = { id: 1, name: 'Test User' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']]),
    });

    // First request
    const { result: result1 } = renderHook(() =>
      useSmartFetch('/api/users/1')
    );

    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
    });

    expect(result1.current.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second request should use cache
    const { result: result2 } = renderHook(() =>
      useSmartFetch('/api/users/1')
    );

    expect(result2.current.loading).toBe(false);
    expect(result2.current.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledTimes(1); // Still only 1 call
  });

  it('should support POST requests with body', async () => {
    const mockData = { id: 2, name: 'New User' };
    const requestBody = { name: 'New User', email: 'new@example.com' };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() =>
      useSmartFetch('/api/users', {
        method: 'POST',
        body: requestBody,
        headers: { 'Authorization': 'Bearer token' },
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
      },
      body: JSON.stringify(requestBody),
    });
  });

  it('should refetch data when refetch is called', async () => {
    const mockData1 = { id: 1, name: 'User 1' };
    const mockData2 = { id: 1, name: 'Updated User 1' };
    
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
        headers: new Map([['content-type', 'application/json']]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
        headers: new Map([['content-type', 'application/json']]),
      });

    const { result } = renderHook(() =>
      useSmartFetch('/api/users/1')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData1);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Call refetch
    await result.current.refetch();

    expect(result.current.data).toEqual(mockData2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should handle HTTP errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() =>
      useSmartFetch('/api/users/999')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(expect.any(Error));
    expect(result.current.error?.message).toBe('HTTP error! status: 404');
  });
});