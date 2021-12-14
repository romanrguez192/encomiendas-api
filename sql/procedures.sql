DELIMITER $$

CREATE PROCEDURE validarFechaIngresoTransportador(fechaIngreso DATE)
BEGIN
	IF fechaIngreso > CURDATE() THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fecha de ingreso inválida';
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

DELIMITER ;
