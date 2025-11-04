const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * Metro configuration
 * - Aliases the React Native debugger frontend on web to a no-op shim to avoid
 *   import.meta usage leaking into the bundle in dev.
 */
module.exports = (function () {
  const config = getDefaultConfig(__dirname);

  config.resolver = config.resolver || {};
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    '@react-native/debugger-frontend': path.resolve(__dirname, 'lib/shims/debugger-frontend.js'),
  };

  // Avoid experimental Hermes transform profile on web which can surface import.meta
  config.transformer = config.transformer || {};
  config.transformer.unstable_transformProfile = 'default';

  return config;
})();
