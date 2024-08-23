import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Y from "yjs";

import { Button } from "../Button/Button.js";
import { buildWebsocketProvider } from "../../providers/websocket.js";

export const Navbar = () => {
  const [isExporting, setIsExporting] = useState(false);

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const onExport = async () => {
    setIsExporting(true);

    try {
      const data = await Promise.all(
        ["prompt", "response", "notes"].map((room) => {
          return new Promise((resolve, reject) => {
            const ydoc = new Y.Doc({ autoLoad: true });
            const provider = buildWebsocketProvider(room, ydoc);

            const timeout = setTimeout(() => reject(), 10000);

            provider.on("status", (e: any) => {
              if (e.status === "disconnected") return;

              clearTimeout(timeout);
              provider.disconnect();
              resolve(ydoc.getText("monaco").toString());
            });
          });
        })
      );

      const file = new File([JSON.stringify(data)], "mock-me.json", {
        type: "application/json",
      });
      const $el = document.createElement("a");
      const url = URL.createObjectURL(file);

      $el.href = url;
      $el.download = file.name;
      document.body.appendChild($el);
      $el.click();

      document.body.removeChild($el);
      window.URL.revokeObjectURL(url);
    } catch {
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-800 flex justify-between p-2">
      <span className="text-3xl text-white" onClick={navigateToHome}>
        👉🏽👈🏽 mock me
      </span>
      <Button isLoading={isExporting} onClick={onExport}>
        💾 export
      </Button>
    </div>
  );
};
