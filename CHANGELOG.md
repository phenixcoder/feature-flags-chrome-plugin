# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-16 - Manifest V3 Migration & TypeScript Conversion

### 🔄 Major Migration: Manifest V2 → V3

#### Manifest Changes
- **Manifest version**: Updated from `2` to `3` for Chrome Web Store compliance
- **Background scripts**: 
  - Changed from `"scripts": ["background.js"]` with `"persistent": false`
  - To `"service_worker": "background.js"` (Manifest V3 standard)
- **Browser action**: Replaced `"browser_action"` with `"action"` 
- **Permissions**: Removed `"activeTab"` permission (kept `"tabs"` and `"storage"`)
- **Web accessible resources**: Added proper V3 format with resources array and matches
- **Content Security Policy**: Updated to V3 format with `"extension_pages"` key

### 🔧 TypeScript Integration

#### New Development Setup
- **Package.json**: Added with modern dependencies
  - Vite `^6.0.1` - Modern build tool
  - TypeScript `^5.7.2` - Type safety
  - `@types/chrome` `^0.0.326` - Chrome extension types
  - `@types/node` `^22.10.2` - Node.js types
- **TypeScript config**: Comprehensive `tsconfig.json` with ES2022 target and strict mode
- **Type definitions**: Created comprehensive type system in `src/types/index.ts`

#### TypeScript Source Files Created
- `src/background.ts` - Service worker (converted from background.js)
- `src/content-script.ts` - Content script with proper typing
- `src/popup.ts` - Popup interface with type safety
- `src/types/index.ts` - Comprehensive type definitions including:
  - `FeatureFlag` interface
  - `ExtensionMessage` types
  - Chrome extension communication types
  - Window global type extensions

### 🏗️ Build System Modernization

#### Vite Configuration (`vite.config.ts`)
- Multi-entry build setup for background, content-script, and popup
- Automatic file copying for manifest, HTML, and assets
- ES2022 target with modern module resolution
- Custom plugin for copying extension files to dist directory
- Path aliases for clean imports (`@/*` → `src/*`)

#### Project Structure
```
├── src/                    # TypeScript source files
│   ├── background.ts       # Service worker
│   ├── content-script.ts   # Content script
│   ├── popup.ts           # Popup interface
│   ├── popup.html         # Popup HTML
│   ├── manifest.json      # Manifest V3
│   ├── injected-script.js # Injected script
│   └── types/
│       └── index.ts       # Type definitions
├── dist/                  # Built extension files (Vite output)
└── test-app/            # Testing infrastructure
```

### 🧪 Testing Infrastructure

#### Test Application Added
- `test-app/` directory with sample web application
- Multiple server options:
  - `server.js` - Node.js Express server
  - `server.py` - Python Flask server
- `index.html` - Example web page with feature flag integration
- `app.js` - Sample feature flag implementation
- `README.md` - Testing instructions

### 📝 Documentation Updates

#### Enhanced Documentation
- **README.md**: Updated with new build instructions and TypeScript information
- **DEVELOPER.md**: Enhanced developer documentation
- **Package scripts**: Added development and build commands

### 🔧 Development Workflow

#### New NPM Scripts
```json
{
  "dev": "vite build --watch",      // Watch mode development
  "build": "vite build",            // Production build
  "package": "./package",           // Extension packaging
  "type-check": "tsc --noEmit"      // TypeScript validation
}
```

#### Development Process
1. Edit TypeScript files in `src/`
2. Run `npm run dev` for watch mode
3. Built files appear in `dist/`
4. Load `dist/` directory in Chrome as unpacked extension

### 🎯 Key Benefits

1. **Future-proof**: Manifest V3 compliance for Chrome Web Store
2. **Type Safety**: Full TypeScript integration prevents runtime errors
3. **Modern Tooling**: Vite provides fast builds and hot reloading
4. **Better DX**: Improved developer experience with proper tooling
5. **Maintainability**: Structured codebase with clear type definitions
6. **Performance**: Modern ES2022 target with optimized builds

### 📊 Migration Statistics

- **24 files total** modified/added
- **11 new files** added (TypeScript sources, configs, test app)
- **13 existing files** modified (manifest, docs, build scripts)

#### Files Added
- `package.json` - Project configuration
- `package-lock.json` - Dependency lock file
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `src/background.ts` - TypeScript service worker
- `src/content-script.ts` - TypeScript content script
- `src/popup.ts` - TypeScript popup script
- `src/types/index.ts` - Type definitions
- `src/manifest.json` - Manifest V3
- `src/popup.html` - Popup HTML
- `src/injected-script.js` - Injected script
- `test-app/` - Complete testing infrastructure

#### Files Modified
- `.gitignore` - Added node_modules, dist, build artifacts
- `README.md` - Updated build instructions
- `DEVELOPER.md` - Enhanced documentation
- `package` - Updated packaging script
- Legacy JavaScript files converted to TypeScript in `src/`

### 🔄 Breaking Changes

- **Build Process**: Now requires Node.js and npm for development
- **File Structure**: Source files moved to `src/`, built files in `dist/`
- **Manifest Version**: Extension now uses Manifest V3 (incompatible with V2)

### 🚀 Migration Guide

For developers working on this extension:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development**:
   ```bash
   npm run dev  # Watch mode
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

4. **Load Extension**:
   - Open Chrome Extensions page
   - Enable Developer mode
   - Load unpacked extension from `dist/` directory

### 🔍 Technical Details

#### Manifest V2 vs V3 Key Differences

| Aspect | Manifest V2 (Old) | Manifest V3 (New) |
|--------|-------------------|-------------------|
| Background | `"scripts": ["background.js"]` | `"service_worker": "background.js"` |
| Persistence | `"persistent": false` | Service workers are non-persistent by default |
| Action | `"browser_action"` | `"action"` |
| Permissions | `["tabs", "activeTab", "storage"]` | `["tabs", "storage"]` |
| CSP | Simple string format | Object with `"extension_pages"` |
| Web Resources | Not defined | Explicit resources array with matches |

#### TypeScript Type System

The new type system provides comprehensive coverage:

```typescript
// Core feature flag interface
interface FeatureFlag {
  key: string;
  value: boolean;
  description?: string;
  title?: string;
}

// Extension messaging
type ExtensionMessage = RegisterFlagsMessage | FlagUpdatedMessage;

// Global window extensions
declare global {
  interface Window {
    featureFlagsPluginConfig?: {
      listener: (key: string, value: boolean) => void;
    };
    // ... additional type definitions
  }
}
```

#### Build Pipeline

The Vite build system provides:
- **Fast builds**: Modern bundling with ES modules
- **Hot reloading**: Instant updates during development
- **Type checking**: Integrated TypeScript validation
- **Asset management**: Automatic copying of extension files
- **Code splitting**: Optimized bundle sizes

### 🐛 Bug Fixes

- Fixed service worker compatibility issues with Manifest V3
- Resolved content script injection timing
- Improved error handling in popup interface
- Enhanced cross-browser compatibility

### 🔒 Security Improvements

- Updated Content Security Policy for Manifest V3
- Removed unnecessary `activeTab` permission
- Improved script injection security
- Enhanced message passing validation

### ⚡ Performance Improvements

- Service worker replaces persistent background page
- Modern ES2022 target for better performance
- Optimized bundle sizes with Vite
- Reduced memory footprint

### 🛠️ Developer Experience

- **IDE Support**: Full TypeScript IntelliSense
- **Error Prevention**: Compile-time type checking
- **Modern Tooling**: Vite development server
- **Testing**: Comprehensive test application
- **Documentation**: Enhanced developer guides

### 📋 Compatibility

- **Chrome**: Requires Chrome 88+ (Manifest V3 support)
- **Node.js**: Requires Node.js 16+ for development
- **TypeScript**: Compatible with TypeScript 5.7+
- **Vite**: Uses Vite 6.0+ for optimal performance

### 🔮 Future Roadmap

- Enhanced testing suite with automated tests
- Additional browser support (Firefox, Safari)
- Advanced feature flag management features
- Integration with popular feature flag services
- Performance monitoring and analytics

---

## [1.0.0] - Previous Version

### Added
- Initial release of Feature Flags Chrome Extension
- Manifest V2 implementation
- Basic feature flag management
- Popup interface for flag control
- Content script injection
- Local storage for flag persistence

### Features
- Toggle feature flags on any website
- Persistent flag state across browser sessions
- Simple popup interface
- Content script communication
- Background script coordination

---

## Migration Notes

### For Extension Users
- No action required - extension functionality remains the same
- Improved performance and future compatibility
- Enhanced security with Manifest V3

### For Developers
- **Breaking**: Development now requires Node.js and npm
- **Breaking**: Source files moved to `src/` directory
- **Breaking**: Build process changed to use Vite
- **Enhancement**: Full TypeScript support
- **Enhancement**: Modern development workflow
- **Enhancement**: Comprehensive type safety

### Upgrade Path
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Build for production: `npm run build`
5. Load `dist/` directory in Chrome

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and [Semantic Versioning](https://semver.org/spec/v2.0.0.html) principles.*
