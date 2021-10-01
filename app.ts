import express from "express";
import logger from "./logger";
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
const nextApp = createNextServer();
const handle = nextApp.getRequestHandler();
nextApp.prepare().then(async () => {
  // Attach Next.js Server
  app.get("*", async (req, res) => {
    res.timer = process.hrtime();

    res.on("finish", async () => {
      // ISR 결과물
      if (req.url?.match(/^\/posts\//)) {
        logger.info(req.url);
        const path = req.url;
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        logger.info(
          `The script uses approximately ${Math.round(used * 100) / 100} MB`
        );
        try {
          const htmlStats = await readIsrResultFileStat(path + ".html");
          const jsonStats = await readIsrResultFileStat(path + ".json");
          const pong = process.hrtime(res.timer);

          logger.info(
            JSON.stringify(
              {
                req_path: req.url,
                res_time: `${(pong[0] * 1000000000 + pong[1]) / 1000000}ms`,
                result: {
                  html: {
                    path: path + ".html",
                    size: `${htmlStats.size / 1000}kb`,
                  },
                  json: {
                    path: path + ".json",
                    size: `${jsonStats.size / 1000}kb`,
                  },
                },
              },
              null,
              2
            )
          );
        } catch (e) {
          logger.error(e);
        }
      }
    });
    return handle(req, res);
  });
});

export default app;
