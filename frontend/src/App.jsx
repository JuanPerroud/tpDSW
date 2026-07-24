import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Exercises from "./pages/Exercises";
import Routines from "./pages/Routines";
import CreateUser from "./pages/CreateUser";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


function App() {
  const [ isLoggedIn , setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/CreateUser" element= {< CreateUser />} />

        <Route path="/exercises" element={isLoggedIn ? <Exercises /> : <Navigate to="/" replace />} />
        <Route path="/routines" element={isLoggedIn ? <Routines /> : <Navigate to= "/" replace />} />
        <Route path="*" element={<Navigate to="/" replace /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;