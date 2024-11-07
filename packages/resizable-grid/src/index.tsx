import React from "react";
import { createRoot } from "react-dom/client";
import { Demo } from "./components/Demo/Demo";

const $app = document.createElement("div");
$app.style.width = "100%";
$app.style.height = "100dvh";
document.body.appendChild($app);

const root = createRoot($app);
root.render(<Demo />);
