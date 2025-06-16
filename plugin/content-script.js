;(function() {
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (event) {
    var injected = document.documentElement.appendChild(document.createElement('script'));
    injected.text = '(' + function(key, value) {
      if(window.featureFlagsPluginConfig && window.featureFlagsPluginConfig.listener) {
        window.featureFlagsPluginConfig.listener(key, value)
      }
    } + `)('${event.key}', ${event.value})`;
    injected.remove();
  });

  // Listen for messages from the page
  window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
      return;
    
    if (event.data.type && (event.data.type == "REGISTER_FLAGS")) {
      chrome.runtime.sendMessage(event.data);
    }
  }, false);

  // Function to inject into the page
  function script() {
    window.featureFlagsPluginConfig = {
      listener: () => {},
    }
    function featureFlagsPluginRegister(flags, listener) {
      console.debug('Register Called with', flags, listener);
      window.postMessage({ type: "REGISTER_FLAGS", flags: flags }, "*");
      window.featureFlagsPluginConfig.listener = listener;
    }
    window.featureFlagsPluginRegister = featureFlagsPluginRegister;
    console.info('featureFlagsPluginRegister Registered :)');

    if(window.registerMyFeatureFlags) {
      window.registerMyFeatureFlags(featureFlagsPluginRegister);
    }
  }

  // Inject the script into the page
  function inject(fn) {
    const script = document.createElement('script')
    script.text = `(${fn.toString()})();`
    document.documentElement.appendChild(script)
  }

  inject(script)
})()
