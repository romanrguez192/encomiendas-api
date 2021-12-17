-- Vista de clientes
CREATE VIEW VistaClientes AS 
SELECT c.*, d.parroquia, d.ciudad, d.estado, d.pais, calcularSaldoCliente(c.cedula) AS saldo
FROM Clientes AS c
JOIN Direcciones AS d
ON c.idDireccion = d.id;

-- Vista de transportadores
CREATE VIEW VistaTransportadores AS
SELECT t.*, d.parroquia, d.ciudad, d.estado, d.pais, n.nombre AS nombreNucleo, calcularSaldoTransportador(t.cedula) AS saldo, calcularCantidadPedidos(t.cedula) AS cantidadPedidos
FROM Transportadores AS t
JOIN Direcciones AS d
ON t.idDireccion = d.id
JOIN Nucleos AS n
ON t.idNucleo = n.id;

-- Vista de recargas
CREATE VIEW VistaRecargas AS
SELECT r.*, c.nombre AS nombreCliente, c.apellido AS apellidoCliente
FROM Recargas AS r
JOIN Clientes AS c
ON r.cedulaCliente = c.cedula;

-- Vista de retiros de clientes
CREATE VIEW VistaRetirosClientes AS
SELECT r.id, r.precio, r.saldo, r.fecha, r.cedulaCliente, c.nombre AS nombreCliente, c.apellido AS apellidoCliente
FROM Retiros AS r
JOIN Clientes AS c
ON r.cedulaCliente = c.cedula;

-- Vita de retiros de transportadores
CREATE VIEW VistaRetirosTransportadores AS
SELECT r.id, r.precio, r.saldo, r.fecha, r.cedulaTransportador, t.nombre AS nombreTransportador, t.apellido AS apellidoTransportador
FROM Retiros AS r
JOIN Transportadores AS t
ON r.cedulaTransportador = t.cedula;

-- TODO: Vista de vehículos genérica
CREATE VIEW VistaVehiculos AS
SELECT v.id, v.color, v.tipo, v.placa, v.marca, v.modelo, v.cedulaTransportador, t.nombre AS nombreTransportador, t.apellido AS apellidoTransportador
FROM Vehiculos AS v
JOIN Transportadores AS t
ON v.cedulaTransportador = t.cedula;

-- Vista de vehículos a motor
CREATE VIEW VistaVehiculosMotor AS
SELECT v.id, v.color, v.placa, v.marca, v.modelo, v.cedulaTransportador, v.nombreTransportador, v.apellidoTransportador
FROM VistaVehiculos AS v
WHERE v.tipo = 'motor';

-- Vista de bicicletas
CREATE VIEW VistaBicicletas AS
SELECT v.id, v.color, v.cedulaTransportador, v.nombreTransportador, v.apellidoTransportador
FROM VistaVehiculos AS v
WHERE v.tipo = 'bicicleta';

-- Vista de núcleos
CREATE VIEW VistaNucleos AS 
SELECT n.*, d.parroquia, d.ciudad, d.estado, d.pais
FROM Nucleos AS n
JOIN Direcciones AS d
ON n.idDireccion = d.id;

-- Vista de cursos realizados
CREATE VIEW VistaCursosRealizados AS
SELECT c.*, t.cedula AS cedulaTransportador, t.nombre AS nombreTransportador, t.apellido AS apellidoTransportador
FROM Cursos AS c
LEFT JOIN CursosRealizados AS cr
ON c.id = cr.idCurso
LEFT JOIN Transportadores AS t
ON cr.cedulaTransportador = t.cedula;

-- Vista de vuelos
CREATE VIEW VistaVuelos AS
SELECT v.id, v.idDireccionOrigen, do.parroquia AS parroquiaOrigen, do.ciudad AS ciudadOrigen, do.estado AS estadoOrigen, do.pais AS paisOrigen,
v.idDireccionDestino, dd.parroquia AS parroquiaDestino, dd.ciudad AS ciudadDestino, dd.estado AS estadoDestino, dd.pais AS paisDestino,
v.fechaHoraSalidaEstimada, v.fechaHoraLlegadaEstimada, descripcionRetraso IS NOT NULL AS retraso, v.descripcionRetraso, v.duracionRetraso, v.duracionVuelo,
calcularFechaHoraSalidaReal(v.fechaHoraSalidaEstimada, v.duracionRetraso, v.duracionVuelo) AS fechaHoraSalidaReal,
calcularFechaHoraLlegadaReal(v.fechaHoraSalidaEstimada, v.duracionRetraso, v.duracionVuelo) AS fechaHoraLlegadaReal
FROM Vuelos AS v
JOIN Direcciones AS do
ON v.idDireccionOrigen = do.id
JOIN Direcciones AS dd
ON v.idDireccionDestino = dd.id;

-- Vista de detalles completos de als encomiendas
CREATE VIEW VistaEncomiendas AS
SELECT e.id, e.cedulaEmisor, ce.nombre AS nombreEmisor, ce.apellido AS apellidoEmisor,
e.cedulaReceptor, cr.nombre AS nombreReceptor, cr.apellido AS apellidoReceptor,
e.tipo, e.status, e.fechaHoraSalida, e.fechaHoraLlegada,
e.idNucleoOrigen, no.nombre AS nombreNucleoOrigen,
e.idNucleoDestino, nd.nombre AS nombreNucleoDestino,
e.cedulaTransportador, t.nombre AS nombreTransportador, t.apellido AS apellidoTransportador,
e.idVuelo, v.idDireccionOrigen, v.parroquiaOrigen, v.ciudadOrigen, v.estadoOrigen, v.paisOrigen,
v.idDireccionDestino, v.parroquiaDestino, v.ciudadDestino, v.estadoDestino, v.paisDestino,
v.fechaHoraSalidaEstimada, v.fechaHoraLlegadaEstimada, v.retraso, v.descripcionRetraso, v.duracionRetraso,
v.duracionVuelo, v.fechaHoraSalidaReal, v.fechaHoraLlegadaReal,
e.precio, e.comisionTransportador,
p.id AS idPaquete, p.empaquetado, p.peso, p.alto, p.ancho, p.profundidad, p.fragil, p.tarifa,
a.numero AS numeroArticulo, a.cantidad, a.descripcion
FROM Encomiendas AS e
JOIN Clientes AS ce
ON e.cedulaEmisor = ce.cedula
JOIN Clientes AS cr
ON e.cedulaReceptor = cr.cedula
JOIN Nucleos AS no
ON e.idNucleoOrigen = no.id
JOIN Nucleos AS nd
ON e.idNucleoDestino = nd.id
JOIN Transportadores AS t
ON e.cedulaTransportador = t.cedula
LEFT JOIN VistaVuelos AS v
ON e.idVuelo = v.id
LEFT JOIN Paquetes AS p
ON e.id = p.idEncomienda
LEFT JOIN Articulos AS a
ON p.id = a.idPaquete;

-- Vista de encomiendas aéreas
CREATE VIEW VistaEncomiendasAereas AS
SELECT e.id, e.cedulaEmisor, e.nombreEmisor, e.apellidoEmisor,
e.cedulaReceptor, e.nombreReceptor, e.apellidoReceptor,
e.status, e.fechaHoraSalida, e.fechaHoraLlegada,
e.idNucleoOrigen, e.nombreNucleoOrigen,
e.idNucleoDestino, e.nombreNucleoDestino,
e.cedulaTransportador, e.nombreTransportador, e.apellidoTransportador,
e.idVuelo, e.idDireccionOrigen, e.parroquiaOrigen, e.ciudadOrigen, e.estadoOrigen, e.paisOrigen,
e.idDireccionDestino, e.parroquiaDestino, e.ciudadDestino, e.estadoDestino, e.paisDestino,
e.fechaHoraSalidaEstimada, e.fechaHoraLlegadaEstimada, e.retraso, e.descripcionRetraso, e.duracionRetraso,
e.duracionVuelo, e.fechaHoraSalidaReal, e.fechaHoraLlegadaReal,
e.precio, e.comisionTransportador,
e.idPaquete, e.empaquetado, e.peso, e.alto, e.ancho, e.profundidad, e.fragil, e.tarifa,
e.numeroArticulo, e.cantidad, e.descripcion
FROM VistaEncomiendas AS e
WHERE e.tipo = 'aerea';

-- Vista de encomiendas terrestres
CREATE VIEW VistaEncomiendasTerrestres AS
SELECT e.id, e.cedulaEmisor, e.nombreEmisor, e.apellidoEmisor,
e.cedulaReceptor, e.nombreReceptor, e.apellidoReceptor,
e.status, e.fechaHoraSalida, e.fechaHoraLlegada,
e.idNucleoOrigen, e.nombreNucleoOrigen,
e.idNucleoDestino, e.nombreNucleoDestino,
e.cedulaTransportador, e.nombreTransportador, e.apellidoTransportador,
e.precio, e.comisionTransportador,
e.idPaquete, e.empaquetado, e.peso, e.alto, e.ancho, e.profundidad, e.fragil, e.tarifa,
e.numeroArticulo, e.cantidad, e.descripcion
FROM VistaEncomiendas AS e
WHERE e.tipo = 'terrestre';
