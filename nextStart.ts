import next from "next";
import path from "path";

import conf from "./nextClient/next.config.js";

export async function createNextServer() {
  const nextServer = next({
    dev: process.env.NODE_ENV !== "production",
    conf,
    dir: path.resolve("./nextClient"),
  });

  await nextServer.prepare();

  return nextServer;
}
