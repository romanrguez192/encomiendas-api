const { gql } = require("apollo-server-express");

const RetiroCliente = gql`
  extend type Query {
    retirosClientes: [RetiroCliente]!
  }

  type RetiroCliente implements Retiro {
    id: Int!
    precio: Float!
    saldo: Float!
    fecha: Date!
    cliente: Cliente
  }

  extend type Mutation {
    createRetiroCliente(retiroCliente: RetiroClienteInput!): RetiroCliente
  }

  input RetiroClienteInput {
    precio: Float!
    saldo: Float!
    fecha: Date!
    cedulaCliente: String!
  }
`;

const retiroClienteResolvers = {
  Query: {
    retirosClientes: (_parent, _args, context) => {
      return context.prisma.retiro.findMany({
        where: {
          cedulaTransportador: null,
        },
      });
    },
  },
  Mutation: {
    createRetiroCliente: (_parent, args, context) => {
      return context.prisma.retiro.create({
        data: args.retiroCliente,
      });
    },
  },
  RetiroCliente: {
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
  RetiroCliente,
  retiroClienteResolvers,
};
