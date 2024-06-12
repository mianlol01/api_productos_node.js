# Simple api para gestionar simples productos

## Endpoints

Crear un producto, requiere body: nombre, cantidad, precio

"/crearProducto"

Obtener todos los productos

"/Productos"

Obtener un producto por ID

"/Producto/:id"

Editar un producto por ID, requiere body: nombre, cantidad, precio

"/editarProducto/:id"

Eliminar un producto por ID(luego de eliminar dicho producto, su id quedará inutilizable, nose, así es sql server)

"/eliminarProducto/:id"

Obtener todas las categorias

"/Categoria/:id"

Crear un pedido(requiere body: id_cliente, productos[{id,cantidad}])

"/crearPedido"

Ejemplo
{
    "id_cliente": 2,
    "productos": [
        { "id_producto": 6, "cantidad": 2 },
        { "id_producto": 3, "cantidad": 3 },
        { "id_producto": 4, "cantidad": 5 }
    ]
}

## Instalación:

-Clonar este repositorio

-Instalar dependencias, requiere node.js

  $npm install
  
-Crear la base de datos(bd.txt), sql server necesario

-Configurar los atributos de la conexión en connection.js

-Ejecutar el servidor

  $node server.js
  
-Probar las endpoints
