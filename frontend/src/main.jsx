import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { FinancialProvider } from "./state/FinancialContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FinancialProvider>
        <App />
      </FinancialProvider>
    </BrowserRouter>
  </React.StrictMode>
);
