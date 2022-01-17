const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    clientes: [Cliente]!
    cliente(cedula: String!): Cliente
    direcciones: [Direccion]!
    direccion(id: Int!): Direccion
    nucleos: [Nucleo]!
    nucleo(id: Int!): Nucleo
  }

  type Cliente {
    cedula: String!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    direccion: Direccion
  }

  type Direccion {
    id: Int!
    pais: String!
    ciudad: String!
    estado: String!
    parroquia: String!
    clientes: [Cliente]!
    nucleos: [Nucleo]!
  }

  type Nucleo {
    id: Int!
    nombre: String!
    telefono: String!
    direccion: Direccion
  }
`;

const resolvers = {
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
    direcciones: (_parent, _args, context) => {
      return context.prisma.direccion.findMany();
    },
    direccion: (_parent, args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    nucleos: (_parent, _args, context) => {
      return context.prisma.nucleo.findMany();
    },
    nucleo: (_parent, args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: args.id,
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
  },
  Direccion: {
    clientes: (parent, _args, context) => {
      return context.prisma.cliente.findMany({
        where: {
          idDireccion: parent.id,
        },
      });
    },
    nucleos: (parent, _args, context) => {
      return context.prisma.nucleo.findMany({
        where: {
          idDireccion: parent.id,
        },
      });
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
