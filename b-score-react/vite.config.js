import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/b-score-react/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, "src/styles")],
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.football-data.org/v4",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            proxyReq.setHeader("X-Auth-Token", process.env.VITE_API_KEY || "");
            [
              "x-unfold-goals",
              "x-unfold-bookings",
              "x-unfold-lineups",
              "x-unfold-subs",
            ].forEach((h) => {
              if (req.headers[h])
                proxyReq.setHeader(
                  h
                    .split("-")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join("-"),
                  req.headers[h],
                );
            });
          });
        },
      },
    },
  },
});
