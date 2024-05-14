import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/authContext";
import IngredientsProvider from "./context/ingredientsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <IngredientsProvider>
        <App />
      </IngredientsProvider>
    </AuthProvider>
  </React.StrictMode>
);
