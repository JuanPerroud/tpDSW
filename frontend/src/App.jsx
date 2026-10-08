import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Shared/NavBar/NavBar";
import Home from "./pages/Home/Home";
import Exercises from "./pages/Exercises/Exercises";
import Routines from "./pages/Routines/Routines";
import CreateUser from "./pages/CreateUser/CreateUser";
import AdminUsers from "./pages/Admin/AdminUsers";
import { authStorage } from "./services/authStorage";
import { UNAUTHORIZED_EVENT } from "./services/api";

import "./App.css";

const App = () => {
  // Recupera el usuario que ya había iniciado sesión (si el token sigue guardado)
  const [currentUser, setCurrentUser] = useState(() =>
    authStorage.getToken() ? authStorage.getUser() : null,
  );
  const isLoggedIn = currentUser !== null;
  const isAdmin = currentUser?.isAdmin === true;

  const handleLoginSuccess = (user, token) => {
    authStorage.save(user, token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authStorage.clear();
    setCurrentUser(null);
  };

  // El interceptor de Axios avisa cuando el token expiró o es inválido (401)
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, handleLogout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleLogout);
  }, []);

  // Rutas protegidas según el nivel de acceso del usuario
  const protect = (element, { adminOnly = false } = {}) => {
    if (!isLoggedIn) return <Navigate to="/" replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/routines" replace />;
    return element;
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} onUserUpdated={(user) => handleLoginSuccess(user)} />
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

        {/* Rutas protegidas - Requieren sesión (nivel usuario) */}
        <Route
          path="/routines"
          element={protect(<Routines key="my" mode="my" currentUser={currentUser} />)}
        />
        <Route
          path="/community-routines"
          element={protect(<Routines key="community" mode="community" currentUser={currentUser} />)}
        />
        <Route
          path="/create-routine"
          element={protect(<Routines key="create" mode="create" currentUser={currentUser} />)}
        />
        <Route
          path="/exercises"
          element={protect(<Exercises currentUser={currentUser} />)}
        />

        {/* Rutas protegidas - Solo nivel administrador */}
        <Route
          path="/admin/users"
          element={protect(<AdminUsers />, { adminOnly: true })}
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
