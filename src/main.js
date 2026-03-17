import "./styles/styles.scss";

import { initApp } from "./app.js";

const root = document.getElementById("app");
if (root) {
  initApp(root);
} else {
  console.error("[B-Score] #app element not found in index.html");
}
