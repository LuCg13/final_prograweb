const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

exports.login = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  pool.query("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombre_usuario], async (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

      if (passwordMatch) {
        const token = jwt.sign({ id: user.id, nombre_usuario: user.nombre_usuario }, "FinProWEB2024*", { expiresIn: "1h" });
        res.json({ token });
      } else {
        res.status(401).json({ error: "Contraseña incorrecta" });
      }
    } else {
      res.status(401).json({ error: "Usuario no encontrado" });
    }
  });
};

exports.registro = async (req, res) => {
  const { nombre_usuario, contrasena, email } = req.body;

  const hashedPassword = await bcrypt.hash(contrasena, 10);

  pool.query(
    "INSERT INTO usuarios (nombre_usuario, contrasena, email) VALUES (?, ?, ?)",
    [nombre_usuario, hashedPassword, email],
    (error, results) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "El nombre de usuario ya existe" });
        }
        throw error;
      }
      res.json({ message: "Usuario registrado exitosamente" });
    }
  );
};
