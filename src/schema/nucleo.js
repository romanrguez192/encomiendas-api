const { gql } = require("apollo-server-express");

const Nucleo = gql`
  extend type Query {
    "Consulta que retorna todos los nucleos"
    nucleos: [Nucleo]!
    "Consulta que retorna los nucleos cuyos campos coincidan con los pasados por parámetro"
    nucleosWhere(nucleo: NucleoUpdateInput!): [Nucleo]!
    "Consulta que retorna un nucleo por su id"
    nucleo(id: Int!): Nucleo
  }

  "Núcleos de la empresa"
  type Nucleo {
    "Id del núcleo"
    id: Int!
    "Nombre del núcleo"
    nombre: String!
    "Teléfono del núcleo"
    telefono: String!
    "Teléfono alternativo del núcleo"
    direccion: Direccion!
    "Transportadores ubicados en este núcleo"
    transportadores: [Transportador]!
    "Encomiendas enviadas por este núcleo"
    encomiendasEnviadas: [Encomienda]!
    "Encomiendas recibidas por este núcleo"
    encomiendasRecibidas: [Encomienda]!
  }

  extend type Mutation {
    "Crea un núcleo"
    createNucleo(nucleo: NucleoInput!): Nucleo
    "Actualiza un núcleo"
    updateNucleo(id: Int!, nucleo: NucleoUpdateInput!): Nucleo
    "Elimina un núcleo"
    deleteNucleo(id: Int!): Nucleo
  }

  "Input para crear un núcleo"
  input NucleoInput {
    "Nombre del núcleo"
    nombre: String!
    "Teléfono del núcleo"
    telefono: String!
    "Id de la direccion del núcleo"
    idDireccion: Int!
  }

  "Input para actualizar un núcleo"
  input NucleoUpdateInput {
    "Nombre del núcleo"
    nombre: String
    "Teléfono del núcleo"
    telefono: String
    "Id de la direccion del núcleo"
    idDireccion: Int
  }
`;

const nucleoResolvers = {
  Query: {
    nucleos: (_parent, _args, context) => {
      return context.prisma.nucleo.findMany();
    },
    nucleosWhere: (_parent, args, context) => {
      return context.prisma.nucleo.findMany({
        where: args.nucleo,
      });
    },
    nucleo: (_parent, args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createNucleo: (_parent, args, context) => {
      return context.prisma.nucleo.create({
        data: args.nucleo,
      });
    },
    updateNucleo: (_parent, args, context) => {
      return context.prisma.nucleo.update({
        where: {
          id: args.id,
        },
        data: args.nucleo,
      });
    },
    deleteNucleo: (_parent, args, context) => {
      return context.prisma.nucleo.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  Nucleo: {
    direccion: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccion,
        },
      });
    },
    transportadores: (parent, _args, context) => {
      return context.prisma.transportador.findMany({
        where: {
          idNucleo: parent.id,
        },
      });
    },
    encomiendasEnviadas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          idNucleoOrigen: parent.id,
        },
      });
    },
    encomiendasRecibidas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          idNucleoDestino: parent.id,
        },
      });
    },
  },
};

module.exports = {
  Nucleo,
  nucleoResolvers,
};
