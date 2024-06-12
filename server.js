const express = require("express");
const cors = require("cors");
const productoController = require("./controllers/productoController");
const categoriaController = require("./controllers/categoriaController");
const pedidoController = require("./controllers/pedidoController");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Verificar conexión del servidor
app.get("/", (req, res) => {
  res.send("Hola, Bienvenido al servidor :)");
});

// Endpoint para crear un nuevo registro en la tabla Producto(requiere body: nombre, cantidad, precio)
app.post("/crearProducto", productoController.crearProducto);

// Endpoint para obtener todos los registros de la tabla Producto
app.get("/Productos", productoController.listarProducto);

// Endpoint para obtener un registro por ID de la tabla Producto
app.get("/Producto/:id", productoController.obtenerProducto);

// Endpoint para editar un registro por ID en la tabla Producto
app.put("/editarProducto/:id", productoController.editarProducto);

// Endpoint para eliminar un registro por ID de la tabla Producto
app.delete("/eliminarProducto/:id", productoController.eliminarProducto);

// Endpoint para obtener todos los registros de la tabla Categoria
app.get("/Categorias", categoriaController.listarCategoria);

// Endpoint para obtener un registro por ID de la tabla Categoria
app.get("/Categoria/:id", categoriaController.obtenerCategoria);

// Endpoint para crear un nuevo registro en la tabla Pedido(requiere body: id_cliente, productos[{id, cantidad}])
app.post("/crearPedido", pedidoController.crearPedido);
