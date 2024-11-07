import React from "react";
import { ResizableGrid } from "../ResizableGrid/ResizableGrid";

export const Demo = (): JSX.Element => {
  return (
    <ResizableGrid direction="horizontal">
      <div style={{ width: "100%", height: "100%", background: "red" }} />
      <ResizableGrid direction="vertical">
        <div style={{ width: "100%", height: "100%", background: "yellow" }} />
        <ResizableGrid direction="horizontal">
          <div style={{ width: "100%", height: "100%", background: "blue" }} />
          <div style={{ width: "100%", height: "100%", background: "green" }} />
        </ResizableGrid>
      </ResizableGrid>
    </ResizableGrid>
  );
};
