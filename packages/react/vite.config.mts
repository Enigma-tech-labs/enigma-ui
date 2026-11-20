import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/react',
  plugins: [react()],
  test: {
    name: 'react',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.{ts,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      reportsDirectory: '../../coverage/packages/react',
      provider: 'v8' as const,
    },
  },
});
