// Service workers don't have access to DOM APIs, so we need to ensure
// our code only uses APIs available in service workers

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // We only accept messages from ourselves
  switch (message.type) {
    case 'REGISTER_FLAGS':
      // Store flags in local storage with window and tab ID as key
      chrome.storage.local.set({[`${sender.tab.windowId}_${sender.tab.id}`] : message.flags})
      break;
  
    case 'FLAG_UPDATED':
      // Send message to content script
      chrome.tabs.sendMessage(parseInt(message.tab, 10), message);

      // Update flag value in storage
      chrome.storage.local.get(`${message.win}_${message.tab}`, value => {
        let flags = value[`${message.win}_${message.tab}`];
        if (flags) {
          for (let fIdx = 0; fIdx < flags.length; fIdx++) {
            const flag = flags[fIdx];
            if (flag.key === message.key) {
              flag.value = message.value;
            }
          }
          chrome.storage.local.set({[`${message.win}_${message.tab}`] : flags})
        }
      })
      break;
  
    default:
      console.debug('Default case called in BG SVC', message, sender);
      break;
  }
  // Must return true for asynchronous response
  return true;
});

// Service worker setup - keep alive by handling install and activation events
chrome.runtime.onInstalled.addListener(() => {
  console.log('Feature Flags extension installed');
});

// Service workers need to handle the activate event
chrome.runtime.onStartup.addListener(() => {
  console.log('Feature Flags extension started');
});
