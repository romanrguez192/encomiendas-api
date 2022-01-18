const { gql } = require("apollo-server-express");

const Articulo = gql`
  extend type Query {
    articulos: [Articulo]!
    articulo(idPaquete: Int!, numero: Int!): Articulo
  }

  type Articulo {
    idPaquete: Int!
    numero: Int!
    cantidad: Int!
    descripcion: String!
    paquete: Paquete!
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
          idPaquete: args.idPaquete,
          numero: args.numero,
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
