DELIMITER $$

CREATE PROCEDURE validarFechaIngresoTransportador(fechaIngreso DATE)
BEGIN
	IF fechaIngreso > CURDATE() THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fecha de ingreso inválida';
	END IF;
END$$

CREATE PROCEDURE validarInexistenciaVehiculos(cedulaTransportador VARCHAR(16))
BEGIN
	DECLARE tieneVehiculos BOOLEAN;

	SET tieneVehiculos = EXISTS(
		SELECT *
		FROM Vehiculos AS v
		WHERE v.cedulaTransportador = cedulaTransportador
	);

	IF tieneVehiculos THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede actualizar la licencia del transportador porque tiene vehículos registrados';
	END IF;
END$$

CREATE PROCEDURE validarCedulasRetiro(cedulaCliente VARCHAR(16), cedulaTransportador VARCHAR(16))
BEGIN
	IF NOT (cedulaCliente IS NULL XOR cedulaTransportador IS NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Retiro inválido';
	END IF;
END$$

CREATE PROCEDURE validarTipoEncomienda(tipo VARCHAR(10), idVuelo INT)
BEGIN
	IF tipo = 'aerea' AND idVuelo IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Encomienda aerea inválida';
	ELSEIF tipo = 'terrestre' AND idVuelo IS NOT NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Encomienda terrestre inválida';
	END IF;
END$$

CREATE PROCEDURE validarClientesEncomienda(cedulaEmisor VARCHAR(16), cedulaReceptor VARCHAR(16))
BEGIN
	IF cedulaEmisor = cedulaReceptor THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Encomienda inválida, el emisor debe ser diferente al receptor';
	END IF;
END$$

CREATE PROCEDURE validarNucleosEncomienda(idNucleoOrigen INT, idNucleoDestino INT)
BEGIN
	IF idNucleoOrigen = idNucleoDestino THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Encomienda inválida, los núcleos deben ser diferentes';
	END IF;
END$$

CREATE PROCEDURE validarDisponibilidadTransportador(cedulaTransportador VARCHAR(16))
BEGIN
	DECLARE disponbilidad BOOLEAN;

	SELECT disponible
	INTO disponbilidad
	FROM Transportadores
	WHERE cedula = cedulaTransportador;

	IF NOT disponbilidad THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Encomienda inválida, el transportador no está disponible';
	END IF;
END$$

CREATE PROCEDURE validarLicenciaTransportador(cedulaTransportador VARCHAR(16))
BEGIN
	DECLARE tieneLicencia BOOLEAN;

	SELECT licencia
	INTO tieneLicencia
	FROM Transportadores
	WHERE cedula = cedulaTransportador;

	IF NOT tieneLicencia THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Dueño del vehículo inválido, el transportador no tiene licencia';
	END IF;
END$$

CREATE PROCEDURE validarCapacitacionTransportador(cedulaTransportador VARCHAR(16))
BEGIN
	DECLARE realizoCursos BOOLEAN;

	SET realizoCursos = EXISTS(
		SELECT *
		FROM CursosRealizados AS cr
		WHERE cr.cedulaTransportador = cedulaTransportador
	);

	IF NOT realizoCursos THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Encomienda inválida, el transportador no ha realizado cursos de capacitación';
	END IF;
END$$

CREATE PROCEDURE validarSaldoCliente(cedula VARCHAR(16), saldo DECIMAL(12, 2))
BEGIN
	IF calcularSaldoCliente(cedula) - saldo < 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede efectuar la operación, el cliente no tiene saldo suficiente';
	END IF;
END$$

CREATE PROCEDURE validarSaldoTransportador(cedula VARCHAR(16), saldo DECIMAL(12, 2))
BEGIN
	IF calcularSaldoTransportador(cedula) - saldo < 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede efectuar la operación, el transportador no tiene saldo suficiente';
	END IF;
END$$

DELIMITER ;
