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
