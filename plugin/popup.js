let flagsContainer = document.getElementById('flags-container');

window.onload = function() {
  chrome.tabs.getSelected(null,function(tab) {
    chrome.storage.local.get(`${tab.windowId}_${tab.id}`, (value) => {
      flagsContainer.innerHTML = renderTable(value[`${tab.windowId}_${tab.id}`], tab.windowId, tab.id);
      bindEvents();
    })
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
  })
  
}

function renderTable(flags, winId, tabId) {
  return `
    <table width="100%">
      ${flags.map(flag => `
      <tr>
        <td>
          <strong>${flag.title}</strong><br />
          ${flag.description}
        </td>
        <td valign="top">
          <input type="checkbox" id="${flag.key}" windowId="${winId}" tabId="${tabId}" class="checks" name="${flag.key}" ${flag.value ? 'checked' : ''} />
          <label for="${flag.key}">${flag.title}</label>
        </td>
      </tr>
      `).join('')}
    </table>
  `;
  
}