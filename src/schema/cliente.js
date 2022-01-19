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
    retiros: [RetiroCliente]!
    encomiendasEnviadas: [Encomienda]!
    encomiendasRecibidas: [Encomienda]!
    saldo: Float!
  }

  extend type Mutation {
    createCliente(cliente: ClienteInput!): Cliente
    updateCliente(cedula: String!, cliente: ClienteUpdateInput!): Cliente
    deleteCliente(cedula: String!): Cliente
  }

  input ClienteInput {
    cedula: String!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    idDireccion: Int!
  }

  input ClienteUpdateInput {
    cedula: String
    nombre: String
    apellido: String
    telefono: String
    telefonoAlternativo: String
    email: String
    idDireccion: Int
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
  Mutation: {
    createCliente: (_parent, args, context) => {
      return context.prisma.cliente.create({
        data: args.cliente,
      });
    },
    updateCliente: (_parent, args, context) => {
      return context.prisma.cliente.update({
        where: {
          cedula: args.cedula,
        },
        data: args.cliente,
      });
    },
    deleteCliente: (_parent, args, context) => {
      return context.prisma.cliente.delete({
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
    encomiendasEnviadas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          cedulaEmisor: parent.cedula,
        },
      });
    },
    encomiendasRecibidas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          cedulaReceptor: parent.cedula,
        },
      });
    },
    saldo: async (parent, _args, context) => {
      const cliente = await context.prisma.vistaCliente.findUnique({
        where: {
          cedula: parent.cedula,
        },
      });

      return cliente.saldo;
    },
  },
};

module.exports = {
  Cliente,
  clienteResolvers,
};
