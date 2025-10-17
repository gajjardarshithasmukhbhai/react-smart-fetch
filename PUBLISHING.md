# Publishing Guide for react-smart-fetch

## Pre-Publishing Checklist

Before publishing to npm, ensure:

1. ✅ **Package is built**: Run `npm run build`
2. ✅ **Tests pass**: Run `npm test`
3. ✅ **Version is correct**: Update version in `package.json`
4. ✅ **README is complete**: Documentation is up to date
5. ✅ **License is set**: MIT license included

## Build and Test

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Check for linting issues
npm run lint
```

## Publishing Steps

### 1. Login to npm (first time only)

```bash
npm login
```

### 2. Publish to npm

```bash
# For first release
npm publish

# For scoped package (if needed)
npm publish --access public
```

### 3. Verify publication

```bash
npm view react-smart-fetch
```

## Testing the Published Package

After publishing, you can test the package in a new project:

```bash
# Create a new React project
npx create-react-app test-react-smart-fetch
cd test-react-smart-fetch

# Install your package
npm install react-smart-fetch

# Test import in a component
```

## Version Management

Update version before publishing:

```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

## Package Information

- **Name**: react-smart-fetch
- **Type**: React Hook Library
- **Bundle Size**: ~8KB (minified)
- **Dependencies**: None (React as peer dependency)
- **TypeScript**: Full support included

## Features Included in v1.0.0

- ✅ `useSmartFetch` hook
- ✅ Support for all HTTP methods
- ✅ Automatic caching with configurable expiration
- ✅ Loading, error, and data states
- ✅ Manual refetch functionality
- ✅ TypeScript definitions
- ✅ Comprehensive test suite
- ✅ ESLint configuration
- ✅ Rollup build setup
- ✅ Examples and documentation

## Future Enhancements (v2.0.0+)

- [ ] Request deduplication
- [ ] Background refetching
- [ ] Optimistic updates
- [ ] SSR support
- [ ] Query keys for advanced caching
- [ ] Infinite queries
- [ ] Mutation hooks