-- TODO: Agregar el saldo en la vista de clientes

-- Vista de clientes
CREATE VIEW `VistaClientes` AS 
SELECT c.*, d.parroquia, d.ciudad, d.estado, d.pais  
FROM Clientes c
JOIN Direcciones d ON c.idDireccion=d.id;