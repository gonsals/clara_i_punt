// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  // Keep production dependency optimization separate from a running preview.
  // Sharing the cache can replace React's development JSX runtime during build.
  vite: {
    cacheDir: process.argv.includes('dev') ? 'node_modules/.vite-dev' : 'node_modules/.vite-build',
  },
  integrations: [react(), tailwind()],
  output: 'server',
  // Vercel produces its serverless bundle in Linux. The Node adapter makes
  // local builds portable, including Windows without symlink privileges.
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),
});
