import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  plugins: [
    {
      name: 'copy-frontend-assets',
      closeBundle() {
        copyDirRecursive('js', 'dist/js');
        copyDirRecursive('css', 'dist/css');
        copyDirRecursive('assets', 'dist/assets');
        if (fs.existsSync('sw.js')) {
          fs.copyFileSync('sw.js', 'dist/sw.js');
        }
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});

