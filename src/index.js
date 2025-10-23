import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // ⚠️ dòng này cực quan trọng!
import App from "./App";
import "./style/global.css"; // import Tailwind v4

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
