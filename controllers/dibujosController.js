const pool = require("../config/db");

exports.obtenerDibujos = (req, res) => {
  const userId = req.user.id;

  pool.query("SELECT * FROM dibujos_notas WHERE usuario_id = ?", [userId], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};

exports.crearDibujo = (req, res) => {
  const { titulo, descripcion, contenido } = req.body;
  const usuarioId = req.user.id;

  pool.query(
    "SELECT * FROM dibujos_notas WHERE titulo = ? AND usuario_id = ?", // Consulta modificada
    [titulo, usuarioId],
    (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        // Ya existe un dibujo con el mismo título para este usuario
        return res.status(400).json({ error: "Ya tienes un dibujo con este título" });
      } else {
        // No existe un dibujo con el mismo título para este usuario, proceder a crear
        pool.query(
          "INSERT INTO dibujos_notas (usuario_id, titulo, descripcion, contenido) VALUES (?, ?, ?, ?)",
          [usuarioId, titulo, descripcion, contenido],
          (error, results) => {
            if (error) throw error;
            res.json({ message: "Dibujo creado exitosamente", id: results.insertId });
          }
        );
      }
    }
  );
};
exports.eliminarDibujo = (req, res) => {
  const dibujoId = req.params.id;
  const usuarioId = req.user.id;

  pool.query("DELETE FROM dibujos_notas WHERE id = ? AND usuario_id = ?", [dibujoId, usuarioId], (error, results) => {
    if (error) {
      console.error("Error al eliminar dibujo:", error); // Registrar el error en la consola
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    console.log("Resultado de la consulta:", results); // Registrar el resultado en la consola

    if (results.affectedRows === 0) {
      console.log("Dibujo no encontrado o no pertenece al usuario"); // Registrar en la consola
      return res.status(404).json({ error: "Dibujo no encontrado o no pertenece al usuario" });
    }

    res.json({ message: "Dibujo eliminado exitosamente" });
  });
};
