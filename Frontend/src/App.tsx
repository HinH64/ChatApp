import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Home from "./pages/home/Home";
import Admin from "./pages/admin/Admin";
import { useAuthContext } from "./context/AuthContext";

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
            authUser?.role === "admin" ? <Admin /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
