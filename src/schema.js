const { gql } = require("apollo-server-express");
const { DateResolver } = require("graphql-scalars");

const typeDefs = gql`
  scalar Date

  type Query {
    clientes: [Cliente]!
    cliente(cedula: String!): Cliente
    direcciones: [Direccion]!
    direccion(id: Int!): Direccion
    nucleos: [Nucleo]!
    nucleo(id: Int!): Nucleo
    transportadores: [Transportador]!
    transportador(cedula: String!): Transportador
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
    transportadores: [Transportador]!
  }

  type Nucleo {
    id: Int!
    nombre: String!
    telefono: String!
    direccion: Direccion
    transportadores: [Transportador]!
  }

  type Transportador {
    cedula: String!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    fechaIngreso: Date!
    disponible: Boolean!
    antecedentesPenales: Boolean!
    licencia: Boolean!
    nucleo: Nucleo!
    direccion: Direccion!
  }
`;

const resolvers = {
  Date: DateResolver,
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
    transportadores: (_parent, _args, context) => {
      return context.prisma.transportador.findMany();
    },
    transportador: (_parent, args, context) => {
      return context.prisma.transportador.findUnique({
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
  },
  Transportador: {
    nucleo: (parent, _args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: parent.idNucleo,
        },
      });
    },
    direccion: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccion,
        },
      });
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
