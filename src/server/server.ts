import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// project root: from src/server → ../../
const projectRoot = path.resolve(__dirname, "..", "..");
const fromRoot = (...p: string[]) => path.join(projectRoot, ...p);

async function createServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    // DEV: Vite in middleware mode using the project root (loads vite.config.ts and aliases)
    const vite = await (await import("vite")).createServer({
      root: projectRoot,
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares
    );

    // Catch-all handler for SPA routing - only handle non-asset requests
    app.use(async (req, res) => {
      try {
        // Skip handling for static assets (CSS, JS, images, etc.)
        if (req.url?.includes('.') && !req.url.includes('?')) {
          return res.status(404).end('Not found');
        }
        
        const url = req.originalUrl;
        // read index.html from project root
        let template = fs.readFileSync(fromRoot("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        // load server entry by absolute URL from root (/src/...)
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const appHtml = await render(url);
        res.status(200).type("html").end(template.replace("<!--app-html-->", appHtml));
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        res.status(500).end(e.message);
      }
    });
  } else {
    // PROD: serve built client + call built server entry
    const distClient = fromRoot("dist", "client");
    const distServer = fromRoot("dist", "server");

    app.use("/assets", express.static(distClient, { index: false }));

    const template = fs.readFileSync(path.join(distClient, "index.html"), "utf-8");
    const { render } = await import(path.join(distServer, "entry-server.js"));

    // Catch-all handler for SPA routing
    app.use(async (req, res) => {
      const appHtml = await render(req.originalUrl);
      res.status(200).type("html").end(template.replace("<!--app-html-->", appHtml));
    });
  }

  const port = Number(process.env.PORT || 5173);
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📱 Film Browser app is ready!`);
  });
}

createServer();
