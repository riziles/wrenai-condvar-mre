import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const PORT = 3333;
const DIR = new URL(".", import.meta.url).pathname;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".wasm": "application/wasm",
  ".parquet": "application/octet-stream",
};

createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET" });
    return res.end();
  }

  let path = req.url === "/" ? "/index.html" : req.url;
  try {
    const data = await readFile(DIR + path.slice(1));
    const ext = "." + (path.split(".").pop() || "");
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("404");
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
