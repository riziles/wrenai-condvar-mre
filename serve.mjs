import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const PORT = 3333;
const PARQUET = new URL("./data.parquet", import.meta.url).pathname;

createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET" });
    return res.end();
  }

  // Serve the Parquet file
  if (req.url === "/data.parquet" || req.url === "/") {
    const data = await readFile(PARQUET);
    res.writeHead(200, { "Content-Type": "application/octet-stream" });
    return res.end(data);
  }

  // Serve index.html
  try {
    const html = await readFile(new URL("./index.html", import.meta.url));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } catch {
    res.writeHead(404);
    res.end("404");
  }
}).listen(PORT, () => {
  console.log(`Serving on http://localhost:${PORT}`);
  console.log(`Parquet: ${PARQUET}`);
});
