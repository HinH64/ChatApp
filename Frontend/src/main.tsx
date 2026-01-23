import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { GameContextProvider } from "./context/GameContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <GameContextProvider>
              <App />
            </GameContextProvider>
          </SocketContextProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
    <Toaster />
  </React.StrictMode>
);
