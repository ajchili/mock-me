import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const prefix = `monaco-editor/esm/vs`;
const proxyTarget = process.env.PROXY_TARGET || "localhost:1234";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          jsonWorker: [`${prefix}/language/json/json.worker`],
          cssWorker: [`${prefix}/language/css/css.worker`],
          htmlWorker: [`${prefix}/language/html/html.worker`],
          tsWorker: [`${prefix}/language/typescript/ts.worker`],
          editorWorker: [`${prefix}/editor/editor.worker`],
        },
      },
    },
  },
  server: {
    proxy: {
      "/ws": {
        target: `ws://${proxyTarget}`,
        ws: true,
        rewriteWsOrigin: true,
      },
      "/api": `http://${proxyTarget}`,
    },
  },
});
