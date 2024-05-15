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
    "INSERT INTO dibujos_notas (usuario_id, titulo, descripcion, contenido) VALUES (?, ?, ?, ?)",
    [usuarioId, titulo, descripcion, contenido],
    (error, results) => {
      if (error) throw error;
      res.json({ message: "Dibujo creado exitosamente", id: results.insertId });
    }
  );
};

exports.eliminarDibujo = (req, res) => {
  const dibujoId = req.params.id;
  const usuarioId = req.user.id;

  pool.query("DELETE FROM dibujos_notas WHERE id = ? AND usuario_id = ?", [dibujoId, usuarioId], (error, results) => {
    if (error) throw error;
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Dibujo no encontrado o no pertenece al usuario" });
    }
    res.json({ message: "Dibujo eliminado exitosamente" });
  });
};
