const { gql } = require("apollo-server-express");

const RetiroTransportador = gql`
  extend type Query {
    retirosTransportadores: [RetiroTransportador]!
  }

  type RetiroTransportador implements Retiro {
    id: Int!
    precio: Float!
    saldo: Float!
    fecha: Date!
    transportador: Transportador
  }

  extend type Mutation {
    createRetiroTransportador(
      retiroTransportador: RetiroTransportadorInput!
    ): RetiroTransportador
  }

  input RetiroTransportadorInput {
    precio: Float!
    saldo: Float!
    fecha: Date!
    cedulaTransportador: String!
  }
`;

const retiroTransportadorResolvers = {
  Query: {
    retirosTransportadores: (_parent, _args, context) => {
      return context.prisma.retiro.findMany({
        where: {
          cedulaCliente: null,
        },
      });
    },
  },
  Mutation: {
    createRetiroTransportador: (_parent, args, context) => {
      return context.prisma.retiro.create({
        data: args.retiroTransportador,
      });
    },
  },
  RetiroTransportador: {
    transportador: (parent, _args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: parent.cedulaTransportador,
        },
      });
    },
  },
};

module.exports = {
  RetiroTransportador,
  retiroTransportadorResolvers,
};
