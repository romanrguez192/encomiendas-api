const { gql } = require("apollo-server-express");

const Cliente = gql`
  extend type Query {
    clientes: [Cliente]!
    cliente(cedula: String!): Cliente
  }

  type Cliente {
    cedula: String!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    direccion: Direccion
    recargas: [Recarga]!
    retiros: [Retiro]!
  }
`;

const clienteResolvers = {
  Query: {
    clientes: (_parent, _args, context) => {
      return context.prisma.cliente.findMany();
    },
    cliente: (_parent, args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: args.cedula,
        },
      });
    },
  },
  Cliente: {
    direccion: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccion,
        },
      });
    },
    recargas: (parent, _args, context) => {
      return context.prisma.recarga.findMany({
        where: {
          cedulaCliente: parent.cedula,
        },
      });
    },
    retiros: (parent, _args, context) => {
      return context.prisma.retiro.findMany({
        where: {
          cedulaCliente: parent.cedula,
        },
      });
    },
  },
};

module.exports = {
  Cliente,
  clienteResolvers,
};