import React, { useEffect, useState } from "react";
import { obtenerDibujos, eliminarDibujo } from "../services/api";
import Dibujo from "./Dibujo";
import { Grid, Typography, Button, Container, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [dibujos, setDibujos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDibujos = async () => {
      try {
        const response = await obtenerDibujos();
        setDibujos(response.data);
      } catch (error) {
        console.error("Error al obtener dibujos:", error);
        // Manejo de errores (mostrar un mensaje al usuario, etc.)
      } finally {
        setLoading(false);
      }
    };

    fetchDibujos();
  }, []);

  const handleEliminarDibujo = async (dibujoId) => {
    try {
      await eliminarDibujo(dibujoId);
      setDibujos(dibujos.filter((dibujo) => dibujo.id !== dibujoId));
    } catch (error) {
      console.error("Error al eliminar dibujo:", error);
      // Manejo de errores
    }
  };

  const handleCrearDibujo = () => {
    navigate("/dibujo");
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: "#003366", mb: 4 }}>
          Mis Dibujos
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, width: "100%" }}>
          <Button variant="contained" color="primary" onClick={handleCrearDibujo}>
            Crear Nuevo Dibujo
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {dibujos.length > 0 ? (
              <Grid container spacing={4} justifyContent="center">
                {" "}
                {/* Aumenta el espaciado a 4 */}
                {dibujos.map((dibujo) => (
                  <Grid item key={dibujo.id} xs={12} sm={6} md={4} lg={3}>
                    <Dibujo dibujo={dibujo} onEliminar={handleEliminarDibujo} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                No tienes dibujos aún. ¡Crea uno nuevo!
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default Dashboard;
