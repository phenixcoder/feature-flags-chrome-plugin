# 🧪 Feature Flags Extension Test Application

This is a test web application that demonstrates integration with the Feature Flags Chrome Extension. It shows both integration methods and provides visual feedback when flags are toggled.

## 🚀 Quick Start

### 1. Build and Load the Extension

First, make sure you have built the TypeScript extension:

```bash
# In the main project directory
npm run build
```

Then load the extension in Chrome:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select the `dist/` folder

### 2. Start the Test Server

Start the Node.js development server:

```bash
cd test-app
node server.js
# Or specify a custom port: node server.js 3000
```

**Alternative: Use any HTTP server**
```bash
cd test-app
# Python (if you prefer)
python3 -m http.server 8000

# PHP
php -S localhost:8000

# Live Server (VS Code extension)
# Right-click index.html -> "Open with Live Server"
```

### 3. Open the Test App

Navigate to `http://localhost:8000` in Chrome (or your chosen port).

## 🎯 How to Test

### Testing Scenario 1: Direct Registration
1. Load the test app in Chrome
2. Make sure the Feature Flags extension is loaded
3. Click "Test Direct Registration" button
4. You should see "Extension Detected" status
5. Open the extension popup (click the extension icon)
6. Toggle feature flags and watch the test app update in real-time

### Testing Scenario 2: Race Condition Handling
1. Load the test app in Chrome
2. Click "Test Race Condition Method" button
3. The app sets up a handler for when the extension loads
4. Refresh the page - the extension should automatically register the flags
5. Open the extension popup and toggle flags

### Testing Scenario 3: Extension Not Loaded
1. Disable the Feature Flags extension in `chrome://extensions/`
2. Refresh the test app
3. You should see "Extension Not Detected" status
4. The test buttons will show appropriate error messages

## 🔍 What to Look For

### Visual Indicators
- **Extension Status**: Green checkmark when detected, red X when not
- **Feature Boxes**: Change color (green/red) and status when toggled
- **Real-time Logs**: Show all extension communication and flag changes
- **UI Changes**: Dark mode actually changes the page appearance

### Console Output
Open Chrome DevTools (F12) and check the Console tab for:
- Extension registration messages
- Flag change notifications
- Any error messages

### Extension Popup
The extension popup should show:
- All 4 test feature flags
- Current on/off state for each flag
- Ability to toggle each flag

## 🚩 Test Features

The test app includes these feature flags:

1. **🌙 Dark Mode** (default: OFF)
   - Toggles page background between light and dark
   - Visual change is immediate when toggled

2. **🎨 Beta UI Components** (default: ON)
   - Simulated feature for testing
   - Logs activation status

3. **📊 Advanced Analytics** (default: OFF)
   - Simulated feature for testing
   - Logs activation status

4. **🔔 Push Notifications** (default: ON)
   - Simulated feature for testing
   - Logs activation status

## 🐛 Troubleshooting

### Extension Not Detected
- Verify the extension is built: `npm run build` in main directory
- Check that extension is loaded and enabled in `chrome://extensions/`
- Refresh the test page after loading the extension
- Check browser console for any error messages

### Flags Not Updating
- Make sure you clicked "Test Direct Registration" or set up race condition handling
- Check that the extension popup shows the same flags as the test app
- Verify there are no JavaScript errors in the console
- Try refreshing the page and re-registering

### Server Issues
- Make sure the port isn't already in use
- Try a different port: `node server.js 3001`
- Check firewall settings if accessing from another device

## 📝 Integration Examples

The test app demonstrates both integration patterns from the main README:

### Pattern 1: Direct Registration
```javascript
if (window.featureFlagsPluginRegister) {
  window.featureFlagsPluginRegister(flags, listener);
}
```

### Pattern 2: Race Condition Handling
```javascript
window.registerMyFeatureFlags = (register) => {
  register(flags, listener);
};
```

## 🔧 Customization

You can modify `app.js` to:
- Add more feature flags
- Change default flag values
- Implement different visual effects
- Test different integration scenarios

The feature flags array in `app.js` follows this format:
```javascript
{
  key: 'unique-flag-name',
  value: true/false,  // default state
  title: 'Display Name',
  description: 'What this flag does'
}
```
