DELIMITER $$

CREATE TRIGGER TriggerTransportadoresBeforeInsert
BEFORE INSERT
ON Transportadores FOR EACH ROW
BEGIN
    CALL validarFechaIngresoTransportador(NEW.fechaIngreso);
END$$

CREATE TRIGGER TriggerTransportadoresBeforeUpdate
BEFORE UPDATE
ON Transportadores FOR EACH ROW
BEGIN
    CALL validarFechaIngresoTransportador(NEW.fechaIngreso);
    IF NOT NEW.licencia THEN
        CALL validarInexistenciaVehiculos(NEW.cedula);
    END IF;
END$$

CREATE TRIGGER TriggerRetirosBeforeInsert
BEFORE INSERT
ON Retiros FOR EACH ROW
BEGIN
    CALL validarCedulasRetiro(NEW.cedulaCliente, NEW.cedulaTransportador);

    IF NEW.cedulaCliente IS NOT NULL THEN
        CALL validarSaldoCliente(NEW.cedulaCliente, NEW.saldo);
    ELSE
        CALL validarSaldoTransportador(NEW.cedulaTransportador, NEW.saldo);
    END IF;

    SET NEW.saldo = convertirPrecio(NEW.precio);
END$$

CREATE TRIGGER TriggerRetirosBeforeUpdate
BEFORE UPDATE
ON Retiros FOR EACH ROW
BEGIN
    CALL validarCedulasRetiro(NEW.cedulaCliente, NEW.cedulaTransportador);

    IF NEW.cedulaCliente IS NOT NULL THEN
        CALL validarSaldoCliente(NEW.cedulaCliente, NEW.saldo);
    ELSE
        CALL validarSaldoTransportador(NEW.cedulaTransportador, NEW.saldo);
    END IF;

    SET NEW.saldo = convertirPrecio(NEW.precio);
END$$

CREATE TRIGGER TriggerRecargasBeforeInsert
BEFORE INSERT
ON Recargas FOR EACH ROW
BEGIN
    SET NEW.saldo = convertirPrecio(NEW.precio);
END$$

CREATE TRIGGER TriggerRecargasBeforeUpdate
BEFORE UPDATE
ON Recargas FOR EACH ROW
BEGIN
    SET NEW.saldo = convertirPrecio(NEW.precio);
END$$

CREATE TRIGGER TriggerEncomiendasBeforeInsert
BEFORE INSERT
ON Encomiendas FOR EACH ROW
BEGIN
    CALL validarTipoEncomienda(NEW.tipo, NEW.idVuelo);
    CALL validarClientesEncomienda(NEW.cedulaEmisor, NEW.cedulaReceptor);
    CALL validarNucleosEncomienda(NEW.idNucleoOrigen, NEW.idNucleoDestino);
    CALL validarDisponibilidadTransportador(NEW.cedulaTransportador);
    CALL validarCapacitacionTransportador(NEW.cedulaTransportador);
    SET NEW.comisionTransportador = calcularComisionTransportador(NEW.precio);
END$$

CREATE TRIGGER TriggerEncomiendasBeforeUpdate
BEFORE UPDATE
ON Encomiendas FOR EACH ROW
BEGIN
    CALL validarTipoEncomienda(NEW.tipo, NEW.idVuelo);
    CALL validarClientesEncomienda(NEW.cedulaEmisor, NEW.cedulaReceptor);
    CALL validarNucleosEncomienda(NEW.idNucleoOrigen, NEW.idNucleoDestino);
    CALL validarDisponibilidadTransportador(NEW.cedulaTransportador);
    CALL validarCapacitacionTransportador(NEW.cedulaTransportador);
    SET NEW.comisionTransportador = calcularComisionTransportador(NEW.precio);
END$$

CREATE TRIGGER TriggerVehiculosBeforeInsert
BEFORE INSERT
ON Vehiculos FOR EACH ROW
BEGIN
    IF NEW.tipo = 'motor' THEN
        CALL validarLicenciaTransportador(NEW.cedulaTransportador);
    END IF;
END$$

CREATE TRIGGER TriggerVehiculosBeforeUpdate
BEFORE UPDATE
ON Vehiculos FOR EACH ROW
BEGIN
    IF NEW.tipo = 'motor' THEN
        CALL validarLicenciaTransportador(NEW.cedulaTransportador);
    END IF;
END$$

CREATE TRIGGER TriggerArticulosBeforeInsert
BEFORE INSERT
ON Articulos FOR EACH ROW
BEGIN
    SET NEW.numero = calcularNumeroArticulo(NEW.idPaquete);
END$$

CREATE TRIGGER TriggerPaquetesBeforeInsert
BEFORE INSERT
ON Paquetes FOR EACH ROW
BEGIN
    SET NEW.tarifa = calcularTarifa(NEW.alto, NEW.ancho, NEW.profundidad, NEW.peso, NEW.empaquetado, NEW.fragil);
END$$

CREATE TRIGGER TriggerPaquetesAfterInsert
AFTER INSERT
ON Paquetes FOR EACH ROW
BEGIN
    CALL actualizarPrecio(NEW.idEncomienda);
END$$

CREATE TRIGGER TriggerPaquetesBeforeUpdate
BEFORE UPDATE
ON Paquetes FOR EACH ROW
BEGIN
    SET NEW.tarifa = calcularTarifa(NEW.alto, NEW.ancho, NEW.profundidad, NEW.peso, NEW.empaquetado, NEW.fragil);
END$$

CREATE TRIGGER TriggerPaquetesAfterUpdate
AFTER UPDATE
ON Paquetes FOR EACH ROW
BEGIN
    CALL actualizarPrecio(NEW.idEncomienda);
END$$

CREATE TRIGGER TriggerPaquetesAfterDelete
AFTER DELETE
ON Paquetes FOR EACH ROW
BEGIN
    CALL actualizarPrecio(OLD.idEncomienda);
END$$

DELIMITER ;
