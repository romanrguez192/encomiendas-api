-- Dominios
-- Para id: INT AUTO_INCREMENT
-- Para nombres de personas: VARCHAR(20)
-- Para apellidos de personas: VARCHAR(20)
-- Para cédulas: VARCHAR(16)
-- Para teléfonos: VARCHAR(16)
-- Para emails: VARCHAR(64)
-- Para montos: DECIMAL(12, 2) CHECK(VALUE >= 0)
-- Para saldos: DECIMAL(12, 2) CHECK(VALUE >= 0)
-- Para dimensiones, peso: DECIMAL(10, 2) CHECK(VALUE >= 0)

-- Tabla de Clientes
CREATE TABLE Clientes(
	cedula VARCHAR(16) NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellido VARCHAR(20) NOT NULL,
	telefono VARCHAR(16) NOT NULL,
	telefonoAlternativo VARCHAR(16),
	email VARCHAR(64) NOT NULL,
	PRIMARY KEY(cedula)
);

-- Tabla de Recargas de un cliente
CREATE TABLE Recargas(
	id INT NOT NULL AUTO_INCREMENT,
	precio DECIMAL(12, 2) NOT NULL CHECK(precio >= 0),
	fecha DATE NOT NULL,
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
	PRIMARY KEY(id)
);

-- Tabla de Transportadores de la empresa
CREATE TABLE Transportadores(
	cedula VARCHAR(16) NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellido VARCHAR(20) NOT NULL,
	telefono VARCHAR(16) NOT NULL,
	telefonoAlternativo VARCHAR(16),
	email VARCHAR(64) NOT NULL,
	fechaIngreso DATE NOT NULL,
	disponible BOOLEAN NOT NULL,
	antecedentesPenales BOOLEAN NOT NULL,
	licencia BOOLEAN NOT NULL,
	idNucleo INT NOT NULL,
	PRIMARY KEY(cedula),
	FOREIGN KEY(idNucleo) REFERENCES Nucleos(id)
	ON DELETE RESTRICT ON UPDATE CASCADE	
);

-- Tabla de Retiros de clientes y transportadores
CREATE TABLE Retiros(
	id INT NOT NULL AUTO_INCREMENT,
	precio DECIMAL(12, 2) NOT NULL CHECK(precio >= 0),
	fecha DATE NOT NULL,
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
	PRIMARY KEY(id),
	FOREIGN KEY(cedulaTransportador) REFERENCES Transportadores(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de Vuelos para encomiendas aéreas
CREATE TABLE Vuelos(
	id INT NOT NULL AUTO_INCREMENT,
	duracionVuelo INT,
	fechaHoraSalida TIMESTAMP NOT NULL,
	fechaHoraLlegada TIMESTAMP,
	descripcionRetraso VARCHAR(255),
	duracionRetraso INTEGER,
	PRIMARY KEY(id)	
);

-- Tabla de Encomiendas
CREATE TABLE Encomiendas(
	id INT NOT NULL AUTO_INCREMENT,
	cedulaEmisor VARCHAR(16) NOT NULL,
	cedulaReceptor VARCHAR(16) NOT NULL,
	tipo VARCHAR(10) NOT NULL CHECK(tipo IN ('terrestre', 'aereo')),
	status VARCHAR(10) NOT NULL,
	fechaHoraSalida TIMESTAMP NOT NULL,
	fechaHoraLlegada TIMESTAMP,
	-- El idNucleo creo que es solo para los casos en que no lo recoge el cliente hmmm
	-- Por eso le quité el NOT NULL
	idNucleo INT,
	cedulaTransportador VARCHAR(16) NOT NULL,
	idVuelo INT,
	PRIMARY KEY(id),
	FOREIGN KEY (cedulaEmisor) REFERENCES Clientes(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (cedulaReceptor) REFERENCES Clientes(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY(idNucleo) REFERENCES Nucleos(id)
	ON DELETE SET NULL ON UPDATE CASCADE,	
	FOREIGN KEY(cedulaTransportador) REFERENCES Transportadores(cedula)
	ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY(idVuelo) REFERENCES Vuelos(id)
	ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de Paquetes de una encomienda
CREATE TABLE Paquetes(
	id INT NOT NULL AUTO_INCREMENT,
	empaquetado BOOLEAN NOT NULL,
	peso DECIMAL(10,2) NOT NULL CHECK(peso >= 0),
	alto DECIMAL(10,2) CHECK(alto >= 0),
	ancho DECIMAL(10,2) CHECK(ancho >= 0),
	profundidad DECIMAL(10,2) CHECK(profundidad >= 0),
	idEncomienda INT NOT NULL,
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
 