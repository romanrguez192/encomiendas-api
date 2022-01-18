const { gql } = require("apollo-server-express");

const Bicicleta = gql`
  extend type Query {
    bicicletas: [Bicicleta]!
  }

  type Bicicleta implements Vehiculo {
    id: Int!
    color: String!
    tipo: String!
    transportador: Transportador!
  }
`;

const bicicletaResolvers = {
  Query: {
    bicicletas: (_parent, _args, context) => {
      return context.prisma.vehiculo.findMany({
        where: {
          tipo: "bicicleta",
        },
      });
    },
  },
};

module.exports = {
  Bicicleta,
  bicicletaResolvers,
};
