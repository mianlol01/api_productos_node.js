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
