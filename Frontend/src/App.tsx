import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Home from "./pages/home/Home";
import { useAuthContext } from "./context/AuthContext";
import useRightPanel from "./zustand/useRightPanel";
import type { RightPanelView } from "./types";

// Component that redirects to home while setting the right panel view
const RedirectWithView = ({ view }: { view: RightPanelView }) => {
  const { setCurrentView } = useRightPanel();

  useEffect(() => {
    setCurrentView(view);
  }, [view, setCurrentView]);

  return <Navigate to="/" replace />;
};

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-base-200 transition-colors duration-200">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
        <Route
          path="/admin"
          element={
            authUser?.role === "admin" ? <RedirectWithView view="admin" /> : <Navigate to="/" />
          }
        />
        <Route
          path="/game"
          element={authUser ? <RedirectWithView view="game" /> : <Navigate to="/login" />}
        />
        <Route
          path="/game/lobby"
          element={authUser ? <RedirectWithView view="game" /> : <Navigate to="/login" />}
        />
        <Route
          path="/game/play"
          element={authUser ? <RedirectWithView view="game" /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
