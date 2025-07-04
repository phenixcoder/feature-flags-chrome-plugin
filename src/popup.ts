import type { FeatureFlag, FlagChangeEvent, StorageData } from './types';

const flagsContainer = document.getElementById('flags-container') as HTMLElement;

window.onload = function (): void {
  // Replace deprecated chrome.tabs.getSelected with chrome.tabs.query
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs: chrome.tabs.Tab[]): void => {
      const tab = tabs[0];
      if (!tab.windowId || !tab.id) {
        console.error('Unable to get tab information');
        return;
      }

      const storageKey = `${tab.windowId}_${tab.id}`;
      chrome.storage.local.get(storageKey, (result: StorageData): void => {
        const flags = result[storageKey];
        flagsContainer.innerHTML = renderTable(flags, tab.windowId!, tab.id!);
        bindEvents();
      });
    }
  );
};

function bindEvents(): void {
  const checks = document.getElementsByClassName('checks') as HTMLCollectionOf<HTMLInputElement>;
  
  if (checks.length) {
    for (let cIdx = 0; cIdx < checks.length; cIdx++) {
      const check = checks[cIdx];
      if (check) {
        check.addEventListener('change', checkChanged);
      }
    }
  }
}

function checkChanged(event: Event): void {
  const check = event.target as HTMLInputElement & {
    getAttribute(name: 'name' | 'tabId' | 'windowId'): string;
  };
  
  const key = check.getAttribute('name');
  const tabId = check.getAttribute('tabId');
  const windowId = check.getAttribute('windowId');
  
  if (!key || !tabId || !windowId) {
    console.error('Missing required attributes on checkbox');
    return;
  }

  chrome.runtime.sendMessage({
    type: 'FLAG_UPDATED',
    key,
    tab: tabId,
    win: windowId,
    value: check.checked,
  });
}

function renderTable(
  flags: FeatureFlag[] | undefined,
  winId: number,
  tabId: number
): string {
  if (!flags || !Array.isArray(flags)) {
    return `
      <p>No feature flags found for this page.</p>
      <p>See <a target="_blank" href="https://github.com/phenixcoder/feature-flags-chrome-plugin">documentation</a> for setup instructions.</p>
    `;
  }

  return `
    <table width="100%">
      ${flags
        .map(
          (flag: FeatureFlag) => `
      <tr>
        <td>
          <strong>${escapeHtml(flag.title || flag.key)}</strong><br />
          ${escapeHtml(flag.description || '')}
        </td>
        <td valign="top">
          <input 
            type="checkbox" 
            id="${escapeHtml(flag.key)}" 
            windowId="${winId}" 
            tabId="${tabId}" 
            class="checks" 
            name="${escapeHtml(flag.key)}" 
            ${flag.value ? 'checked' : ''} 
          />
          <label for="${escapeHtml(flag.key)}">${escapeHtml(flag.title || flag.key)}</label>
        </td>
      </tr>
      `
        )
        .join('')}
    </table>
  `;
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
