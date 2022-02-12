const { gql } = require("apollo-server-express");

const RetiroCliente = gql`
  extend type Query {
    "Consulta que retorna todos los retiros de clientes"
    retirosClientes: [RetiroCliente]!
  }

  "Retiros hechos por los clientes"
  type RetiroCliente implements Retiro {
    "Id del retiro"
    id: Int!
    "Precio del retiro en dólares"
    precio: Float!
    "Saldo retirado"
    saldo: Float!
    "Fecha del retiro"
    fecha: Date!
    "Cliente que realiza el retiro"
    cliente: Cliente
  }

  extend type Mutation {
    "Crea un retiro de cliente"
    createRetiroCliente(retiroCliente: RetiroClienteInput!): RetiroCliente
  }

  "Input para crear un retiro de cliente"
  input RetiroClienteInput {
    "Precio del retiro en dólares"
    precio: Float!
    "Saldo retirado"
    saldo: Float
    "Fecha del retiro"
    fecha: Date
    "Cédula del cliente que realiza el retiro"
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
