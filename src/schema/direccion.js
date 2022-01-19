const { gql } = require("apollo-server-express");

const Direccion = gql`
  extend type Query {
    direcciones: [Direccion]!
    direccion(id: Int!): Direccion
  }

  type Direccion {
    id: Int!
    pais: String!
    ciudad: String!
    estado: String!
    parroquia: String!
    clientes: [Cliente]!
    nucleos: [Nucleo]!
    transportadores: [Transportador]!
  }

  extend type Mutation {
    createDireccion(direccion: DireccionInput!): Direccion
    updateDireccion(id: Int!, direccion: DireccionUpdateInput!): Direccion
    deleteDireccion(id: Int!): Direccion
  }

  input DireccionInput {
    pais: String!
    ciudad: String!
    estado: String!
    parroquia: String!
  }

  input DireccionUpdateInput {
    pais: String
    ciudad: String
    estado: String
    parroquia: String
  }
`;

const direccionResolvers = {
  Query: {
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
  },
  Mutation: {
    createDireccion: (_parent, args, context) => {
      return context.prisma.direccion.create({
        data: args.direccion,
      });
    },
    updateDireccion: (_parent, args, context) => {
      return context.prisma.direccion.update({
        where: {
          id: args.id,
        },
        data: args.direccion,
      });
    },
    deleteDireccion: (_parent, args, context) => {
      return context.prisma.direccion.delete({
        where: {
          id: args.id,
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
    transportadores: (parent, _args, context) => {
      return context.prisma.transportador.findMany({
        where: {
          idDireccion: parent.id,
        },
      });
    },
  },
};

module.exports = {
  Direccion,
  direccionResolvers,
};
