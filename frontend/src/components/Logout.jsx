// Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
}

export default Logout;
