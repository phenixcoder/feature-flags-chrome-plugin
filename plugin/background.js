chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // We only accept messages from ourselves
  switch (message.type) {
    case 'REGISTER_FLAGS':
        chrome.storage.local.set({[`${sender.tab.windowId}_${sender.tab.id}`] : message.flags})
      break;
  
    case 'FLAG_UPDATED':
      chrome.tabs.sendMessage(parseInt(message.tab, 10), message);

      chrome.storage.local.get(`${message.win}_${message.tab}`, value => {
        let flags = value[`${message.win}_${message.tab}`];
        for (let fIdx = 0; fIdx < flags.length; fIdx++) {
          const flag = flags[fIdx];
          if (flag.key === message.key) {
            flag.value = message.value;
          }
        }
        chrome.storage.local.set({[`${message.win}_${message.tab}`] : flags})
      })
      break;
  
    default:
      console.debug('Default case called in BG SVC', message, sender);
      break;
  }
  return true;
});