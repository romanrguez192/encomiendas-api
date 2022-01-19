const { gql } = require("apollo-server-express");

const VehiculoMotor = gql`
  extend type Query {
    vehiculosMotor: [VehiculoMotor]!
  }

  type VehiculoMotor implements Vehiculo {
    id: Int!
    color: String!
    tipo: String!
    transportador: Transportador!
    marca: String!
    modelo: String!
    placa: String!
  }

  extend type Mutation {
    createVehiculoMotor(vehiculoMotor: VehiculoMotorInput): VehiculoMotor
  }

  input VehiculoMotorInput {
    color: String!
    cedulaTransportador: String!
    marca: String!
    modelo: String!
    placa: String!
  }
`;

const vehiculoMotorResolvers = {
  Query: {
    vehiculosMotor: (_parent, _args, context) => {
      return context.prisma.vehiculo.findMany({
        where: {
          tipo: "motor",
        },
      });
    },
  },
  Mutation: {
    createVehiculoMotor: async (_parent, args, context) => {
      return context.prisma.vehiculo.create({
        data: {
          ...args.vehiculoMotor,
          tipo: "motor",
        },
      });
    },
  },
};

module.exports = {
  VehiculoMotor,
  vehiculoMotorResolvers,
};
