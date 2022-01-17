const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    clientes: [Cliente]!
    direcciones: [Direccion]!
  }

  type Cliente {
    cedula: ID!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    direccion: Direccion
  }

  type Direccion {
    id: ID!
    pais: String!
    ciudad: String!
    estado: String!
    parroquia: String!
    clientes: [Cliente]!
  }
`;

const resolvers = {
  Query: {
    clientes: (_parent, _args, context) => {
      return context.prisma.cliente.findMany();
    },
    direcciones: (_parent, _args, context) => {
      return context.prisma.direccion.findMany();
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
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
