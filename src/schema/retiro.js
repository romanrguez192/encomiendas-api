const { gql } = require("apollo-server-express");

const Retiro = gql`
  extend type Query {
    retiros: [Retiro]!
    retiro(id: Int!): Retiro
  }

  interface Retiro {
    id: Int!
    precio: Float!
    saldo: Float!
    fecha: Date!
  }
`;

const retiroResolvers = {
  Query: {
    retiros: (_parent, _args, context) => {
      return context.prisma.retiro.findMany();
    },
    retiro: (_parent, args, context) => {
      return context.prisma.retiro.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Retiro: {
    __resolveType: (parent) => {
      if (parent.cedulaCliente) {
        return "RetiroCliente";
      }

      return "RetiroTransportador";
    },
  },
};

module.exports = {
  Retiro,
  retiroResolvers,
};
