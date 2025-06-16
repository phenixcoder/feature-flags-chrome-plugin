# Developing Chrome Plugin

This Chrome extension is built with TypeScript and Vite for modern development experience.

## Setup

1. Install dependencies:
```shell
npm install
```

## Development

### Source Code Structure
- `src/` - TypeScript source files
  - `background.ts` - Service worker background script
  - `content-script.ts` - Content script injected into web pages
  - `popup.ts` - Popup UI logic
  - `popup.html` - Popup UI template
  - `manifest.json` - Extension manifest
  - `types/` - TypeScript type definitions

### Build Commands

**Development build with watch mode:**
```shell
npm run dev
```

**Production build:**
```shell
npm run build
```

**Type checking:**
```shell
npm run type-check
```

### Loading the Extension

1. Build the extension: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` folder

## Packaging

Build and package the extension:

```shell
npm run build
npm run package
```

This creates `plugin.zip` ready for Chrome Web Store upload.

## Testing

### Local Testing with Test App

A test web application is provided in the `test-app/` directory to help you test the extension locally.

**Quick Test Setup:**

1. Build the extension:
```shell
npm run build
```

2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist/` folder

3. Start the test server:
```shell
cd test-app
node server.js
# Opens at http://localhost:8000
```

4. Open `http://localhost:8000` in Chrome and test the integration

The test app demonstrates both integration methods:
- Direct registration when extension is already loaded
- Race condition handling when page loads before extension

See `test-app/README.md` for detailed testing instructions.
