import type { ExtensionMessage, FeatureFlag } from './types';

// Service workers don't have access to DOM APIs, so we need to ensure
// our code only uses APIs available in service workers

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): boolean => {
    // We only accept messages from ourselves
    switch (message.type) {
      case 'REGISTER_FLAGS':
        // Store flags in local storage with window and tab ID as key
        if (sender.tab?.windowId && sender.tab?.id) {
          const storageKey = `${sender.tab.windowId}_${sender.tab.id}`;
          chrome.storage.local.set({ [storageKey]: message.flags });
        }
        break;

      case 'FLAG_UPDATED':
        // Send message to content script
        const tabId = parseInt(message.tab, 10);
        if (!isNaN(tabId)) {
          chrome.tabs.sendMessage(tabId, message);
        }

        // Update flag value in storage
        const storageKey = `${message.win}_${message.tab}`;
        chrome.storage.local.get(storageKey, (result) => {
          const flags: FeatureFlag[] = result[storageKey];
          if (flags && Array.isArray(flags)) {
            for (let fIdx = 0; fIdx < flags.length; fIdx++) {
              const flag = flags[fIdx];
              if (flag.key === message.key) {
                flag.value = message.value;
                break;
              }
            }
            chrome.storage.local.set({ [storageKey]: flags });
          }
        });
        break;

      default:
        console.debug('Default case called in BG SVC', message, sender);
        break;
    }
    // Must return true for asynchronous response
    return true;
  }
);

// Service worker setup - keep alive by handling install and activation events
chrome.runtime.onInstalled.addListener(() => {
  console.log('Feature Flags extension installed');
});

// Service workers need to handle the activate event
chrome.runtime.onStartup.addListener(() => {
  console.log('Feature Flags extension started');
});
