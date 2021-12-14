-- TODO: Definir nomenclatura para los triggers

DELIMITER $$

CREATE TRIGGER TriggerTransportadoresInsert
BEFORE INSERT
ON Transportadores FOR EACH ROW
BEGIN
    CALL validarFechaIngresoTransportador(NEW.fechaIngreso);
END$$

CREATE TRIGGER TriggerTransportadoresUpdate
BEFORE UPDATE
ON Transportadores FOR EACH ROW
BEGIN
    CALL validarFechaIngresoTransportador(NEW.fechaIngreso);
    IF NEW.licencia = FALSE THEN
        CALL validarInexistenciaVehiculos(NEW.cedula);
    END IF;
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
    CALL validarClientesEncomienda(NEW.cedulaEmisor, NEW.cedulaReceptor);
    CALL validarNucleosEncomienda(NEW.idNucleoOrigen, NEW.idNucleoDestino);
    CALL validarDisponibilidadTransportador(NEW.cedulaTransportador);
    CALL validarCapacitacionTransportador(NEW.cedulaTransportador);
END$$

CREATE TRIGGER TriggerEncomiendasUpdate
BEFORE UPDATE
ON Encomiendas FOR EACH ROW
BEGIN
    CALL validarTipoEncomienda(NEW.tipo, NEW.idVuelo);
    CALL validarClientesEncomienda(NEW.cedulaEmisor, NEW.cedulaReceptor);
    CALL validarNucleosEncomienda(NEW.idNucleoOrigen, NEW.idNucleoDestino);
    CALL validarDisponibilidadTransportador(NEW.cedulaTransportador);
    CALL validarCapacitacionTransportador(NEW.cedulaTransportador);
END$$

CREATE TRIGGER TriggerVehiculosInsert
BEFORE INSERT
ON Vehiculos FOR EACH ROW
BEGIN
    IF NEW.tipo = 'motor' THEN
        CALL validarLicenciaTransportador(NEW.cedulaTransportador);
    END IF;
END$$

CREATE TRIGGER TriggerVehiculosInsert
BEFORE UPDATE
ON Vehiculos FOR EACH ROW
BEGIN
    IF NEW.tipo = 'motor' THEN
        CALL validarLicenciaTransportador(NEW.cedulaTransportador);
    END IF;
END$$

DELIMITER ;
