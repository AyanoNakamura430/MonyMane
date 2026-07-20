import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: [
      'src/app/budgetDomain.test.ts',
      'src/app/backup.test.ts',
    ],
    exclude: [
      'src/app/components/**',
      'src/imports/**',
      'dist/**',
      'node_modules/**',
    ],
  },
});
