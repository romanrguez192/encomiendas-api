const { gql } = require("apollo-server-express");

const Vehiculo = gql`
  extend type Query {
    vehiculos: [Vehiculo]!
    vehiculo(id: Int!): Vehiculo
  }

  interface Vehiculo {
    id: Int!
    color: String!
    tipo: String!
    transportador: Transportador!
  }

  extend type Mutation {
    updateVehiculo(id: Int!, vehiculo: VehiculoInput): Vehiculo
    deleteVehiculo(id: Int!): Vehiculo
  }

  input VehiculoInput {
    color: String
    tipo: String
    cedulaTransportador: String
    marca: String
    modelo: String
    placa: String
  }
`;

const vehiculoResolvers = {
  Query: {
    vehiculos: (_parent, _args, context) => {
      return context.prisma.vehiculo.findMany();
    },
    vehiculo: (_parent, args, context) => {
      return context.prisma.vehiculo.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    updateVehiculo: async (_parent, args, context) => {
      return context.prisma.vehiculo.update({
        where: {
          id: args.id,
        },
        data: args.vehiculo,
      });
    },
    deleteVehiculo: async (_parent, args, context) => {
      return context.prisma.vehiculo.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  Vehiculo: {
    __resolveType: (parent) => {
      if (parent.tipo === "motor") {
        return "VehiculoMotor";
      }

      return "Bicicleta";
    },
    transportador: (parent, _args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: parent.cedulaTransportador,
        },
      });
    },
  },
};

module.exports = {
  Vehiculo,
  vehiculoResolvers,
};
