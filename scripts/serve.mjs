import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const contentTypes = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8", ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    const file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error("Invalid path");
    let candidate = file;
    if (!path.extname(candidate)) candidate = path.join(candidate, "index.html");
    let data;
    try { data = await fs.readFile(candidate); }
    catch { candidate = path.join(root, "404.html"); data = await fs.readFile(candidate); response.statusCode = 404; }
    response.setHeader("Content-Type", contentTypes[path.extname(candidate)] || "application/octet-stream");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.end(data);
  } catch {
    response.statusCode = 400;
    response.end("Bad request");
  }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, "127.0.0.1", () => console.log(`SpendSense preview: http://127.0.0.1:${port}`));
