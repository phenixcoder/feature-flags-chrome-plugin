import type { ExtensionMessage } from './types';

// Content script wrapped in IIFE to avoid global scope pollution
(function (): void {
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((event: ExtensionMessage): void => {
    if (event.type === 'FLAG_UPDATED') {
      // Use postMessage instead of script injection to avoid CSP issues
      window.postMessage({
        type: 'FEATURE_FLAG_UPDATED',
        key: event.key,
        value: event.value,
        source: 'feature-flags-extension'
      }, '*');
    }
  });

  // Listen for messages from the page
  window.addEventListener(
    'message',
    (event: MessageEvent): void => {
      // We only accept messages from ourselves
      if (event.source !== window) return;

      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === 'REGISTER_FLAGS'
      ) {
        chrome.runtime.sendMessage(event.data as ExtensionMessage);
      }
    },
    false
  );

  // Create a script file and inject it to avoid CSP issues
  function injectPageScript(): void {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected-script.js');
    script.onload = function() {
      script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // Initialize the injection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPageScript);
  } else {
    injectPageScript();
  }
})();
