# React Smart Fetch 

A simple React hook for smart API fetching with automatic caching support.

## Features

- 🚀 **Simple API**: Easy to use React hook
- 📦 **Smart Caching**: Automatic response caching with configurable expiration
- 🔄 **Multiple HTTP Methods**: Support for GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
- ⚡ **Loading States**: Built-in loading, error, and data states
- 🔁 **Manual Refetch**: Refetch function to reload data on demand
- 📱 **TypeScript Support**: Full TypeScript support with type safety
- 🎯 **Lightweight**: Minimal bundle size with zero dependencies

## Installation

```bash
npm install react-smart-fetch
```

or

```bash
yarn add react-smart-fetch
```

## Quick Start

```tsx
import { useSmartFetch } from 'react-smart-fetch';

function UserProfile({ userId }) {
  const { data, error, loading, refetch } = useSmartFetch(`/api/users/${userId}`, {
    method: 'GET',
    cacheTime: 300000, // Cache for 5 minutes
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## API Reference

### `useSmartFetch(url, options?)`

#### Parameters

- `url` (string): The API endpoint URL
- `options` (object, optional): Configuration options
  - `method` (string): HTTP method - GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD (default: 'GET')
  - `body` (any): Request body for POST, PUT, PATCH methods
  - `headers` (object): Custom headers
  - `cacheTime` (number): Cache expiration time in milliseconds (default: 5 minutes)

#### Returns

- `data`: The response data (null initially)
- `error`: Error object if request fails (null initially)
- `loading`: Loading state boolean
- `refetch`: Function to manually refetch the data

## Examples

### GET Request with Caching

```tsx
const { data, loading, error } = useSmartFetch('/api/posts', {
  cacheTime: 600000, // 10 minutes cache
});
```

### POST Request

```tsx
const { data, loading, error, refetch } = useSmartFetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    title: 'New Post',
    content: 'Post content...',
  },
});
```

### PUT Request

```tsx
const { data, loading, error } = useSmartFetch(`/api/posts/${postId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: updatedPost,
});
```

### DELETE Request

```tsx
const { data, loading, error } = useSmartFetch(`/api/posts/${postId}`, {
  method: 'DELETE',
});
```

### Custom Headers

```tsx
const { data, loading, error } = useSmartFetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

## Caching Behavior

- Responses are cached by URL + method + body combination
- Cache is stored in memory and cleared on page refresh
- Cached responses are returned immediately while a background request validates the cache
- Cache expiration is configurable per request
- Default cache time is 5 minutes (300000ms)

## TypeScript Support

The package includes full TypeScript support:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const { data, loading, error } = useSmartFetch<User>('/api/user/1');
// data is typed as User | null
```

## Author

**Darshit Gajjar**  
GitHub: [gajjardarshithasmukhbhai](https://github.com/gajjardarshithasmukhbhai)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request to the [GitHub repository](https://github.com/gajjardarshithasmukhbhai/react-smart-fetch).


## Visit Our Website
