const { gql } = require("apollo-server-express");

const Nucleo = gql`
  extend type Query {
    nucleos: [Nucleo]!
    nucleo(id: Int!): Nucleo
  }

  type Nucleo {
    id: Int!
    nombre: String!
    telefono: String!
    direccion: Direccion
    transportadores: [Transportador]!
    encomiendasEnviadas: [Encomienda]!
    encomiendasRecibidas: [Encomienda]!
  }
`;

const nucleoResolvers = {
  Query: {
    nucleos: (_parent, _args, context) => {
      return context.prisma.nucleo.findMany();
    },
    nucleo: (_parent, args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Nucleo: {
    direccion: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccion,
        },
      });
    },
    transportadores: (parent, _args, context) => {
      return context.prisma.transportador.findMany({
        where: {
          idNucleo: parent.id,
        },
      });
    },
    encomiendasEnviadas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          idNucleoOrigen: parent.id,
        },
      });
    },
    encomiendasRecibidas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          idNucleoDestino: parent.id,
        },
      });
    },
  },
};

module.exports = {
  Nucleo,
  nucleoResolvers,
};
