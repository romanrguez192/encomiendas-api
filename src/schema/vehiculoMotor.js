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
    marca: String
    modelo: String
    placa: String
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
};

module.exports = {
  VehiculoMotor,
  vehiculoMotorResolvers,
};
