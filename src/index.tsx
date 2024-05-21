import { createRoot } from "react-dom/client";

let $app = document.getElementById("app");

if (!$app) {
  $app = document.createElement("div");
  document.body.appendChild($app);
}

const root = createRoot($app);
root.render(<h1>Hello, world!</h1>);
