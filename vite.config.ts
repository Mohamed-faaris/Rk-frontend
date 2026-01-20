import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('@react')) {
              return 'vendor-react';
            }
            if (id.includes('radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('axios') || id.includes('sonner') || id.includes('date-fns')) {
              return 'vendor-utils';
            }
            return 'vendor-common';
          }
          // Pages
          if (id.includes('WebDevelopmentPage') || id.includes('UIUXDesignPage') || 
              id.includes('BrandingIdentityPage') || id.includes('Animation3DPage')) {
            return 'pages-services';
          }
          if (id.includes('BlogPage') || id.includes('CaseStudiesPage')) {
            return 'pages-content';
          }
          if (id.includes('AdminDashboard') || id.includes('ManagementDashboard')) {
            return 'pages-admin';
          }
          // Components
          if (id.includes('components/Contact') || id.includes('components/ChatBot')) {
            return 'components-forms';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
}));
