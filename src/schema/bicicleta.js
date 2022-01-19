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

  extend type Mutation {
    createBicicleta(bicicleta: BicicletaInput): Bicicleta
  }

  input BicicletaInput {
    color: String!
    cedulaTransportador: String!
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
  Mutation: {
    createBicicleta: async (_parent, args, context) => {
      return context.prisma.vehiculo.create({
        data: {
          ...args.bicicleta,
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
