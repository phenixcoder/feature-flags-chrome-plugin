import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        'content-script': resolve(__dirname, 'src/content-script.ts'),
        popup: resolve(__dirname, 'src/popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'es',
      },
    },
    target: 'es2022',
    minify: false, // Keep readable for debugging
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  plugins: [
    {
      name: 'copy-extension-files',
      writeBundle() {
        // Copy manifest.json
        copyFileSync(
          resolve(__dirname, 'src/manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );

        // Copy popup.html
        copyFileSync(
          resolve(__dirname, 'src/popup.html'),
          resolve(__dirname, 'dist/popup.html')
        );

        // Copy injected script
        copyFileSync(
          resolve(__dirname, 'src/injected-script.js'),
          resolve(__dirname, 'dist/injected-script.js')
        );

        // Copy images directory
        const imagesDir = resolve(__dirname, 'dist/images');
        if (!existsSync(imagesDir)) {
          mkdirSync(imagesDir, { recursive: true });
        }

        const imageFiles = [
          'switch16.png',
          'switch32.png',
          'switch48.png',
          'switch128.png',
          'github-image.svg'
        ];

        imageFiles.forEach(file => {
          const srcPath = resolve(__dirname, 'plugin/images', file);
          const destPath = resolve(__dirname, 'dist/images', file);
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath);
          }
        });
      },
    },
  ],
});
