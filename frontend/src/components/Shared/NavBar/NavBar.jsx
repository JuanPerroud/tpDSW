import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AdminUserPanel from "./AdminUserPanel";
import UserProfileModal from "./UserProfileModal";
import "./NavBar.css";

const Navbar = ({ isLoggedIn, currentUser, onLogout, onUserUpdated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = currentUser?.isAdmin === true;
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const panelWrapperRef = useRef(null);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Lógica para cerrar el panel si se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelWrapperRef.current && !panelWrapperRef.current.contains(e.target)) {
        setShowUserPanel(false);
      }
    };
    if (showUserPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserPanel]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isLoggedIn ? "/routines" : "/"} className="brand-title">
          <span className="brand-icon">💪</span> GymRoutines
        </Link>
      </div>

      <ul className="navbar-links">
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/CreateUser" className={isActive('/CreateUser') ? 'active' : ''}>
                Crear Cuenta
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/routines" className={isActive('/routines') ? 'active' : ''}>
                📋 Mis Rutinas
              </Link>
            </li>
            <li>
              <Link to="/community-routines" className={isActive('/community-routines') ? 'active' : ''}>
                🌐 Comunidad
              </Link>
            </li>
            <li>
              <Link to="/create-routine" className={`create-routine-nav-btn ${isActive('/create-routine') ? 'active' : ''}`}>
                ➕ Crear Rutina
              </Link>
            </li>
            <li>
              <Link to="/exercises" className={isActive('/exercises') ? 'active' : ''}>
                🏋️ Ejercicios
              </Link>
            </li>

            {/* Admin Panel Restructurado */}
            {isAdmin && (
              <li className="admin-users-wrapper" ref={panelWrapperRef}>
                <button
                  className={`admin-users-btn ${showUserPanel ? 'admin-btn-active' : ''}`}
                  onClick={() => setShowUserPanel(!showUserPanel)}
                  title="Gestionar Usuarios"
                >
                  👥 Usuarios
                </button>

                {/* Se renderiza el panel solo si showUserPanel es true */}
                {showUserPanel && <AdminUserPanel currentUser={currentUser} />}
              </li>
            )}

            {currentUser && (
              <>
                <li className="user-greeting">
                  <span>Hola, <strong>{currentUser.name || currentUser.email}</strong></span>
                </li>
                <li>
                  <button onClick={() => setShowProfileModal(true)} className="profile-btn" title="Mi Perfil">
                    👤 Mi Perfil
                  </button>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogoutClick} className="logout-btn">
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>

      {showProfileModal && (
        <UserProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onUserUpdated={(updatedUser) => {
            if (onUserUpdated) onUserUpdated(updatedUser);
            setShowProfileModal(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;