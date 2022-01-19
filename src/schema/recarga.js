const { gql } = require("apollo-server-express");

const Recarga = gql`
  extend type Query {
    recargas: [Recarga]!
    recarga(id: Int!): Recarga
  }

  type Recarga {
    id: Int!
    precio: Float!
    saldo: Float!
    fecha: Date!
    cliente: Cliente!
  }

  extend type Mutation {
    createRecarga(recarga: RecargaInput!): Recarga
    updateRecarga(id: Int!, recarga: RecargaUpdateInput!): Recarga
    deleteRecarga(id: Int!): Recarga
  }

  input RecargaInput {
    precio: Float!
    fecha: Date!
    saldo: Float!
    cedulaCliente: String!
  }

  input RecargaUpdateInput {
    precio: Float
    fecha: Date
    saldo: Float
    cedulaCliente: String
  }
`;

const recargaResolvers = {
  Query: {
    recargas: (_parent, _args, context) => {
      return context.prisma.recarga.findMany();
    },
    recarga: (_parent, args, context) => {
      return context.prisma.recarga.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createRecarga: (_parent, args, context) => {
      return context.prisma.recarga.create({
        data: args.recarga,
      });
    },
    updateRecarga: (_parent, args, context) => {
      return context.prisma.recarga.update({
        where: {
          id: args.id,
        },
        data: args.recarga,
      });
    },
    deleteRecarga: (_parent, args, context) => {
      return context.prisma.recarga.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  Recarga: {
    cliente: (parent, _args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: parent.cedulaCliente,
        },
      });
    },
  },
};

module.exports = {
  Recarga,
  recargaResolvers,
};
