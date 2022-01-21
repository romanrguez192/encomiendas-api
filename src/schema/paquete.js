const { gql } = require("apollo-server-express");

const Paquete = gql`
  extend type Query {
    paquetes: [Paquete]!
    paquete(id: Int!): Paquete
  }

  type Paquete {
    id: Int!
    empaquetado: Boolean!
    peso: Int
    alto: Int
    ancho: Int
    profundidad: Int
    fragil: Boolean!
    tarifa: Float
    encomienda: Encomienda!
    articulos: [Articulo]!
  }

  extend type Mutation {
    createPaquete(paquete: PaqueteInput!): Paquete
    updatePaquete(id: Int!, paquete: PaqueteUpdateInput!): Paquete
    deletePaquete(id: Int!): Paquete
  }

  input PaqueteInput {
    empaquetado: Boolean!
    peso: Int!
    alto: Int
    ancho: Int
    profundidad: Int
    fragil: Boolean!
    tarifa: Float
    idEncomienda: Int!
  }

  input PaqueteUpdateInput {
    empaquetado: Boolean
    peso: Int
    alto: Int
    ancho: Int
    profundidad: Int
    fragil: Boolean
    tarifa: Float
    idEncomienda: Int
  }
`;

const paqueteResolvers = {
  Query: {
    paquetes: (_parent, _args, context) => {
      return context.prisma.paquete.findMany();
    },
    paquete: (_parent, args, context) => {
      return context.prisma.paquete.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createPaquete: (_parent, args, context) => {
      return context.prisma.paquete.create({
        data: args.paquete,
      });
    },
    updatePaquete: (_parent, args, context) => {
      return context.prisma.paquete.update({
        where: {
          id: args.id,
        },
        data: args.paquete,
      });
    },
    deletePaquete: (_parent, args, context) => {
      return context.prisma.paquete.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  Paquete: {
    encomienda: (parent, _args, context) => {
      return context.prisma.encomienda.findUnique({
        where: {
          id: parent.idEncomienda,
        },
      });
    },
    articulos: (parent, _args, context) => {
      return context.prisma.articulo.findMany({
        where: {
          idPaquete: parent.id,
        },
      });
    },
  },
};

module.exports = {
  Paquete,
  paqueteResolvers,
};
