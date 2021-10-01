import next from "next";
import path from "path";

import conf from "./next.config.js";

export function createNextServer() {
  const nextServer = next({
    dev: process.env.NODE_ENV !== "production",
    conf,
    dir: path.resolve("./nextClient"),
  });

  return nextServer;
}
