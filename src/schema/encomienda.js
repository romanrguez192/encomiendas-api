const { gql } = require("apollo-server-express");

const Encomienda = gql`
  extend type Query {
    encomiendas: [Encomienda]!
    encomienda(id: Int!): Encomienda
  }

  interface Encomienda {
    id: Int!
    tipo: String!
    status: String!
    fechaHoraSalida: DateTime!
    fechaHoraLlegada: DateTime
    precio: Float
    comisionTransportador: Float
    clienteEmisor: Cliente!
    clienteReceptor: Cliente!
    transportador: Transportador!
    nucleoOrigen: Nucleo!
    nucleoDestino: Nucleo!
  }
`;

const encomiendaResolvers = {
  Query: {
    encomiendas: (_parent, _args, context) => {
      return context.prisma.encomienda.findMany();
    },
    encomienda: (_parent, args, context) => {
      return context.prisma.encomienda.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Encomienda: {
    __resolveType: (parent) => {
      if (parent.tipo === "terrestre") {
        return "EncomiendaTerrestre";
      }

      return "EncomiendaAerea";
    },
    clienteEmisor: (parent, _args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: parent.cedulaEmisor,
        },
      });
    },
    clienteReceptor: (parent, _args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: parent.cedulaReceptor,
        },
      });
    },
    transportador: (parent, _args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: parent.cedulaTransportador,
        },
      });
    },
    nucleoOrigen: (parent, _args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: parent.idNucleoOrigen,
        },
      });
    },
    nucleoDestino: (parent, _args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: parent.idNucleoDestino,
        },
      });
    },
  },
};

module.exports = {
  Encomienda,
  encomiendaResolvers,
};
