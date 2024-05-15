const pool = require("../config/db");

exports.buscarUsuarioPorNombre = (nombreUsuario, callback) => {
  pool.query("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombreUsuario], callback);
};

exports.crearUsuario = (nuevoUsuario, callback) => {
  pool.query("INSERT INTO usuarios SET ?", nuevoUsuario, callback);
};
