;(function() {

  chrome.runtime.onMessage.addListener(function (event) {
    var injected = document.documentElement.appendChild(document.createElement('script'));
    injected.text = '(' + function(key, value) {
      if(window.featureFlagsPluginConfig && window.featureFlagsPluginConfig.listener) {
        window.featureFlagsPluginConfig.listener(key, value)
      }
    } + `)('${event.key}', ${event.value})`;
    injected.remove();
  })

  window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
    return;
    
    if (event.data.type && (event.data.type == "REGISTER_FLAGS")) {
      chrome.runtime.sendMessage(event.data);
    }
  }, false);

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
      window.addEventListener('message', event => {

      });
      console.info('featureFlagsPluginRegister Registered :)');
    }
  
    function inject(fn) {
      const script = document.createElement('script')
      script.text = `(${fn.toString()})();`
      document.documentElement.appendChild(script)
    }
  
    inject(script)
  })()