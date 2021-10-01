import express from "express";
import fs from "fs";

import logger from "./logger";
import { createNextServer } from "./nextClient/nextStart";

const readIsrResultFileStat = async (filePath: string) => {
  const path = `./nextClient/.next/server/pages${filePath}`;
  try {
    return fs.promises.stat(path);
  } catch (err) {
    logger.error(`${path} is not exists.`);
  }
};

const app = express();
const nextApp = createNextServer();
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  // Attach Next.js Server
  app.get("*", async (req, res) => {
    const timer = process.hrtime();
    await handle(req, res);
    // ISR 결과물
    res.on("close", () => {
      setTimeout(async () => {
        if (req.url?.match(/^\/posts\//)) {
          const path = req.url;
          const used = process.memoryUsage().heapUsed / 1024 / 1024;
          logger.info(
            `The script uses approximately ${Math.round(used * 100) / 100} MB`
          );
          try {
            const htmlStats = await readIsrResultFileStat(path + ".html");
            const jsonStats = await readIsrResultFileStat(path + ".json");
            const pong = process.hrtime(timer);

            logger.info({
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
            });
          } catch (e) {
            logger.error(e);
          }
        }
      }, 10);
    });
  });

  app.listen(3000, () => {
    console.log(`> Ready on http://localhost:${3000}`);
  });
});
