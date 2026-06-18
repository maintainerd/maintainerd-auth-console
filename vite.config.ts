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
    proxy: {
      // Proxy API requests to the backend during development
      '/api': {
        target: 'http://api.maintainerd.auth',
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
      // Scope coverage to the shared service factory, the shared listing engine,
      // and the Users listing components (the reference implementation).
      include: [
        'src/services/api/_lib/**',
        'src/components/data-table/useServerDataTable.ts',
        'src/components/data-table/ListingToolbar.tsx',
        'src/components/data-table/ResourceListing.tsx',
        'src/components/data-table/RowActions.tsx',
        'src/pages/users/components/UserActions.tsx',
        'src/pages/users/components/UserColumns.tsx',
        'src/pages/users/components/UserListing.tsx',
        'src/components/data-table/usePaginationTable.ts',
        'src/components/details/StatusBadge.tsx',
        'src/components/details/EmptyState.tsx',
        'src/components/details/ListSkeleton.tsx',
        'src/components/details/DetailHeaderCard.tsx',
        'src/components/details/DetailLayout.tsx',
        // Users details feature (the reference test standard for detail views).
        'src/pages/users/details/UserDetailsPage.tsx',
        'src/pages/users/details/components/UserHeader.tsx',
        'src/pages/users/details/components/UserMetadata.tsx',
        'src/pages/users/details/components/UserRoles.tsx',
        'src/pages/users/details/components/UserIdentities.tsx',
        'src/pages/users/details/components/UserActivity.tsx',
        'src/pages/users/details/components/UserSessions.tsx',
        'src/pages/users/details/components/UserProfiles.tsx',
        'src/pages/users/details/components/ProfileActions.tsx',
        'src/pages/users/details/components/ProfileFormDialog.tsx',
        'src/pages/users/details/components/AssignUserRolesDialog.tsx',
        // Users add/update form + the shared metadata-fields hook it relies on.
        'src/pages/users/form/UserAddOrUpdateForm.tsx',
        'src/hooks/useMetadataFields.ts',
      ],
      exclude: ['**/*.test.{ts,tsx}', 'src/test/**'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
