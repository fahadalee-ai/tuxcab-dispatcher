import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/** Public URL path (trailing slash). Must match Nginx `location` and preview.html. */
const PRODUCTION_BASE = "/tuxcab-dispatch/";
const root = fileURLToPath(new URL(".", import.meta.url));

function servePreviewHtml() {
  const file = resolve(root, "preview.html");
  const handle = (
    req: { url?: string },
    res: { setHeader: (k: string, v: string) => void; end: (b: Buffer) => void },
    next: () => void,
  ) => {
    const path = (req.url ?? "").split("?")[0];
    if (path === `${PRODUCTION_BASE}preview.html` || path === "/preview.html") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(readFileSync(file));
      return;
    }
    next();
  };

  return {
    name: "serve-preview-html",
    configureServer(server: { middlewares: { use: (fn: typeof handle) => void } }) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server: { middlewares: { use: (fn: typeof handle) => void } }) {
      server.middlewares.use(handle);
    },
  };
}

export default defineConfig({
  nitro: false,
  vite: {
    base: PRODUCTION_BASE,
    plugins: [servePreviewHtml()],
    server: {
      allowedHosts: ["demo.sourapps.com", "localhost", "127.0.0.1"],
    },
    preview: {
      allowedHosts: ["demo.sourapps.com", "localhost", "127.0.0.1"],
    },
  },
});
