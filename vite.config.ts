import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  vite: {
    plugins: [basicSsl()]
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: 'vercel'
  }
});
