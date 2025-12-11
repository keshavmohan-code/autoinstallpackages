# Example configuration file for @nykaa/sync-packages
# Copy this to sync-packages.config.js in your home directory or project root

module.exports = {
  // Path to fe-core repository
  feCorePath: '/Users/yourname/Documents/nykaa/fe-core',
  
  // Path to nykaa_web_reloaded repository  
  webReloadedPath: '/Users/yourname/Documents/nykaa/nykaa_web_reloaded',
  
  // Optional: Specific packages to sync (if not specified, syncs all)
  // packages: ['auth', 'product', 'cart-shared']
};
