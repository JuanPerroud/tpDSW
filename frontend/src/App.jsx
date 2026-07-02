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