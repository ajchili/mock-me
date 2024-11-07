import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Y from "yjs";

import { buildWebsocketProvider } from "../../providers/websocket.js";

export const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId = searchParams.get("roomId");
  if (!roomId) {
    navigate("/");
    return;
  }

  useEffect(() => {
    const ydoc = new Y.Doc({ autoLoad: true });
    const provider = buildWebsocketProvider(roomId, ydoc);

    setPrompt(ydoc.getText("prompt").toString());
    ydoc.on("update", () => {
      setPrompt(ydoc.getText("prompt").toString());
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  return (
    <div
      className="flex min-w-[50%] flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
      dangerouslySetInnerHTML={{ __html: prompt }}
    />
  );
};
