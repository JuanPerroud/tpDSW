import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function Navbar( {isLoggedIn , onLogout }) {

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); //resetea el localStorage y isLoggedIn = false
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Inicio</Link>
      </div>
      
      <ul className="nav-links">
        {/* al no estar loggeado - solo permite ver el inicio y el registro */}
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/CreateUser">Crear Cuenta</Link>
            </li>
          </>
        ) : (
          /* si el usuario esta loggeado:  */
          <>
            <li>
              <Link to="/routines">Rutinas</Link>
            </li>
            <li>
              <Link to="/exercises">Ejercicios</Link>
            </li>
            <li>
              <button onClick={handleLogoutClick} className="logout-btn">Cerrar sesion</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

// crear css - validacion de no poder loggearse desde otra cuenta cuando ya estoy conectado en una

export default Navbar;
