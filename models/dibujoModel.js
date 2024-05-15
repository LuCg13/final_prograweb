const pool = require("../config/db");

exports.obtenerDibujosPorUsuario = (usuarioId, callback) => {
  pool.query("SELECT * FROM dibujos_notas WHERE usuario_id = ?", [usuarioId], callback);
};

exports.crearDibujo = (nuevoDibujo, callback) => {
  pool.query("INSERT INTO dibujos_notas SET ?", nuevoDibujo, callback);
};

exports.eliminarDibujo = (dibujoId, callback) => {
  pool.query("DELETE FROM dibujos_notas WHERE id = ?", [dibujoId], callback);
};
