import { type Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";

export const buildWebsocketProvider = (roomName: string, doc: Doc) =>
  new WebsocketProvider("/ws", roomName, doc);
