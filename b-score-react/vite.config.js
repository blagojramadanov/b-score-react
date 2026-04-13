import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            proxyReq.setHeader("X-Auth-Token", process.env.VITE_API_KEY || "");
            if (req.headers["x-unfold-goals"])
              proxyReq.setHeader(
                "X-Unfold-Goals",
                req.headers["x-unfold-goals"],
              );
            if (req.headers["x-unfold-bookings"])
              proxyReq.setHeader(
                "X-Unfold-Bookings",
                req.headers["x-unfold-bookings"],
              );
            if (req.headers["x-unfold-lineups"])
              proxyReq.setHeader(
                "X-Unfold-Lineups",
                req.headers["x-unfold-lineups"],
              );
            if (req.headers["x-unfold-subs"])
              proxyReq.setHeader("X-Unfold-Subs", req.headers["x-unfold-subs"]);
          });
        },
      },
    },
  },
});
