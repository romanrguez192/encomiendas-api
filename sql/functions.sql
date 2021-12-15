DELIMITER $$

CREATE FUNCTION calcularTarifa(id INT)
RETURNS DECIMAL(12, 2)
BEGIN

END$$

CREATE FUNCTION calcularPrecio(id INT)
RETURNS DECIMAL(12, 2)
BEGIN

END$$

CREATE FUNCTION calcularSaldoCliente(cedula VARCHAR(16))
RETURNS DECIMAL(12, 2)
BEGIN

END$$

CREATE FUNCTION calcularSaldoTransportador(cedula VARCHAR(16))
RETURNS DECIMAL(12, 2)
BEGIN

END$$

CREATE FUNCTION calcularCantidadPedidos(cedula VARCHAR(16))
RETURNS DECIMAL(12, 2)
BEGIN

END$$

-- TODO: Función para calcular lo que le corresponde al transportador por una encomienda

DELIMITER ;