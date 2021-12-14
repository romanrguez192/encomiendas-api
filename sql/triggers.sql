-- TODO: Definir nomenclatura para los triggers

DELIMITER $$

CREATE TRIGGER TriggerTransportadoresInsert
BEFORE INSERT
ON Transportadores FOR EACH ROW
BEGIN
    CALL validarFechaIngreso(NEW.fechaIngreso);
END$$

CREATE TRIGGER TriggerTransportadoresUpdate
BEFORE UPDATE
ON Transportadores FOR EACH ROW
BEGIN
    CALL validarFechaIngreso(NEW.fechaIngreso);
END$$

CREATE TRIGGER TriggerRetirosInsert
BEFORE INSERT
ON Retiros FOR EACH ROW
BEGIN
    CALL validarCedulasRetiro(NEW.cedulaCliente, NEW.cedulaTransportador);
END$$

CREATE TRIGGER TriggerRetirosUpdate
BEFORE UPDATE
ON Retiros FOR EACH ROW
BEGIN
    CALL validarCedulasRetiro(NEW.cedulaCliente, NEW.cedulaTransportador);
END$$

CREATE TRIGGER TriggerEncomiendasInsert
BEFORE INSERT
ON Encomiendas FOR EACH ROW
BEGIN
    CALL validarTipoEncomienda(NEW.tipo, NEW.idVuelo);
END$$

CREATE TRIGGER TriggerEncomiendasUpdate
BEFORE UPDATE
ON Encomiendas FOR EACH ROW
BEGIN
    CALL validarTipoEncomienda(NEW.tipo, NEW.idVuelo);
END$$

DELIMITER ;
