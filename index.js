const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dibujosRoutes = require("./routes/dibujosRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/dibujos", dibujosRoutes);

app.listen(3001, () => {
  console.log("Servidor escuchando en el puerto 3001");
});
