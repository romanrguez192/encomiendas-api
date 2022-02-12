const { gql } = require("apollo-server-express");

const Transportador = gql`
  extend type Query {
    "Consulta que retorna todos los transportadores"
    transportadores: [Transportador]!
    "Consulta que retorna un transportador por id"
    transportador(cedula: String!): Transportador
  }

  "Transportadores de la empresa"
  type Transportador {
    "Cédula del transportador"
    cedula: String!
    "Nombre del transportador"
    nombre: String!
    "Apellido del transportador"
    apellido: String!
    "Teléfono del transportador"
    telefono: String!
    "Teléfono alternativo del transportador"
    telefonoAlternativo: String
    "Email del transportador"
    email: String!
    "Fecha de ingreso del transportador"
    fechaIngreso: Date!
    "Disponibilidad del transportador para hacer encomiendas"
    disponible: Boolean!
    "Si cuenta con antecedentes penales"
    antecedentesPenales: Boolean!
    "Si cuenta con licencia para conducir"
    licencia: Boolean!
    "Núcleo al que pertenece el transportador"
    nucleo: Nucleo!
    "Dirección del transportador"
    direccion: Direccion!
    "Vehículos del transportador"
    vehiculos: [Vehiculo]!
    "Retiros hechos por el transportador"
    retiros: [RetiroTransportador]!
    "Cursos hechos por el transportador"
    cursos: [Curso]!
    "Encomiendas hechas por el transportador"
    encomiendas: [Encomienda]!
    "Saldo del transportador"
    saldo: Float!
    "Cantidad de encomiendas entregadas"
    cantidadPedidos: Int!
  }

  extend type Mutation {
    "Crea un transportador"
    createTransportador(transportador: TransportadorInput!): Transportador
    "Actualiza un transportador"
    updateTransportador(
      cedula: String!
      transportador: TransportadorUpdateInput!
    ): Transportador
    "Elimina un transportador"
    deleteTransportador(cedula: String!): Transportador
    "Le agrega un curso a un transportador"
    addCursoToTransportador(
      cedulaTransportador: String!
      idCurso: Int!
    ): Transportador
    "Le elimina un curso a un transportador"
    deleteCursoFromTransportador(
      cedulaTransportador: String!
      idCurso: Int!
    ): Transportador
  }

  "Input para crear un transportador"
  input TransportadorInput {
    "Cédula del transportador"
    cedula: String!
    "Nombre del transportador"
    nombre: String!
    "Apellido del transportador"
    apellido: String!
    "Teléfono del transportador"
    telefono: String!
    "Teléfono alternativo del transportador"
    telefonoAlternativo: String
    "Email del transportador"
    email: String!
    "Fecha de ingreso del transportador"
    fechaIngreso: Date
    "Disponibilidad del transportador para hacer encomiendas"
    disponible: Boolean!
    "Si cuenta con antecedentes penales"
    antecedentesPenales: Boolean!
    "Si cuenta con licencia para conducir"
    licencia: Boolean!
    "Id del núcleo al que pertenece el transportador"
    idNucleo: Int!
    "Id de la dirección del transportador"
    idDireccion: Int!
  }

  "Input para actualizar un transportador"
  input TransportadorUpdateInput {
    "Cédula del transportador"
    cedula: String
    "Nombre del transportador"
    nombre: String
    "Apellido del transportador"
    apellido: String
    "Teléfono del transportador"
    telefono: String
    "Teléfono alternativo del transportador"
    telefonoAlternativo: String
    "Email del transportador"
    email: String
    "Fecha de ingreso del transportador"
    fechaIngreso: Date
    "Disponibilidad del transportador para hacer encomiendas"
    disponible: Boolean
    "Si cuenta con antecedentes penales"
    antecedentesPenales: Boolean
    "Si cuenta con licencia para conducir"
    licencia: Boolean
    "Id del núcleo al que pertenece el transportador"
    idNucleo: Int
    "Id de la dirección del transportador"
    idDireccion: Int
  }
`;

const transportadorResolvers = {
  Query: {
    transportadores: (_parent, _args, context) => {
      return context.prisma.transportador.findMany();
    },
    transportador: (_parent, args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: args.cedula,
        },
      });
    },
  },
  Mutation: {
    createTransportador: (_parent, args, context) => {
      return context.prisma.transportador.create({
        data: args.transportador,
      });
    },
    updateTransportador: (_parent, args, context) => {
      return context.prisma.transportador.update({
        where: {
          cedula: args.cedula,
        },
        data: args.transportador,
      });
    },
    deleteTransportador: (_parent, args, context) => {
      return context.prisma.transportador.delete({
        where: {
          cedula: args.cedula,
        },
      });
    },
    addCursoToTransportador: (_parent, args, context) => {
      return context.prisma.transportador.update({
        where: {
          cedula: args.cedulaTransportador,
        },
        data: {
          cursos: {
            create: {
              idCurso: args.idCurso,
            },
          },
        },
      });
    },
    deleteCursoFromTransportador: (_parent, args, context) => {
      return context.prisma.transportador.update({
        where: {
          cedula: args.cedulaTransportador,
        },
        data: {
          cursos: {
            deleteMany: {
              idCurso: args.idCurso,
            },
          },
        },
      });
    },
  },
  Transportador: {
    nucleo: (parent, _args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: parent.idNucleo,
        },
      });
    },
    direccion: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccion,
        },
      });
    },
    vehiculos: (parent, _args, context) => {
      return context.prisma.vehiculo.findMany({
        where: {
          cedulaTransportador: parent.cedula,
        },
      });
    },
    retiros: (parent, _args, context) => {
      return context.prisma.retiro.findMany({
        where: {
          cedulaTransportador: parent.cedula,
        },
      });
    },
    cursos: (parent, _args, context) => {
      return context.prisma.curso.findMany({
        where: {
          transportadores: {
            some: {
              transportador: {
                cedula: parent.cedula,
              },
            },
          },
        },
      });
    },
    encomiendas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          cedulaTransportador: parent.cedula,
        },
      });
    },
    saldo: async (parent, _args, context) => {
      const transportador = await context.prisma.vistaTransportador.findUnique({
        where: {
          cedula: parent.cedula,
        },
      });

      return transportador.saldo;
    },
    cantidadPedidos: async (parent, _args, context) => {
      const transportador = await context.prisma.vistaTransportador.findUnique({
        where: {
          cedula: parent.cedula,
        },
      });

      return transportador.cantidadPedidos;
    },
  },
};

module.exports = {
  Transportador,
  transportadorResolvers,
};
