const sql = require("mssql");
// Configuración de la conexión
const config = {
  user: "sa",
  password: "123456",
  server: "PC_01",
  database: "Inventario01",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

module.exports = { config, sql };
