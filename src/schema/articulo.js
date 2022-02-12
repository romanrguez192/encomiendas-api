const { gql } = require("apollo-server-express");

const Articulo = gql`
  extend type Query {
    "Consulta que retorna todos los artículos"
    articulos: [Articulo]!
    "Consulta que retorna un artículo por el id de su paquete y el número del artículo"
    articulo(idPaquete: Int!, numero: Int!): Articulo
  }

  "Artículos que se encuentran en un paquete"
  type Articulo {
    "Número del artículo en su paquete"
    numero: Int!
    "Cantidad de este artículo en el paquete"
    cantidad: Int!
    "Descripción del artículo"
    descripcion: String!
    "Paquete al que pertenece este artículo"
    paquete: Paquete!
  }

  extend type Mutation {
    "Crea un artículo"
    createArticulo(articulo: ArticuloInput!): Articulo
    "Actualiza un artículo"
    updateArticulo(
      idPaquete: Int!
      numero: Int!
      articulo: ArticuloUpdateInput!
    ): Articulo
    "Elimina un artículo"
    deleteArticulo(idPaquete: Int!, numero: Int!): Articulo
  }

  "Input para crear un artículo"
  input ArticuloInput {
    "Id del paquete al que pertenece este artículo"
    idPaquete: Int!
    "Número del artículo en este paquete"
    numero: Int!
    "Cantidad de este artículo en el paquete"
    cantidad: Int!
    "Descripción del artículo"
    descripcion: String!
  }

  "Input para actualizar un artículo"
  input ArticuloUpdateInput {
    "Id del paquete al que pertenece este artículo"
    idPaquete: Int
    "Número del artículo en este paquete"
    numero: Int
    "Cantidad de este artículo en el paquete"
    cantidad: Int
    "Descripción del artículo"
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
