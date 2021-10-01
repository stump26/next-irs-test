import express from "express";
import fs from "fs";

import { createNextServer } from "./nextClient/nextStart";
const readIsrResultFileStat = (filePath: string): Promise<fs.Stats> =>
  new Promise((resolve, reject) => {
    const path = `./nextClient/.next/server/pages${filePath}`;
    fs.exists(path, (exists) => {
      if (exists) {
        fs.stat(path, (err, stats) => {
          if (err) {
            reject(err);
          }
          resolve(stats);
        });
      } else {
        reject(`${path} is not exists.`);
      }
    });
  });

const app = express();
const nextServer = createNextServer();

// Attach Next.js Server
let handle;
app.get("*", async (req, res) => {
  res.timer = process.hrtime();
  if (!handle) {
    handle = (await nextServer).getRequestHandler();
    // ISR 결과물
    if (handle && req.url?.match("/posts/")) {
      (async () => {
        const path = req.url;
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(
          `The script uses approximately ${Math.round(used * 100) / 100} MB`
        );
        try {
          const htmlStats = await readIsrResultFileStat(path + ".html");
          const jsonStats = await readIsrResultFileStat(path + ".json");
          const pong = process.hrtime(res.timer);
          console.log(
            `req_path: ${req.url},\n`+
            `res_time: ${(pong[0] * 1000000000 + pong[1]) / 1000000}ms,\n`+
            `result:{\n`+
            `\thtml: ${path + ".html"}\t ${htmlStats.size / 1000}kb`+
            `json: ${path + ".json"}\t ${jsonStats.size / 1000}kb\n`+
            `}`);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }
  return handle(req, res);
});

export default app;
