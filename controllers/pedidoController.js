// Configuración de la conexión
const { config, sql } = require("../connection/connection.js");

// Función para crear un nuevo registro en la tabla Pedido
exports.crearPedido = async (req, res) => {
  const { id_cliente, productos } = req.body;

  if (!id_cliente || !productos || !Array.isArray(productos)) {
    return res.status(400).send("Solicitud incorrecta");
  }

  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Crear una tabla temporal de tipo table-valued
    const table = new sql.Table("Detalle_PedidoTipo");
    table.columns.add("id_producto", sql.Int);
    table.columns.add("cantidad", sql.Int);

    // Agregar los productos a la tabla
    productos.forEach((producto) => {
      table.rows.add(producto.id_producto, producto.cantidad);
    });

    // Ejecutar el procedimiento almacenado
    const request = new sql.Request();
    request.input("id_cliente", sql.Int, id_cliente);
    request.input("productosPedido", table);

    await request.execute("InsertarPedidoConProductos");

    res.send("Pedido insertado correctamente");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al insertar el pedido");
  }
};

exports.listarPedidosCliente = async (req, res) => {
  const idCliente = req.params.idCliente;

  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Crear una instancia de Request
    const request = new sql.Request();

    // Añadir parámetros al request
    request.input("idCliente", sql.Int, idCliente);

    // Ejecutar el procedimiento almacenado
    const result = await request.query(
      "EXEC ObtenerPedidosPorCliente @idCliente"
    );

    // Cerrar la conexión
    await sql.close();

    // Enviar la respuesta JSON al cliente
    res.json(
      JSON.parse(
        result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]
      )
    );
  } catch (err) {
    console.error(
      "Error al ejecutar el procedimiento almacenado:",
      err.message
    );
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

exports.obtenerPedido = async (req, res) => {
  const idPedido = req.params.idPedido;

  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Crear una instancia de Request
    const request = new sql.Request();

    // Añadir parámetros al request
    request.input("id_pedido", sql.Int, idPedido);

    // Ejecutar el procedimiento almacenado
    const result = await request.query("EXEC ObtenerDetallePedido @id_pedido");

    // Cerrar la conexión
    await sql.close();

    // Enviar la respuesta JSON al cliente
    res.json(
      JSON.parse(
        result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]
      )
    );
  } catch (err) {
    console.error(
      "Error al ejecutar el procedimiento almacenado:",
      err.message
    );
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};
