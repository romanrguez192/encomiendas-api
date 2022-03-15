const formatError = (err) => {
  if (err.message.includes("not found")) {
    return {
      message: "No se encontró el registro para efectuar la operación",
    };
  }

  if (err.message.includes('state: "45000"')) {
    return {
      message: err.message.match(/message: "(.*)", state: "45000"/)[1],
    };
  }

  if (
    err.path.some((p) => p.includes("delete")) &&
    err.message.includes("Foreign key constraint failed")
  ) {
    return {
      message: "No se puede eliminar porque tiene datos relacionados",
    };
  }

  if (err.message.includes("Foreign key constraint failed")) {
    return {
      message: "El registro indicado no existe",
    };
  }

  if (
    err.message.includes(
      "Unique constraint failed on the constraint: `PRIMARY`"
    )
  ) {
    return {
      message: "Ya existe este registro",
    };
  }

  if (err.message.includes("Unique constraint failed on the constraint")) {
    return {
      message: "Este email ya está registrado",
    };
  }

  if (err.message.match(/CONSTRAINT `(.*)\.(.*)` failed/)) {
    return {
      message:
        "El valor del atributo " +
        err.message.match(/CONSTRAINT `((.*)\.(.*))` failed/)[3] +
        " no es válido",
    };
  }

  if (err.message.match(/CONSTRAINT `(.*)` failed/)) {
    return {
      message:
        "Datos inválidos, no se cumple " +
        err.message.match(/CONSTRAINT `(.*)` failed/)[1],
    };
  }

  return err;
};

module.exports = { formatError };
