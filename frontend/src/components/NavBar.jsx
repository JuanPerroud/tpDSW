import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";

function Navbar({ isLoggedIn, currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

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
            {currentUser && (
              <li className="user-greeting">
                <span>Hola, <strong>{currentUser.name || currentUser.email}</strong></span>
              </li>
            )}
            <li>
              <button onClick={handleLogoutClick} className="logout-btn">
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
