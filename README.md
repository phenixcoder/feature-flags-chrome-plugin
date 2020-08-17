# Feature Flag Chrome Plugin

Chrome Plugin to manage Feature Flags on any supported web app.

[![Chrome Web Store Link](ChromeWebStore_Badge_v2_496x150.png)](https://chrome.google.com/webstore/detail/feature-flags/hmflgmhoghcbmckbbgahfmklegllkggn)

---

## Adding Feature Flag Support to your web app

To enable chrome plugins on your web app you need to register your feature flags from your app code.

To register, call the `featureFlagsPluginRegister` function on your window object.

```javascript
function featureFlagsPluginRegister(flags, listener);
```

Example:

```javascript
// Somewhere in you app's JS code

// Declare Flags
const flags = [
  {
    key: 'flag.one'
    value: true, // current / initial state of feature flags in you app.
    description: 'First feature description', // Optional
    title: 'First feature', // Optional - If not passed, key will be used.
  },
  {
    key: 'flag.two'
    value: true, // current / initial state of feature flags in you app.
    description: 'Second feature description', // Optional
    title: 'Second feature', // Optional - If not passed, key will be used.
  }
];

// This function will be called whenever a change happens in Chrome extension
function listener(key, value) {
    // Feature flag with key change and update value is in value.

    // Make your changes in your app
    toggleFeatureFlag(key, value);
    updateApp();
}


// Register Feature Flags with plugin
if (window.featureFlagsPluginRegister) {
  window.featureFlagsPluginRegister(flags, listener);
}
```

---

### Testing Snippet

```javascript
window.featureFlagsPluginRegister(
  [
    {
      key: 'flag.one',
      value: true,
      description: 'First feature description',
      title: 'First feature',
    },
    {
      key: 'flag.two',
      value: true,
      description: 'Second feature description',
      title: 'Second feature',
    },
  ],
  (key, value) => console.log('KV Received', key, value)
);
```
