import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /** Tailwind/Shadcn */
    tailwindcss(),
  ],
  /** Tailwind/shadcn */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  /** Development server configuration */
  server: {
    allowedHosts: ['.auth.maintainerd.local'],
    watch: {
      ignored: ['**/coverage/**'],
    },
    proxy: {
      // Proxy internal API requests to the internal API (port 8080) via nginx
      // during development. nginx routes private-api.auth.maintainerd.local → auth:8080.
      '/api': {
        target: 'https://private-api.auth.maintainerd.local',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy public API requests to the public API (port 8081) via nginx during
      // development. nginx routes public-api.auth.maintainerd.local → auth:8081.
      // Going through this proxy keeps the OAuth bootstrap calls (console client
      // lookup, token exchange, refresh) same-origin so they avoid cross-origin
      // CORS / browser cert-trust issues — mirroring the identity app.
      '/public-api': {
        target: 'https://public-api.auth.maintainerd.local',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/public-api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Public proxy error:', err);
          });
        },
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov'],
      include: [
        'src/components/**',
        'src/pages/**',
        'src/hooks/**',
        'src/services/**',
        'src/utils/**',
        'src/lib/**',
        'src/store/**',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        'src/test/**',
        'src/components/ui/**',
      ],
    },
  },
})
