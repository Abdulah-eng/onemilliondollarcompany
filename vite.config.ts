import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Removed splitVendorChunkPlugin - we're using custom manualChunks instead
    mode === 'development' && (async () => {
      try {
        const { componentTagger } = await import("lovable-tagger");
        return componentTagger();
      } catch {
        return null;
      }
    })(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'chart.js', 'react-chartjs-2', 'react-circular-progressbar']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // More aggressive code splitting for better initial load
          if (id.includes('node_modules')) {
            // Core React essentials (needed for landing page)
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-core';
            }
            // Router (needed for landing page navigation)
            if (id.includes('react-router')) {
              return 'router';
            }
            // Charts - lazy loaded (NOT needed for landing page)
            if (id.includes('recharts') || id.includes('chart.js') || id.includes('d3-')) {
              return 'charts';
            }
            // Supabase - lazy loaded (NOT needed for landing page)
            if (id.includes('@supabase') || id.includes('postgrest-js')) {
              return 'supabase';
            }
            // Framer Motion (used on landing page but can be chunked)
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            // Radix UI components (some used on landing, split granularly)
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            // Lucide icons (used throughout, separate chunk)
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Other vendor code
            return 'vendor';
          }
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    },
    // Optimize build output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
      },
    },
    // Increase chunk size warning limit since we're splitting intentionally
    chunkSizeWarningLimit: 1000,
  }
}));
