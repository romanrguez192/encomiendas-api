-- Dominios
-- Para id: INT AUTO_INCREMENT
-- Para nombres de personas: VARCHAR(20)
-- Para apellidos de personas: VARCHAR(20)
-- Para cédulas: VARCHAR(16)
-- Para teléfonos: VARCHAR(16)
-- Para emails: VARCHAR(64)
-- Para montos: DECIMAL(12, 2) CHECK(VALUE >= 0)
-- Para saldos: DECIMAL(12, 2) CHECK(VALUE >= 0)
-- Para dimensiones (cm), peso (g): INT CHECK(VALUE >= 0)

 -- Tabla de Direcciones
 CREATE TABLE Direcciones(
 	id INT NOT NULL AUTO_INCREMENT,
 	pais VARCHAR(50) NOT NULL,
 	estado VARCHAR(50) NOT NULL,
 	ciudad VARCHAR(50) NOT NULL,
 	parroquia VARCHAR(50) NOT NULL,
 	PRIMARY KEY(id)
 );

-- Tabla de Clientes
CREATE TABLE Clientes(
	cedula VARCHAR(16) NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellido VARCHAR(20) NOT NULL,
	telefono VARCHAR(16) NOT NULL,
	telefonoAlternativo VARCHAR(16),
	email VARCHAR(64) UNIQUE NOT NULL,
	idDireccion INT NOT NULL,
	PRIMARY KEY(cedula),
	FOREIGN KEY(idDireccion) REFERENCES Direcciones(id)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Recargas de un cliente
CREATE TABLE Recargas(
	id INT NOT NULL AUTO_INCREMENT,
	precio DECIMAL(12, 2) NOT NULL CHECK(precio >= 0),
	fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
	saldo DECIMAL(12, 2) NOT NULL CHECK(saldo >= 0),
	cedulaCliente VARCHAR(16) NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(cedulaCliente) REFERENCES Clientes(cedula)
	ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de Núcleos de la empresa
CREATE TABLE Nucleos(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	telefono VARCHAR(16) NOT NULL,
	idDireccion INT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(idDireccion) REFERENCES Direcciones(id)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Transportadores de la empresa
CREATE TABLE Transportadores(
	cedula VARCHAR(16) NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellido VARCHAR(20) NOT NULL,
	telefono VARCHAR(16) NOT NULL,
	telefonoAlternativo VARCHAR(16),
	email VARCHAR(64) UNIQUE NOT NULL,
	fechaIngreso DATE NOT NULL,
	disponible BOOLEAN NOT NULL,
	antecedentesPenales BOOLEAN NOT NULL,
	licencia BOOLEAN NOT NULL,
	idNucleo INT NOT NULL,
	idDireccion INT NOT NULL,
	PRIMARY KEY(cedula),
	FOREIGN KEY(idDireccion) REFERENCES Direcciones(id)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY(idNucleo) REFERENCES Nucleos(id)
	ON DELETE RESTRICT ON UPDATE CASCADE	
);

-- Tabla de Retiros de clientes y transportadores
CREATE TABLE Retiros(
	id INT NOT NULL AUTO_INCREMENT,
	precio DECIMAL(12, 2) NOT NULL CHECK(precio >= 0),
	fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
	saldo DECIMAL(12, 2) NOT NULL CHECK(saldo >= 0),
	cedulaCliente VARCHAR(16),
	cedulaTransportador VARCHAR(16),
	PRIMARY KEY(id),
	FOREIGN KEY(cedulaCliente) REFERENCES Clientes(cedula)
	ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(cedulaTransportador) REFERENCES Transportadores(cedula)
	ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de Cursos para los transportadores
CREATE TABLE Cursos(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	lugar VARCHAR(100) NOT NULL,
	fecha DATE NOT NULL,
	PRIMARY KEY(id)
);

-- Tabla de Vehículos de los transportadores
CREATE TABLE Vehiculos(
	id INT NOT NULL AUTO_INCREMENT,
	color VARCHAR(20) NOT NULL,
	tipo VARCHAR(10) NOT NULL CHECK(tipo IN ('motor', 'bicicleta')),
	marca VARCHAR(20),
	modelo VARCHAR(20),
	placa VARCHAR(10),
	cedulaTransportador VARCHAR(16) NOT NULL,
	-- Marca, modelo y placa son NOT NULL para motor, pero para bicicleta son NULL
	CONSTRAINT tipoVehiculoValido
	CHECK(
		((tipo != 'motor') OR (modelo IS NOT NULL AND marca IS NOT NULL AND placa IS NOT NULL))
		AND
		((tipo != 'bicicleta') OR (modelo IS NULL AND marca IS NULL AND placa IS NULL))
	),
	PRIMARY KEY(id),
	FOREIGN KEY(cedulaTransportador) REFERENCES Transportadores(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Vuelos para encomiendas aéreas
CREATE TABLE Vuelos(
	id INT NOT NULL AUTO_INCREMENT,
	-- Duración del vuelo en minutos
	duracionVuelo INT CHECK(duracionVuelo > 0),
	fechaHoraSalidaEstimada TIMESTAMP NOT NULL DEFAULT 0,
	fechaHoraLlegadaEstimada TIMESTAMP NOT NULL DEFAULT 0,
	idDireccionOrigen INT NOT NULL,
	idDireccionDestino INT NOT NULL,
	descripcionRetraso VARCHAR(255),
	-- Duración del retraso en minutos
	duracionRetraso INTEGER,
	-- Si hubo retraso, ambos campos son NOT NULL, de lo contrario ambos son NULL
	CONSTRAINT retrasoValido
	CHECK(NOT(descripcionRetraso IS NULL XOR duracionRetraso IS NULL)),
	CONSTRAINT fechasVueloValidas
	CHECK(fechaHoraSalidaEstimada < fechaHoraLlegadaEstimada),
	PRIMARY KEY(id),
	FOREIGN KEY(idDireccionOrigen) REFERENCES Direcciones(id)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY(idDireccionDestino) REFERENCES Direcciones(id)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Encomiendas
CREATE TABLE Encomiendas(
	id INT NOT NULL AUTO_INCREMENT,
	cedulaEmisor VARCHAR(16) NOT NULL,
	cedulaReceptor VARCHAR(16) NOT NULL,
	tipo VARCHAR(10) NOT NULL CHECK(tipo IN ('terrestre', 'aerea')),
	status VARCHAR(12) NOT NULL CHECK(status IN ('asignada', 'en camino', 'por retirar', 'entregada')),
	fechaHoraSalida TIMESTAMP NOT NULL DEFAULT 0,
	fechaHoraLlegada TIMESTAMP NULL,
	idNucleoOrigen INT NOT NULL,
	idNucleoDestino INT NOT NULL,
	cedulaTransportador VARCHAR(16) NOT NULL,
	idVuelo INT,
	precio DECIMAL(12, 2),
	comisionTransportador DECIMAL(12, 2),
	CONSTRAINT fechasEncomiendaValidas
	CHECK(fechaHoraSalida < fechaHoraLlegada),
	CONSTRAINT fechaHoraLlegadaValida
	CHECK(
		-- Si la encomienda no está por retirar ni entregada, entonces la fecha de llegada es nula
		(status IN ('por retirar', 'entregada') OR fechaHoraLlegada IS NULL)
		AND
		-- Y si la encomienda está por retirar o entregada, entonces la fecha de llegada no es nula
		(status NOT IN ('por retirar', 'entregada') OR fechaHoraLlegada IS NOT NULL)
	),
	PRIMARY KEY(id),
	FOREIGN KEY (cedulaEmisor) REFERENCES Clientes(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (cedulaReceptor) REFERENCES Clientes(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY(idNucleoOrigen) REFERENCES Nucleos(id)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY(idNucleoDestino) REFERENCES Nucleos(id)
	ON DELETE RESTRICT ON UPDATE CASCADE,	
	FOREIGN KEY(cedulaTransportador) REFERENCES Transportadores(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY(idVuelo) REFERENCES Vuelos(id)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Paquetes de una encomienda
CREATE TABLE Paquetes(
	id INT NOT NULL AUTO_INCREMENT,
	empaquetado BOOLEAN NOT NULL,
	-- Peso en gramos
	peso INT NOT NULL CHECK(peso >= 0),
	-- Dimensiones en centímetros
	alto INT CHECK(alto >= 0),
	ancho INT CHECK(ancho >= 0),
	profundidad INT CHECK(profundidad >= 0),
	fragil BOOLEAN NOT NULL,
	idEncomienda INT NOT NULL,
	tarifa DECIMAL(12, 2) NOT NULL,
	CONSTRAINT empaquetadoValido
	CHECK(
		(empaquetado OR (alto IS NULL AND ancho IS NULL AND profundidad IS NULL))
		AND
		(NOT empaquetado OR (alto IS NOT NULL AND ancho IS NOT NULL AND profundidad IS NOT NULL))
	),
	PRIMARY KEY(id),
	FOREIGN KEY(idEncomienda) REFERENCES Encomiendas(id)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Articulos de un paquete
CREATE TABLE Articulos(
	idPaquete INT NOT NULL,
	numero INT NOT NULL,
	cantidad INT NOT NULL CHECK(cantidad > 0),
	descripcion VARCHAR(255) NOT NULL,
	PRIMARY KEY(idPaquete, numero),
	FOREIGN KEY(idPaquete) REFERENCES Paquetes(id)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Cursos Realizados por los transportadores 
CREATE TABLE CursosRealizados(
	cedulaTransportador VARCHAR(16) NOT NULL,
	idCurso INT NOT NULL,
	PRIMARY KEY(cedulaTransportador, idCurso),
	FOREIGN KEY(cedulaTransportador) REFERENCES Transportadores(cedula)
	ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(idCurso) REFERENCES Cursos(id)
	ON DELETE CASCADE ON UPDATE CASCADE	
);
 