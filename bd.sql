CREATE DATABASE Inventario01

USE Inventario01

CREATE TABLE Categoria (
	id INT PRIMARY KEY IDENTITY,
	nombre NVARCHAR(100) NOT NULL
); 

CREATE TABLE Producto (
    id INT PRIMARY KEY IDENTITY,
    nombre NVARCHAR(100) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
	categoria INT NOT NULL FOREIGN KEY REFERENCES Categoria(id), 
    precio_unitario DECIMAL(18, 2) NOT NULL
);

CREATE TABLE CLIENTE (
	id_cliente INT PRIMARY KEY IDENTITY NOT NULL,
	nombre NVARCHAR(100) NOT NULL,
	apellido NVARCHAR(100) NOT NULL,
	telefono NVARCHAR(20) NOT NULL,
)

CREATE TABLE Pedido (
	id_pedido INT PRIMARY KEY IDENTITY NOT NULL,
	id_cliente INT FOREIGN KEY REFERENCES CLIENTE(id_cliente) NOT NULL,
	estado_pedido BIT NOT NULL DEFAULT 0,
	fecha_pedido DATETIME NOT NULL DEFAULT GETDATE(),
	total DECIMAL(18, 2) NOT NULL DEFAULT 0,
)

CREATE TABLE Detalle_Pedido (
	id_pedido INT NOT NULL FOREIGN KEY REFERENCES Pedido(id_pedido),
    id_producto INT NOT NULL FOREIGN KEY REFERENCES Producto(id),
    cantidad INT NOT NULL,
    precio DECIMAL(18, 2) NOT NULL,
    PRIMARY KEY (id_pedido, id_producto)
)

CREATE TYPE dbo.Detalle_PedidoTipo AS TABLE
(
    id_producto INT,
    cantidad INT
);

INSERT INTO Categoria (nombre) VALUES 
('Electrónica'),
('Ropa'),
('Hogar'),
('Libros'),
('Juguetes'),
('Deportes'),
('Alimentos'),
('Belleza'),
('Automóviles'),
('Jardinería');

INSERT INTO Producto (nombre, cantidad, categoria, precio_unitario) VALUES 
('Teléfono móvil', 50, 1, 299.99),
('Camiseta', 100, 2, 19.99),
('Sofá', 20, 3, 499.99),
('Novela', 150, 4, 9.99),
('Muñeca', 75, 5, 14.99),
('Bicicleta', 30, 6, 199.99),
('Manzanas', 200, 7, 1.99),
('Champú', 120, 8, 4.99),
('Llanta', 40, 9, 79.99),
('Cortadora de césped', 10, 10, 149.99);

INSERT INTO Cliente (nombre, apellido, telefono) VALUES
('Juan', 'Pérez', '123-456-7890'),
('María', 'Gómez', '234-567-8901'),
('Carlos', 'López', '345-678-9012'),
('Ana', 'Martínez', '456-789-0123'),
('Luis', 'Fernández', '567-890-1234');

CREATE PROCEDURE InsertarPedidoConProductos
    @id_cliente INT,
    @productosPedido dbo.Detalle_PedidoTipo READONLY
AS
BEGIN
    -- Iniciar una transacción
    BEGIN TRANSACTION;

    -- Insertar el pedido en la tabla Pedido y obtener el id_pedido generado
    DECLARE @id_pedido INT;
    INSERT INTO Pedido (id_cliente)
    VALUES (@id_cliente);
    SET @id_pedido = SCOPE_IDENTITY();

    -- Variable para almacenar el total del pedido
    DECLARE @total DECIMAL(18, 2) = 0;

    -- Insertar los productos en PedidoProducto y calcular el total
    INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad, precio)
    SELECT @id_pedido, p.id_producto, p.cantidad, prod.precio_unitario * p.cantidad
    FROM @productosPedido p
    JOIN Producto prod ON p.id_producto = prod.id;

    -- Calcular el total del pedido
    SELECT @total = SUM(pp.precio)
    FROM Detalle_Pedido pp
    WHERE pp.id_pedido = @id_pedido;

    -- Actualizar el total del pedido en la tabla Pedido
    UPDATE Pedido
    SET total = @total
    WHERE id_pedido = @id_pedido;

    -- Confirmar la transacción
    COMMIT TRANSACTION;

    -- Retornar el id_pedido del pedido insertado
    SELECT @id_pedido AS id_pedido;
END;

--Ejemplo de como usar el Procedimiento para crear un Pedido
-- Declarar una variable de tipo tabla
--DECLARE @productosPedido dbo.Detalle_PedidoTipo;

-- Agregar productos al pedido
--INSERT INTO @productosPedido (id_producto, cantidad) VALUES (6, 2);
--INSERT INTO @productosPedido (id_producto, cantidad) VALUES (3, 3);
--INSERT INTO @productosPedido (id_producto, cantidad) VALUES (4, 5);

-- Llamar al procedimiento almacenado
--EXEC InsertarPedidoConProductos @id_cliente = 2, @productosPedido = @productosPedido;

--Obtener todos los pedidos de un Cliente
CREATE PROCEDURE ObtenerPedidosPorCliente
    @idCliente INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        P.id_pedido,
        P.id_cliente,
        C.nombre AS nombre_cliente,
        C.apellido AS apellido_cliente,
        (
            SELECT 
                PR.nombre AS nombre_producto,
                DP.cantidad,
                PR.precio_unitario,
                (DP.cantidad * DP.precio) AS precio_total
            FROM 
                Detalle_Pedido DP
            INNER JOIN 
                Producto PR ON DP.id_producto = PR.id
            WHERE 
                DP.id_pedido = P.id_pedido
            FOR JSON PATH
        ) AS productos,
        (
            SELECT 
                SUM(DP.cantidad * DP.precio) 
            FROM 
                Detalle_Pedido DP
            WHERE 
                DP.id_pedido = P.id_pedido
        ) AS importe_total
    FROM 
        Pedido P
    INNER JOIN 
        Cliente C ON P.id_cliente = C.id_cliente
    WHERE 
        P.id_cliente = @idCliente
    FOR JSON PATH, ROOT('Pedidos');
END

--Obtener un los detalles de un Pedido
CREATE PROCEDURE ObtenerDetallePedido
    @id_pedido INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        P.id_pedido,
        P.id_cliente,
        C.nombre AS nombre_cliente,
        C.apellido AS apellido_cliente,
        (
            SELECT 
                PR.nombre AS nombre_producto,
                DP.cantidad,
                PR.precio_unitario,
                (DP.cantidad * DP.precio) AS precio_total
            FROM 
                Detalle_Pedido DP
            INNER JOIN 
                Producto PR ON DP.id_producto = PR.id
            WHERE 
                DP.id_pedido = P.id_pedido
            FOR JSON PATH
        ) AS productos,
        (
            SELECT 
                SUM(DP.cantidad * DP.precio) 
            FROM 
                Detalle_Pedido DP
            WHERE 
                DP.id_pedido = P.id_pedido
        ) AS importe_total
    FROM 
        Pedido P
    INNER JOIN 
        Cliente C ON P.id_cliente = C.id_cliente
    WHERE 
        P.id_pedido = @id_pedido
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
END