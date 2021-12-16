DELIMITER $$

CREATE FUNCTION calcularTarifa(id INT)
RETURNS DECIMAL(12, 2)
BEGIN
	DECLARE precioBase DECIMAL(10, 2) DEFAULT 5;
	DECLARE precioFragil DECIMAL(10, 2) DEFAULT 7;
	DECLARE precioVolumen DECIMAL(10, 2) DEFAULT 10;
	DECLARE precioPeso DECIMAL(10, 2) DEFAULT 2.5;
	DECLARE tarifa DECIMAL(12, 2) DEFAULT 0;
	DECLARE alto INT;
	DECLARE ancho INT;
	DECLARE profundidad INT;
	DECLARE peso INT;
	DECLARE empaquetado BOOLEAN;
	DECLARE fragil BOOLEAN;

	SELECT p.peso, p.alto, p.ancho, p.profundidad, p.empaquetado, p.fragil 	
	INTO peso, alto, ancho, profundidad, empaquetado, fragil
	FROM Paquetes p 
	WHERE p.id = id;

	IF empaquetado THEN
		SET tarifa = precioVolumen * (alto * ancho * profundidad) + precioPeso * peso + precioBase;
	ELSE 
		SET tarifa = precioPeso * peso + precioBase;
	END IF;

	IF fragil THEN
		SET tarifa = tarifa + precioFragil;
	END IF;

	RETURN tarifa;
END$$

CREATE FUNCTION calcularPrecio(id INT)
RETURNS DECIMAL(12, 2)
BEGIN
	DECLARE precioBase INT DEFAULT 10;
	DECLARE precio INT;

	SELECT SUM(tarifa)
	INTO precio
	FROM Paquetes
	WHERE idEncomienda = id;

	RETURN precio + precioBase;
END$$

CREATE FUNCTION calcularSaldoCliente(cedula VARCHAR(16))
RETURNS DECIMAL(12, 2)
BEGIN
	DECLARE sumaRecargas DECIMAL(12, 2);
	DECLARE sumaRetiros DECIMAL(12, 2);
	DECLARE sumaEncomiendas DECIMAL(12, 2);

	SELECT SUM(saldo)
	INTO sumaRecargas
	FROM Recargas
	WHERE cedulaCliente = cedula;

	SELECT SUM(saldo)
	INTO sumaRetiros
	FROM Retiros
	WHERE cedulaCliente = cedula;

	SELECT SUM(precio)
	INTO sumaEncomiendas
	FROM Encomiendas
	WHERE cedulaEmisor = cedula;

	RETURN sumaRecargas - sumaRetiros - sumaEncomiendas;
END$$

CREATE FUNCTION calcularSaldoTransportador(cedula VARCHAR(16))
RETURNS DECIMAL(12, 2)
BEGIN
	DECLARE sumaComisiones DECIMAL(12, 2);
	DECLARE sumaRetiros DECIMAL(12, 2);

	SELECT SUM(comisionTransportador)
	INTO sumaComisiones
	FROM Encomiendas
	WHERE cedulaTransportador = cedula
	AND status IN ('por retirar', 'entregada');

	SELECT SUM(saldo)
	INTO sumaRetiros
	FROM Retiros
	WHERE cedulaTransportador = cedula;	

	RETURN sumaComisiones - sumaRetiros;
END$$

CREATE FUNCTION calcularCantidadPedidos(cedula VARCHAR(16))
RETURNS INT
BEGIN
	DECLARE cantidad INT;

	SELECT COUNT(*)
	INTO cantidad
	FROM Encomiendas
	WHERE cedulaTransportador = cedula
	AND status IN ('por retirar', 'entregada');

	RETURN cantidad;
END$$

CREATE FUNCTION calcularComisionTransportador(precio DECIMAL(12, 2))
RETURNS DECIMAL(12, 2)
BEGIN
	RETURN 0.2 * precio;
END$$

DELIMITER ;