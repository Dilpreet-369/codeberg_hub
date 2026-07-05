import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ThemeContext.tsx";
import "./index.css";

// Safely grab the root element outside the render cycle
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Critical Error: Failed to find the root element. Ensure index.html has <div id=\"root\"></div>",
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);