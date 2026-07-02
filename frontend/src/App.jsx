<<<<<<< HEAD
import './App.css'; 
import CreateUser from './page/CreateUser';
import LogginUser from './page/LogginUser';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <div className="navbar"> //Barra de navegacion
          <div>
            <Link to="/"> Loggin User</Link>
          </div>
          <div>
            <Link to="/createuser"> Create A User </Link>
          </div>
        </div>
      
        <Routes>
          
          <Route path="/" element={<LogginUser />} />

          <Route path="/createuser" element= {
            <div className= "CreateAccountUser">
              <div className= "mainBox">
                <h1 className= "mainTitle"> Create Account User </h1>
                <CreateUser />
              </div>
            </div>
          } />

        </Routes>
      </Router>
    </div>
  );
}

=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Exercises from "./pages/Exercises";
import Routines from "./pages/Routines";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/routines" element={<Routines />} />
      </Routes>
    </BrowserRouter>
  );
}
>>>>>>> origin/feature/JuaniPerroud

export default App;



/*const App = () => {
  return (
    <div>
      <div className= "CreateAccountUser">
        <div className= "mainBox">
        <h1 className= "mainTitle"> Create Account User </h1>
        <CreateUser />
        </div>
      </div>
    </div>
  );
}; */