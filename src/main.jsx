// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { clarity } from "@microsoft/clarity";

// Initialisation de Microsoft Clarity
const clarityId = import.meta.env.VITE_CLARITY_ID;
if (clarityId) {
  clarity.init(clarityId);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
