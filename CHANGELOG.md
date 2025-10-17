# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-17

### Added
- Initial release of react-smart-fetch
- `useSmartFetch` hook for data fetching with caching
- Support for GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD HTTP methods
- Automatic response caching with configurable expiration time
- Loading, error, and data states management
- `refetch` function for manual data reloading
- TypeScript support with full type definitions
- Comprehensive test suite
- Memory-based cache manager
- Abort signal support for request cancellation
- Support for custom headers and request bodies

### Features
- **Smart Caching**: Responses are cached by URL + method + body combination
- **Type Safety**: Full TypeScript support with generic type parameters
- **Error Handling**: Comprehensive error handling for network and HTTP errors
- **Performance**: Automatic request deduplication and caching
- **Flexibility**: Support for all common HTTP methods and custom configurations
- **Memory Management**: Automatic cleanup of expired cache entries
- **React Integration**: Seamless integration with React lifecycle and hooks

### Development
- Complete build setup with Rollup
- ESLint and TypeScript configuration
- Jest testing framework with comprehensive test coverage
- Example usage files and documentation