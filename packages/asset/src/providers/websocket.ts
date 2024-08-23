import { type Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";

import { buildEndpoint } from "../utils/http.js";

export const buildWebsocketProvider = (roomName: string, doc: Doc) =>
  new WebsocketProvider(buildEndpoint("ws"), roomName, doc);
