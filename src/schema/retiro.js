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

  extend type Mutation {
    updateRetiro(id: Int!, retiro: RetiroInput!): Retiro
    deleteRetiro(id: Int!): Retiro
  }

  input RetiroInput {
    precio: Float
    saldo: Float
    fecha: Date
    cedulaCliente: String
    cedulaTransportador: String
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
  Mutation: {
    updateRetiro: (_parent, args, context) => {
      return context.prisma.retiro.update({
        where: {
          id: args.id,
        },
        data: args.retiro,
      });
    },
    deleteRetiro: (_parent, args, context) => {
      return context.prisma.retiro.delete({
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
