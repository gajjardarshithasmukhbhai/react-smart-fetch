// Demo file to test the react-smart-fetch package
import { useSmartFetch, cacheManager } from './dist/index.esm.js';

// Simple test to verify the package exports work
console.log('useSmartFetch:', typeof useSmartFetch);
console.log('cacheManager:', typeof cacheManager);

// Test cache manager
cacheManager.set('test-key', { message: 'Hello World!' }, 5000);
const cached = cacheManager.get('test-key');
console.log('Cached data:', cached);

console.log('✅ Package exports are working correctly!');