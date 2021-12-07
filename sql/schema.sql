
CREATE TABLE `Clientes`(
	`cedula` VARCHAR(15) NOT NULL,
	`nombre`VARCHAR(20) NOT NULL,
  `apellido`VARCHAR(20) NOT NULL,
	`saldo` DECIMAL(10,2) NOT NULL CHECK(`saldo`>=0),
	`telefono` VARCHAR(15) NOT NULL,
	`telefonoAlternativo` VARCHAR(15),
	`email` VARCHAR(20) NOT NULL,
	PRIMARY KEY (`cedula`)
);

CREATE TABLE `Recargas`(
	`id` int(0) NOT NULL AUTO_INCREMENT,
	`precio` DECIMAL(10,2) NOT NULL CHECK(`precio`>=0),
	`fecha` DATE NOT NULL,
	-- No estoy segura con la cantidad de saldo
	`cantidadSaldo` DECIMAL(10,2) NOT NULL CHECK(`cantidadSaldo`>=0),
	`cedulaCliente`VARCHAR(15) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`cedulaCliente`) REFERENCES `Clientes` (`cedula`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Nucleos`(
	`id` int(0) NOT NULL AUTO_INCREMENT,
	`nombre`VARCHAR(50) NOT NULL,
	`telefono` VARCHAR(15) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Transportadores`(
	`cedula` VARCHAR(15) NOT NULL,
	`nombre`VARCHAR(20) NOT NULL,
  `apellido`VARCHAR(20) NOT NULL,
	`saldo` DECIMAL(10,2) NOT NULL CHECK(`saldo`>=0),
	`telefono` VARCHAR(15) NOT NULL,
	`telefonoAlternativo` VARCHAR(15),
	`email` VARCHAR(20) NOT NULL,
	`fechaIngres` DATE NOT NULL,
	`disponible` BOOLEAN NOT NULL,
	`antecedentes`BOOLEAN NOT NULL,
	`licencia`BOOLEAN NOT NULL,
	`idNucleo`  int(0) NOT NULL,
	PRIMARY KEY (`cedula`),
	FOREIGN KEY (`idNucleo`) REFERENCES `Nucleos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE	
);

CREATE TABLE `Cursos`(
	`id` int(0) NOT NULL AUTO_INCREMENT,
	`nombre`VARCHAR(50) NOT NULL,
	`lugar` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Vehiculos`(
	`id` int(0) NOT NULL AUTO_INCREMENT,
	`color` VARCHAR(20) NOT NULL,
	`tipo` VARCHAR(10) NOT NULL,
	`marca` VARCHAR(10),
	`modelo` VARCHAR(10),
	`placa` VARCHAR(10),
	`cedulaTransportador`VARCHAR(15) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`cedulaTransportador`) REFERENCES `Transportadores` (`cedula`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Vuelos`(
	`id` int(0) NOT NULL AUTO_INCREMENT,
	`duracionVuelo` INTEGER,
	`fechaHoraSalida` TIMESTAMP NOT NULL,
	`fechaHoraLlegada` TIMESTAMP,
	`descripcionRetraso` VARCHAR(255),
	`duracionRetraso` INTEGER,
	PRIMARY KEY (`id`)	
);

CREATE TABLE `Encomiendas` (
	`id` int(0) NOT NULL AUTO_INCREMENT,
	`tipo` VARCHAR(10) NOT NULL,
	`status`VARCHAR(10) NOT NULL,
	`fechaHoraSalida` TIMESTAMP NOT NULL,
	`fechaHoraLlegada` TIMESTAMP,
	`idNucleo` int(0) NOT NULL,
	`cedulaTransportador`VARCHAR(15) NOT NULL,
	`idVuelo` int(0) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`idNucleo`) REFERENCES `Nucleos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,	
	FOREIGN KEY (`cedulaTransportador`) REFERENCES `Transportadores` (`cedula`) ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (`idVuelo`) REFERENCES `Vuelos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE	
);

CREATE TABLE `Paquetes`(
	`id` int(0) NOT NULL AUTO_INCREMENT,
	`empaquetado`BOOLEAN NOT NULL,
	`peso` DECIMAL(10,2) NOT NULL,
	`alto` DECIMAL(10,2),
	`ancho` DECIMAL(10,2),
	`profundidad` DECIMAL(10,2),
	`idEncomienda` int(0) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`idEncomienda`) REFERENCES `Encomiendas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE `Articulo`(
	`idPaquete` int(0) NOT NULL,
	`numero` INTEGER NOT NULL,
	`cantidad` INTEGER NOT NULL,
	`descripcion` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`idPaquete`, `numero`),
	FOREIGN KEY (`idPaquete`) REFERENCES `Paquetes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
 
 CREATE TABLE `CursosRealizados`(
	`idCurso`int(0) NOT NULL,
	`cedulaTransportador` VARCHAR(15) NOT NULL,
	PRIMARY KEY (`idCurso`,`cedulaTransportador`),
	FOREIGN KEY (`cedulaTransportador`) REFERENCES `Transportadores` (`cedula`) ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (`idCurso`) REFERENCES `Cursos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE	
 );
 
 CREATE TABLE `EncomiendasRealizadas`(
	`idEncomienda` int(0) NOT NULL,
	`cedulaEmisor`VARCHAR(15) NOT NULL,
	`cedulaReceptor`VARCHAR(15) NOT NULL,
	PRIMARY KEY (`idEncomienda`, `cedulaEmisor`, `cedulaReceptor` ),
	FOREIGN KEY (`cedulaEmisor`) REFERENCES `Clientes` (`cedula`) ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (`cedulaReceptor`) REFERENCES `Clientes` (`cedula`) ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (`idEncomienda`) REFERENCES `Encomiendas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
 );

