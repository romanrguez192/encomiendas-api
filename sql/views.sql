-- TODO: Agregar el saldo en la vista de clientes

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

-- Vista de vehículos a motor
CREATE VIEW VistaVehiculosMotor AS
SELECT v.id, v.color, v.placa, v.marca, v.modelo, v.cedulaTransportador, t.nombre AS nombreTransportador, t.apellido AS apellidoTransportador
FROM Vehiculos AS v
JOIN Transportadores AS t
ON v.cedulaTransportador = t.cedula
WHERE tipo = 'motor';

-- Vista de bicicletas
CREATE VIEW VistaBicicletas AS
SELECT v.id, v.color, v.cedulaTransportador, t.nombre AS nombreTransportador, t.apellido AS apellidoTransportador
FROM Vehiculos AS v
JOIN Transportadores AS t
ON v.cedulaTransportador = t.cedula
WHERE tipo = 'bicicleta';

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
