let flagsContainer = document.getElementById('flags-container');

window.onload = function() {
  // Replace deprecated chrome.tabs.getSelected with chrome.tabs.query
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    chrome.storage.local.get(`${tab.windowId}_${tab.id}`, (value) => {
      flagsContainer.innerHTML = renderTable(value[`${tab.windowId}_${tab.id}`], tab.windowId, tab.id);
      bindEvents();
    });
  });
}

function bindEvents() {
  var checks = document.getElementsByClassName('checks');
  if (checks.length) {
    for (let cIdx = 0; cIdx < checks.length; cIdx++) {
      const check = checks[cIdx];
      if (check) {
        check.addEventListener('change', checkChanged)
      }
    }
  }
}

function checkChanged(event) {
  var check = event.target;
  chrome.runtime.sendMessage({
    type: 'FLAG_UPDATED',
    key: check.getAttribute('name'),
    tab: check.getAttribute('tabId'),
    win: check.getAttribute('windowId'),
    value: check.checked
  });
}

function renderTable(flags, winId, tabId) {
  if (!flags || !Array.isArray(flags)) {
    return `
      <p>No feature flags found for this page.</p>
      <p>See <a target="_blank" href="https://github.com/phenixcoder/feature-flags-chrome-plugin">documentation</a> for setup instructions.</p>
    `;
  }
  
  return `
    <table width="100%">
      ${flags.map(flag => `
      <tr>
        <td>
          <strong>${flag.title || flag.key}</strong><br />
          ${flag.description || ''}
        </td>
        <td valign="top">
          <input type="checkbox" id="${flag.key}" windowId="${winId}" tabId="${tabId}" class="checks" name="${flag.key}" ${flag.value ? 'checked' : ''} />
          <label for="${flag.key}">${flag.title || flag.key}</label>
        </td>
      </tr>
      `).join('')}
    </table>
  `;
}
