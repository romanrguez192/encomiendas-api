const { gql } = require("apollo-server-express");

const Bicicleta = gql`
  extend type Query {
    "Consulta que retorna todas las bicicletas"
    bicicletas: [Bicicleta]!
  }

  "Bicicletas de los transportadores"
  type Bicicleta implements Vehiculo {
    "Id de la bicicleta"
    id: Int!
    "Color de la bicicleta"
    color: String!
    "Tipo de vehículo"
    tipo: String!
    "Transportador al que le pertenece la bicicleta"
    transportador: Transportador!
  }

  extend type Mutation {
    "Crea una bicicleta"
    createBicicleta(bicicleta: BicicletaInput): Bicicleta
  }

  "Input para crear una bicicleta"
  input BicicletaInput {
    "Color de la bicicleta"
    color: String!
    "Cédula del transportador al que le pertenece la bicicleta"
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
