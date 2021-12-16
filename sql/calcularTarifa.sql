CREATE DEFINER=`bd2_202215_27948813`@`%` FUNCTION `tarifas`(`id` INT ) RETURNS decimal(12,2)
BEGIN
	DECLARE precioBase DECIMAL ( 10, 2 ) DEFAULT ( 5 );
	DECLARE precioFragil DECIMAL ( 10, 2 ) DEFAULT ( 7 );
	DECLARE precioVolumen DECIMAL ( 10, 2 ) DEFAULT ( 10 );
	DECLARE precioMasa DECIMAL ( 10, 2 ) DEFAULT ( 2.5 );
	DECLARE tarifa DECIMAL ( 12, 2 ) DEFAULT ( 0 );
	DECLARE alto INT DEFAULT ( 0 );
	DECLARE ancho INT DEFAULT ( 0 );
	DECLARE profundidad INT DEFAULT ( 0 );
	DECLARE peso INT DEFAULT ( 0 );
	DECLARE empaquetado TINYINT DEFAULT ( 0 );
	DECLARE fragil TINYINT DEFAULT ( 0 );

	SELECT 		p.peso, p.alto, p.ancho, p.profundidad, p.empaquetado, p.fragil 	
	INTO peso, alto, ancho, profundidad, empaquetado, fragil
	FROM 	Paquetes p 
	WHERE p.id = id;
	IF empaquetado = 1 THEN
	-- es empaquetado, uso su formula
		SET tarifa = (precioVolumen *(alto * ancho * profundidad ))+(precioMasa*peso)+ precioBase;
	ELSE 
	-- no es empaquetado
	SET tarifa =(precio_masa*peso)+ precioBase;
	END if;
	IF fragil = 1 THEN
		SET tarifa = tarifa + precioFragil;
	END IF;
	RETURN tarifa;
END