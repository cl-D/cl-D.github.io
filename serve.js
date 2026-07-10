// Tiny zero-dependency static server for previewing dist/ locally.
// Run with: npm run dev   (builds first)   or   npm run serve
import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");
const PORT = process.env.PORT || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^([/\\])+/, "");
  let file = path.join(DIST, clean);
  if (!file.startsWith(DIST)) return null; // no escaping dist/
  try {
    if (statSync(file).isDirectory()) file = path.join(file, "index.html");
    statSync(file);
    return file;
  } catch {
    return null;
  }
}

createServer((req, res) => {
  const file = resolveFile(req.url);
  if (file) {
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(readFileSync(file));
  } else {
    let body = "404 not found";
    try {
      body = readFileSync(path.join(DIST, "404.html"));
    } catch {}
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(body);
  }
}).listen(PORT, () => {
  console.log(`serving dist/ at http://localhost:${PORT} — press Ctrl+C to stop`);
});
