const formatError = (err) => {
  if (err.message.includes("not found")) {
    return {
      message:
        "No se encontró " + err.message.match(/context\.prisma\.(.*)\./)[1],
    };
  }

  if (err.message.includes('state: "45000"')) {
    return {
      message: err.message.match(/message: "(.*)", state: "45000"/)[1],
    };
  }

  if (err.message.includes("Foreign key constraint failed")) {
    return {
      message:
        err.message.match(
          /Foreign key constraint failed on the field: `(.*)`/
        )[1] + " no se encontró",
    };
  }

  if (
    err.message.includes(
      "Unique constraint failed on the constraint: `PRIMARY`"
    )
  ) {
    return {
      message:
        "Ya existe " +
        err.message.match(/context\.prisma\.(.*)\./)[1] +
        " con estos datos únicos",
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
