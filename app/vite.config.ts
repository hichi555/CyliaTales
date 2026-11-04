import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      customViteReact: true,
      tsr: { generateRouteTree: true },
      server: { entry: "server" },
    } as never),
    viteReact(),
    nitro(),
  ],
  server: { host: "0.0.0.0", allowedHosts: true },
});
