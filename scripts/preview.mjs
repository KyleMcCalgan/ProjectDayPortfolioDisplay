// Local preview always builds links from the site root, even if a Pages base
// path was set in another terminal session.
process.env.BASE_PATH = "/";
await import("./build.mjs");
await import("./serve.mjs");
