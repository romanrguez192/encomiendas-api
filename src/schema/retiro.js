const { gql } = require("apollo-server-express");

const Retiro = gql`
  extend type Query {
    "Consulta que retorna todos los retiros"
    retiros: [Retiro]!
    "Consulta que retorna un retiro por id"
    retiro(id: Int!): Retiro
  }

  "Retiros hechos por clientes o transportadores"
  interface Retiro {
    "Id del retiro"
    id: Int!
    "Precio del retiro en dólares"
    precio: Float!
    "Saldo retirado"
    saldo: Float!
    "Fecha del retiro"
    fecha: Date!
  }

  extend type Mutation {
    "Actualiza un retiro"
    updateRetiro(id: Int!, retiro: RetiroInput!): Retiro
    "Elimina un retiro"
    deleteRetiro(id: Int!): Retiro
  }

  "Input para actualizar un retiro"
  input RetiroInput {
    "Precio del retiro en dólares"
    precio: Float
    "Saldo retirado"
    saldo: Float
    "Fecha del retiro"
    fecha: Date
    "Cédula del cliente que realiza el retiro"
    cedulaCliente: String
    "Cédula del transportador que realiza el retiro"
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
