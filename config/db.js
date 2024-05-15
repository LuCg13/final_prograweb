const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "192.168.1.96", // Cambia por tu host si es necesario
  user: "lgomez", // Cambia por tu usuario de MySQL
  password: "MySQL2024*", // Cambia por tu contraseña de MySQL
  database: "dibujos_app",
});

module.exports = pool;
