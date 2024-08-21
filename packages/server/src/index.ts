import cors from "cors";
import { WebSocketServer } from "ws";
import express from "express";
// @ts-expect-error yoink code instead of copy/pasting it https://github.com/yjs/y-websocket/blob/master/bin/utils.cjs
import { setupWSConnection } from "y-websocket/bin/utils";

import { leetcode } from "./routers/index.js";

const hostname = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "1234");

const app = express();

app.use(cors());
app.use(express.static("asset"));
app.use("/api/leetcode", leetcode.router);

const server = app.listen(port, hostname);
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
