import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@gui': fileURLToPath(new URL('./src/components/graphics/gui', import.meta.url)),
      '@formulas': fileURLToPath(new URL('./src/components/formulas', import.meta.url)),
      '@dungeon': fileURLToPath(new URL('./src/components/dungeon', import.meta.url)),
      '@type': fileURLToPath(new URL('./src/types', import.meta.url)),
    },
  },
  build: {
    target: ['chrome89', 'firefox89', 'safari15'],
  },
});
