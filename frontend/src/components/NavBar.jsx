import { Link } from "react-router-dom";
import "./NavBar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Inicio</Link>
      <Link to="/exercises">Ejercicios</Link>
      <Link to="/routines">Rutinas</Link>
    </nav>
  );
}

export default Navbar;
