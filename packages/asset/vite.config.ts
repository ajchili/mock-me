import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const prefix = `monaco-editor/esm/vs`;
export default defineConfig({
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
      "/": {
        target: "ws://localhost:1234",
        ws: true,
        rewriteWsOrigin: true,
      },
      "/api": "http://localhost:1234",
    },
  },
});
