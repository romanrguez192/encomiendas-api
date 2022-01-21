const { gql } = require("apollo-server-express");

const Articulo = gql`
  extend type Query {
    articulos: [Articulo]!
    articulo(idPaquete: Int!, numero: Int!): Articulo
  }

  type Articulo {
    numero: Int!
    cantidad: Int!
    descripcion: String!
    paquete: Paquete!
  }

  extend type Mutation {
    createArticulo(articulo: ArticuloInput!): Articulo
    updateArticulo(
      idPaquete: Int!
      numero: Int!
      articulo: ArticuloUpdateInput!
    ): Articulo
    deleteArticulo(idPaquete: Int!, numero: Int!): Articulo
  }

  input ArticuloInput {
    idPaquete: Int!
    numero: Int!
    cantidad: Int!
    descripcion: String!
  }

  input ArticuloUpdateInput {
    idPaquete: Int
    numero: Int
    cantidad: Int
    descripcion: String
  }
`;

const articuloResolvers = {
  Query: {
    articulos: (_parent, _args, context) => {
      return context.prisma.articulo.findMany();
    },
    articulo: (_parent, args, context) => {
      return context.prisma.articulo.findUnique({
        where: {
          idPaquete_numero: {
            idPaquete: args.idPaquete,
            numero: args.numero,
          },
        },
      });
    },
  },
  Mutation: {
    createArticulo: (_parent, args, context) => {
      return context.prisma.articulo.create({
        data: args.articulo,
      });
    },
    updateArticulo: (_parent, args, context) => {
      return context.prisma.articulo.update({
        where: {
          idPaquete_numero: {
            idPaquete: args.idPaquete,
            numero: args.numero,
          },
        },
        data: args.articulo,
      });
    },
    deleteArticulo: (_parent, args, context) => {
      return context.prisma.articulo.delete({
        where: {
          idPaquete_numero: {
            idPaquete: args.idPaquete,
            numero: args.numero,
          },
        },
      });
    },
  },
  Articulo: {
    paquete: (parent, _args, context) => {
      return context.prisma.paquete.findUnique({
        where: {
          id: parent.idPaquete,
        },
      });
    },
  },
};

module.exports = {
  Articulo,
  articuloResolvers,
};
