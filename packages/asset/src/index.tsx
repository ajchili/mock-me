import { createRoot } from "react-dom/client";
import { Router } from "./components/Router/Router.js";

import "./index.css";

let $app = document.getElementById("app");

if (!$app) {
  $app = document.createElement("div");
  document.body.appendChild($app);
}

const root = createRoot($app);
root.render(<Router />);
