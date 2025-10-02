import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxy = env.VITE_API_PROXY_TARGET;
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: apiProxy
        ? {
            "/api": {
              target: apiProxy,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
    plugins: [
    react(),
    splitVendorChunkPlugin(),
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
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          charts: ['recharts', 'chart.js', 'react-chartjs-2', 'react-circular-progressbar'],
          motion: ['framer-motion']
        }
      },
      onwarn(warning, warn) {
        if ((warning as any).code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning as any)
      }
    }
    }
  };
});
