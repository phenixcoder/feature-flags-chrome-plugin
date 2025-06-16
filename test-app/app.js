// Feature Flags Test Application
// This demonstrates integration with the Feature Flags Chrome Extension

// Feature flags configuration
const featureFlags = [
  {
    key: 'dark-mode',
    value: false,
    title: 'Dark Mode',
    description: 'Toggle between light and dark themes'
  },
  {
    key: 'beta-ui',
    value: true,
    title: 'Beta UI Components', 
    description: 'Enable experimental user interface elements'
  },
  {
    key: 'analytics',
    value: false,
    title: 'Advanced Analytics',
    description: 'Enhanced tracking and reporting features'
  },
  {
    key: 'notifications',
    value: true,
    title: 'Push Notifications',
    description: 'Real-time browser notifications'
  }
];

// Application state
let extensionDetected = false;
let flagsRegistered = false;

// Logging utility
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry log-${type}`;
  logEntry.innerHTML = `[${timestamp}] ${message}`;
  
  const logsContainer = document.getElementById('logs');
  logsContainer.appendChild(logEntry);
  logsContainer.scrollTop = logsContainer.scrollHeight;
  
  console.log(`[FeatureFlags] ${message}`);
}

// Update extension status in UI
function updateExtensionStatus(detected) {
  extensionDetected = detected;
  const statusElement = document.getElementById('extension-status');
  
  if (detected) {
    statusElement.className = 'extension-status extension-detected';
    statusElement.innerHTML = '✅ Feature Flags Extension Detected';
    log('Extension detected successfully!', 'success');
  } else {
    statusElement.className = 'extension-status extension-not-detected';
    statusElement.innerHTML = '❌ Feature Flags Extension Not Detected';
    log('Extension not detected. Please install and enable the extension.', 'warning');
  }
}

// Update feature flag UI
function updateFeatureUI(key, value) {
  const featureElement = document.getElementById(`feature-${key}`);
  const statusElement = document.getElementById(`status-${key}`);
  
  if (featureElement && statusElement) {
    if (value) {
      featureElement.className = 'feature enabled';
      statusElement.className = 'status enabled';
      statusElement.textContent = 'ENABLED';
    } else {
      featureElement.className = 'feature disabled';
      statusElement.className = 'status disabled';
      statusElement.textContent = 'DISABLED';
    }
    
    log(`Feature "${key}" ${value ? 'enabled' : 'disabled'}`, value ? 'success' : 'warning');
  }
}

// Feature flag change listener
function onFeatureFlagChange(key, value) {
  log(`🔄 Flag changed: ${key} = ${value}`, 'info');
  updateFeatureUI(key, value);
  
  // Simulate feature implementation
  switch (key) {
    case 'dark-mode':
      if (value) {
        document.body.style.backgroundColor = '#2c3e50';
        document.body.style.color = '#ecf0f1';
        log('🌙 Dark mode activated', 'info');
      } else {
        document.body.style.backgroundColor = '#f5f5f5';
        document.body.style.color = '#333';
        log('☀️ Light mode activated', 'info');
      }
      break;
      
    case 'beta-ui':
      if (value) {
        log('🎨 Beta UI components loaded', 'info');
      } else {
        log('🎨 Using standard UI components', 'info');
      }
      break;
      
    case 'analytics':
      if (value) {
        log('📊 Advanced analytics enabled', 'info');
      } else {
        log('📊 Basic analytics only', 'info');
      }
      break;
      
    case 'notifications':
      if (value) {
        log('🔔 Push notifications enabled', 'info');
      } else {
        log('🔔 Push notifications disabled', 'info');
      }
      break;
  }
}

// Method 1: Direct registration (when extension loads after page)
function testDirectRegistration() {
  log('🧪 Testing direct registration method...', 'info');
  
  if (window.featureFlagsPluginRegister) {
    try {
      window.featureFlagsPluginRegister(featureFlags, onFeatureFlagChange);
      flagsRegistered = true;
      updateExtensionStatus(true);
      log('✅ Flags registered successfully via direct method', 'success');
      
      // Initialize UI with current flag values
      featureFlags.forEach(flag => {
        updateFeatureUI(flag.key, flag.value);
      });
    } catch (error) {
      log(`❌ Error registering flags: ${error.message}`, 'error');
    }
  } else {
    log('❌ featureFlagsPluginRegister not available. Extension may not be loaded.', 'error');
    updateExtensionStatus(false);
  }
}

// Method 2: Race condition handling (when page loads before extension)
function testRaceConditionMethod() {
  log('🧪 Testing race condition method...', 'info');
  
  // Set up the race condition handler
  window.registerMyFeatureFlags = function(register) {
    log('🎯 Race condition handler called by extension', 'success');
    try {
      register(featureFlags, onFeatureFlagChange);
      flagsRegistered = true;
      updateExtensionStatus(true);
      log('✅ Flags registered successfully via race condition method', 'success');
      
      // Initialize UI with current flag values
      featureFlags.forEach(flag => {
        updateFeatureUI(flag.key, flag.value);
      });
    } catch (error) {
      log(`❌ Error in race condition registration: ${error.message}`, 'error');
    }
  };
  
  log('📝 Race condition handler set up. Extension will call it when ready.', 'info');
}

// Clear logs
function clearLogs() {
  const logsContainer = document.getElementById('logs');
  logsContainer.innerHTML = '<div class="log-entry log-info">🧹 Logs cleared</div>';
}

// Initialize the application
function initializeApp() {
  log('🚀 Feature Flags Test App initialized', 'info');
  log('💡 Instructions:', 'info');
  log('1. Build and load the Feature Flags extension', 'info');
  log('2. Refresh this page', 'info');
  log('3. Click "Test Direct Registration" or wait for auto-registration', 'info');
  log('4. Open the extension popup to toggle flags', 'info');
  
  // Initialize UI with default flag values
  featureFlags.forEach(flag => {
    updateFeatureUI(flag.key, flag.value);
  });
  
  // Check if extension is already available
  setTimeout(() => {
    if (window.featureFlagsPluginRegister && !flagsRegistered) {
      log('🔍 Extension detected on page load', 'info');
      testDirectRegistration();
    } else if (!flagsRegistered) {
      log('⏳ Setting up race condition handler...', 'info');
      testRaceConditionMethod();
    }
  }, 1000);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
