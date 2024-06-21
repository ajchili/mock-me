import { useRef } from "react";

const socketCache: Record<string, WebSocket> = {};

export const useWebSocket = (url: string) => {
  const wsRef = useRef<WebSocket>();

  if (!(url in socketCache)) {
    socketCache[url] = new WebSocket(url);
  }

  if (!wsRef.current) {
    wsRef.current = socketCache[url];
  }

  return wsRef.current;
};
