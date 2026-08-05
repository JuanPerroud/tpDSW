import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Exercises from "./pages/Exercises";
import Routines from "./pages/Routines";
import CreateUser from "./pages/CreateUser";
import { useState } from "react";

function getInitialUser() {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
}

function App() {
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const isLoggedIn = currentUser !== null;

  const handleLoginSuccess = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
      <Routes>
        {/* Rutas Públicas (Auth) - Redirigen a /routines si ya inició sesión */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/routines" replace /> : <Home onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/CreateUser"
          element={
            isLoggedIn ? <Navigate to="/routines" replace /> : <CreateUser />
          }
        />

        {/* Rutas Protegidas - Solo accesibles si isLoggedIn es true */}
        <Route
          path="/routines"
          element={
            isLoggedIn ? <Routines mode="my" currentUser={currentUser} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/community-routines"
          element={
            isLoggedIn ? <Routines mode="community" currentUser={currentUser} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/create-routine"
          element={
            isLoggedIn ? <Routines mode="create" currentUser={currentUser} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/exercises"
          element={
            isLoggedIn ? <Exercises /> : <Navigate to="/" replace />
          }
        />

        {/* Fallback general */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/routines" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;