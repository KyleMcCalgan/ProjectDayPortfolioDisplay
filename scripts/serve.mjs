import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const contentTypes = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8", ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff": "font/woff", ".woff2": "font/woff2" };
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
const requestedPort = Number(process.env.PORT || 4173);
let usingFallbackPort = false;

server.on("listening", () => {
  const address = server.address();
  console.log(`SpendSense local preview: http://127.0.0.1:${address.port}/`);
  console.log(`Team page: http://127.0.0.1:${address.port}/`);
  console.log(`App page:  http://127.0.0.1:${address.port}/app/`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && !usingFallbackPort) {
    usingFallbackPort = true;
    console.log(`Port ${requestedPort} is already in use; choosing an available local port.`);
    server.listen(0, "127.0.0.1");
    return;
  }
  console.error(error);
  process.exitCode = 1;
});

server.listen(requestedPort, "127.0.0.1");
