const { gql } = require("apollo-server-express");

const Retiro = gql`
  extend type Query {
    retiros: [Retiro]!
    retiro(id: Int!): Retiro
  }

  type Retiro {
    id: Int!
    precio: Float!
    saldo: Float!
    fecha: Date!
    cliente: Cliente
    transportador: Transportador
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
    cliente: (parent, _args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: parent.cedulaCliente || "",
        },
      });
    },
    transportador: (parent, _args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: parent.cedulaTransportador || "",
        },
      });
    },
  },
};

module.exports = {
  Retiro,
  retiroResolvers,
};
