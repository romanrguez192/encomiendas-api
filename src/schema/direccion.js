const { gql } = require("apollo-server-express");

const Direccion = gql`
  extend type Query {
    "Consulta que retorna todas las direcciones"
    direcciones: [Direccion]!
    "Consulta que retorna las direcciones cuyos campos coincidan con los pasados por parámetro"
    direccionesWhere(direccion: DireccionUpdateInput!): [Direccion]!
    "Consulta que retorna una direccion por su id"
    direccion(id: Int!): Direccion
  }

  "Direcciones"
  type Direccion {
    "Id de la direccion"
    id: Int!
    "País de la direccion"
    pais: String!
    "Ciudad de la direccion"
    ciudad: String!
    "Estado de la direccion"
    estado: String!
    "Parroquia de la direccion"
    parroquia: String!
    "Clientes ubicados en esta direccion"
    clientes: [Cliente]!
    "Núcleos ubicados en esta direccion"
    nucleos: [Nucleo]!
    "Transportadores ubicados en esta direccion"
    transportadores: [Transportador]!
  }

  extend type Mutation {
    "Crea una direccion"
    createDireccion(direccion: DireccionInput!): Direccion
    "Actualiza una direccion"
    updateDireccion(id: Int!, direccion: DireccionUpdateInput!): Direccion
    "Elimina una direccion"
    deleteDireccion(id: Int!): Direccion
  }

  "Input para crear una direccion"
  input DireccionInput {
    "País de la direccion"
    pais: String!
    "Ciudad de la direccion"
    ciudad: String!
    "Estado de la direccion"
    estado: String!
    "Parroquia de la direccion"
    parroquia: String!
  }

  "Input para actualizar una direccion"
  input DireccionUpdateInput {
    "País de la direccion"
    pais: String
    "Ciudad de la direccion"
    ciudad: String
    "Estado de la direccion"
    estado: String
    "Parroquia de la direccion"
    parroquia: String
  }
`;

const direccionResolvers = {
  Query: {
    direcciones: (_parent, _args, context) => {
      return context.prisma.direccion.findMany();
    },
    direccionesWhere: (_parent, args, context) => {
      return context.prisma.direccion.findMany({
        where: args.direccion,
      });
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
