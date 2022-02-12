const { gql } = require("apollo-server-express");

const VehiculoMotor = gql`
  extend type Query {
    "Consulta que retorna todos los vehículos a motor"
    vehiculosMotor: [VehiculoMotor]!
  }

  "Vehículos a motor de los transportadores"
  type VehiculoMotor implements Vehiculo {
    "Id del vehículo"
    id: Int!
    "Color del vehículo"
    color: String!
    "Tipo de vehículo"
    tipo: String!
    "Transportador al que le pertenece el vehículo"
    transportador: Transportador!
    "Marca del vehículo"
    marca: String!
    "Modelo del vehículo"
    modelo: String!
    "Placa del vehículo"
    placa: String!
  }

  extend type Mutation {
    "Crea un vehículo a motor"
    createVehiculoMotor(vehiculoMotor: VehiculoMotorInput): VehiculoMotor
  }

  "Input para crear un vehículo a motor"
  input VehiculoMotorInput {
    "Color del vehículo"
    color: String!
    "Cédula del transportador al que pertenece el vehículo"
    cedulaTransportador: String!
    "Marca del vehículo"
    marca: String!
    "Modelo del vehículo"
    modelo: String!
    "Placa del vehículo"
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
