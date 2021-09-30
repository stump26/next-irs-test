import express from "express";
import { createNextServer } from "./nextClient/nextStart";

const app = express();
const nextServer = createNextServer();

// Attach Next.js Server
let handle;
app.get("*", async (req, res) => {
  if (!handle) {
    handle = (await nextServer).getRequestHandler();
    // fs.readdir(...)
    // irs 결과물 후킹.
  }
  return handle(req, res);
});

export default app;
