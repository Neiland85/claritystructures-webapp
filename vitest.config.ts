import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      'tests/decision.spec.ts',
      'tests/decision.snapshot.spec.ts',
      'tests/intake-funnel.integration.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        '**/.next/',
        '**/generated/',
      ],
      include: [
        'packages/domain/src/**/*.ts',
        'packages/types/src/**/*.ts',
        'apps/web/src/lib/**/*.ts',
      ],
      thresholds: {
        statements: 35,
        branches: 80,
        functions: 40,
        lines: 35,
      },
    },
  },
  resolve: {
    alias: {
      '@clarity/domain': path.resolve(__dirname, './packages/domain/src'),
      '@clarity/types': path.resolve(__dirname, './packages/types/src'),
      '@clarity/config': path.resolve(__dirname, './packages/config/src'),
      '@': path.resolve(__dirname, './apps/web/src'),
    },
  },
});
