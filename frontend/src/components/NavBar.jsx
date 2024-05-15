import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#003366", color: "white" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Mis Dibujos
        </Typography>
        <Box>
          {/* Lógica para mostrar botones según la ruta */}
          {location.pathname === "/login" ? (
            <Button color="inherit" component={Link} to="/registro">
              Registro
            </Button>
          ) : location.pathname === "/registro" ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>{" "}
              {/* Mostrar botón Dashboard */}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
