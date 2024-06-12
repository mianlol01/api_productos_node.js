// Configuración de la conexión
const { config, sql } = require("../connection/connection.js");

// Función para obtener todos los registros de la tabla Categoria
exports.listarCategoria = async (req, res) => {
  // Lógica para obtener registros
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM Categoria");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Función para obtener un registro por ID de la tabla Categoria
exports.obtenerCategoria = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); //Obtener la ID de los parámetros de la URL
    if (isNaN(id)) {
      return res.status(400).send("Invalid ID");
    }

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, id) // Pasar la ID como parámetro en la consulta SQL
      .query("SELECT * FROM Categoria WHERE id = @id");

    if (result.recordset.length === 0) {
      // Respuesta en caso no exista la ID
      return res.status(404).send("Record not found");
    }
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
