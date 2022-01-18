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
