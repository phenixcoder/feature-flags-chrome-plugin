// Injected script that runs in the page context
// This avoids CSP issues by being loaded as a separate file

(function() {
  'use strict';
  
  // Initialize the feature flags plugin configuration
  window.featureFlagsPluginConfig = {
    listener: function() {}
  };

  // Listen for flag updates from the content script
  window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    
    if (event.data && 
        event.data.type === 'FEATURE_FLAG_UPDATED' && 
        event.data.source === 'feature-flags-extension') {
      
      if (window.featureFlagsPluginConfig && 
          window.featureFlagsPluginConfig.listener) {
        window.featureFlagsPluginConfig.listener(event.data.key, event.data.value);
      }
    }
  }, false);

  // Main registration function for web apps
  function featureFlagsPluginRegister(flags, listener) {
    console.debug('Register Called with', flags, listener);
    
    // Store the listener
    if (window.featureFlagsPluginConfig) {
      window.featureFlagsPluginConfig.listener = listener;
    }
    
    // Send registration message to content script
    window.postMessage({ 
      type: 'REGISTER_FLAGS', 
      flags: flags 
    }, '*');
  }

  // Expose the registration function globally
  window.featureFlagsPluginRegister = featureFlagsPluginRegister;
  console.info('featureFlagsPluginRegister Registered :)');

  // Handle race condition - call registerMyFeatureFlags if it exists
  if (window.registerMyFeatureFlags) {
    window.registerMyFeatureFlags(featureFlagsPluginRegister);
  }
})();
