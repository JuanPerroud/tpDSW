import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDebounce } from "../searchBar/useDebounce";
import "./NavBar.css";

const ADMIN_ID = 1;
const API_URL = "http://localhost:3000/api/user";

function Navbar({ isLoggedIn, currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = currentUser?.id === ADMIN_ID;

  const [showUserPanel, setShowUserPanel] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const panelRef = useRef(null);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const status = (path) => location.pathname === path;

  const fetchUsers = async (query = "") => {
    setLoadingUsers(true);
    try {
      const url = query
        ? `${API_URL}?search=${encodeURIComponent(query)}`
        : API_URL;
      const res = await axios.get(url);
      setUsers(res.data.filter(u => u.id !== ADMIN_ID));
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (showUserPanel) {
      fetchUsers(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, showUserPanel]);

  const togglePanel = () => {
    const willOpen = !showUserPanel;
    setShowUserPanel(willOpen);
    if (willOpen) {
      fetchUsers(searchQuery);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await axios.patch(`${API_URL}/${userId}/toggle-active?adminId=${ADMIN_ID}`);
      fetchUsers(debouncedSearchQuery);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert(err.response?.data?.mensaje || "Error al cambiar estado del usuario");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`¿Estás seguro de eliminar a "${userName}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${userId}?adminId=${ADMIN_ID}`);
      fetchUsers(debouncedSearchQuery);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert(err.response?.data?.mensaje || "Error al eliminar usuario");
    }
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
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
              <Link to="/" className={status('/') ? 'active' : ''}>
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/CreateUser" className={status('/CreateUser') ? 'active' : ''}>
                Crear Cuenta
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/routines" className={status('/routines') ? 'active' : ''}>
                📋 Mis Rutinas
              </Link>
            </li>
            <li>
              <Link to="/community-routines" className={status('/community-routines') ? 'active' : ''}>
                🌐 Comunidad
              </Link>
            </li>
            <li>
              <Link to="/create-routine" className={`create-routine-nav-btn ${status('/create-routine') ? 'active' : ''}`}>
                ➕ Crear Rutina
              </Link>
            </li>
            <li>
              <Link to="/exercises" className={status('/exercises') ? 'active' : ''}>
                🏋️ Ejercicios
              </Link>
            </li>

            {/* Admin: User Management Dropdown */}
            {isAdmin && (
              <li className="admin-users-wrapper" ref={panelRef}>
                <button
                  className={`admin-users-btn ${showUserPanel ? 'admin-btn-active' : ''}`}
                  onClick={togglePanel}
                  title="Gestionar Usuarios"
                >
                  👥 Usuarios
                </button>

                {showUserPanel && (
                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <h3>Gestión de Usuarios</h3>
                      <span className="admin-badge">Admin</span>
                    </div>

                    <div className="admin-search-container">
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="🔍 Buscar por nombre o email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {loadingUsers ? (
                      <div className="admin-panel-loading">Cargando...</div>
                    ) : users.length === 0 ? (
                      <div className="admin-panel-empty">No hay usuarios registrados.</div>
                    ) : (
                      <ul className="admin-user-list">
                        {users.map(user => (
                          <li key={user.id} className={`admin-user-item ${!user.status ? 'user-inactive' : ''}`}>
                            <div className="admin-user-info">
                              <span className="admin-user-name">{user.name}</span>
                              <span className="admin-user-email">{user.email}</span>
                              <span className={`admin-user-status ${user.status ? 'status-active' : 'status-inactive'}`}>
                                {user.status ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            <div className="admin-user-actions">
                              <button
                                className={`admin-action-btn ${user.status ? 'btn-deactivate' : 'btn-activate'}`}
                                onClick={() => handleToggleActive(user.id)}
                                title={user.status ? 'Desactivar' : 'Activar'}
                              >
                                {user.status ? '⏸' : '▶'}
                              </button>
                              <button
                                className="admin-action-btn btn-delete"
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                title="Eliminar"
                              >
                                🗑
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            )}

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
