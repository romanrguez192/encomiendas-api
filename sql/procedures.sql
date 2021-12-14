DELIMITER $$

CREATE PROCEDURE validarFechaIngreso(fechaIngreso DATE)
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

DELIMITER ;
