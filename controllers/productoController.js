// Configuración de la conexión
const { config, sql } = require("../connection/connection.js");

// Función para crear un nuevo registro en la tabla Producto
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, cantidad, precio_unitario } = req.body; // Obtener los datos del cuerpo de la solicitud

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("nombre", sql.NVarChar(100), nombre) // Pasar el nombre como parámetro en la consulta SQL
      .input("cantidad", sql.Int, cantidad) // Pasar la cantidad como parámetro en la consulta SQL
      .input("precio_unitario", sql.Decimal(18, 2), precio_unitario) // Pasar el precio_unitario como parámetro en la consulta SQL
      .query(
        "INSERT INTO Producto (nombre, cantidad, precio_unitario) VALUES (@nombre, @cantidad, @precio_unitario)"
      ); // Insertar un nuevo registro con los datos proporcionados

    // Verificar si se creó el registro
    if (result.rowsAffected.length === 0) {
      res.status(500).json({ error: "Error al crear el registro" }); // No se creó ningún registro, enviar estado 500
    } else {
      res.json({ message: "Registro creado correctamente" }); // Se creó el registro correctamente
    }
  } catch (err) {
    res.status(500).send(err.message); // Error interno del servidor
  }
};
// Función para obtener todos los registros de la tabla Producto
exports.listarProducto = async (req, res) => {
  // Lógica para obtener registros
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM Producto");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
// Función para obtener un registro por ID de la tabla Producto
exports.obtenerProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); //Obtener la ID de los parámetros de la URL
    if (isNaN(id)) {
      return res.status(400).send("Invalid ID");
    }

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, id) // Pasar la ID como parámetro en la consulta SQL
      .query("SELECT * FROM Producto WHERE id = @id");

    if (result.recordset.length === 0) {
      // Respuesta en caso no exista la ID
      return res.status(404).send("Record not found");
    }
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
// Función para editar un registro por ID en la tabla Producto
exports.editarProducto = async (req, res) => {
  try {
    const { id } = req.params; // Obtener la ID de los parámetros de la URL
    const { nombre, cantidad, precio_unitario } = req.body; // Obtener los nuevos datos del cuerpo de la solicitud

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, id) // Pasar la ID como parámetro en la consulta SQL
      .input("nombre", sql.NVarChar(50), nombre) // Pasar el nuevo nombre como parámetro
      .input("cantidad", sql.Int, cantidad) // Pasar la nueva cantidad como parámetro
      .input("precio_unitario", sql.Decimal(18, 2), precio_unitario) // Pasar el nuevo precio_unitario como parámetro
      .query(
        "UPDATE Producto SET nombre = @nombre, cantidad = @cantidad, precio_unitario = @precio_unitario WHERE id = @id"
      ); // Actualizar el registro

    // Verificar si se actualizó algún registro
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: "Registro no encontrado" }); // No se actualizó ningún registro, enviar estado 404
    } else {
      res.json({ message: "Registro actualizado correctamente" }); // Se actualizó el registro correctamente
    }
  } catch (err) {
    res.status(500).send(err.message); // Error interno del servidor
  }
};
// Función para eliminar un registro por ID de la tabla Producto
exports.eliminarProducto = async (req, res) => {
  // Lógica para eliminar un registro por ID
  try {
    const { id } = req.params; // Obtener la ID de los parámetros de la URL

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, id) // Pasar la ID como parámetro en la consulta SQL
      .query("DELETE FROM Producto WHERE id = @id"); // Eliminar el registro con la ID proporcionada

    // Verificar si se eliminó algún registro
    if (result.rowsAffected.length === 0) {
      res.status(404).json({ error: "Registro no encontrado" }); // No se eliminó ningún registro, enviar estado 404
    } else if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: "Registro no encontrado" }); // No se eliminó ningún registro, enviar estado 404
    } else {
      res.json({ message: "Registro eliminado correctamente" }); // Se eliminó el registro correctamente
    }
  } catch (err) {
    res.status(500).send(err.message); // Error interno del servidor
  }
};
