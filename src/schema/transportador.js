const { gql } = require("apollo-server-express");

const Transportador = gql`
  extend type Query {
    transportadores: [Transportador]!
    transportador(cedula: String!): Transportador
  }

  type Transportador {
    cedula: String!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    fechaIngreso: Date!
    disponible: Boolean!
    antecedentesPenales: Boolean!
    licencia: Boolean!
    nucleo: Nucleo!
    direccion: Direccion!
    vehiculos: [Vehiculo]!
    retiros: [RetiroTransportador]!
    cursos: [Curso]!
    encomiendas: [Encomienda]!
    saldo: Float!
    cantidadPedidos: Int!
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
