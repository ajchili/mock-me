import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export const Prompt = (): JSX.Element => {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const ydoc = new Y.Doc();
    const { hostname } = window.location;
    const provider = new WebsocketProvider(
      `ws://${hostname}:1234`,
      "prompt",
      ydoc
    );

    ydoc.on("update", () => {
      setPrompt(ydoc.getText("monaco").toString());
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  return (
    <div
      className="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
      dangerouslySetInnerHTML={{ __html: prompt }}
    />
  );
};
