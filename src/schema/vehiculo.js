const { gql } = require("apollo-server-express");

const Vehiculo = gql`
  extend type Query {
    "Consulta que retorna todos los vehículos"
    vehiculos: [Vehiculo]!
    "Consulta que retorna los vehículos cuyos campos coincidan con los pasados por parámetro"
    vehiculosWhere(vehiculo: VehiculoInput!): [Vehiculo]!
    "Consulta que retorna un vehículo por id"
    vehiculo(id: Int!): Vehiculo
  }

  "Vehículos de los transportadores"
  interface Vehiculo {
    "Id del vehículo"
    id: Int!
    "Color del vehículo"
    color: String!
    "Tipo de vehículo"
    tipo: String!
    "Transportador al que le pertenece el vehículo"
    transportador: Transportador!
  }

  extend type Mutation {
    "Actualiza un vehículo"
    updateVehiculo(id: Int!, vehiculo: VehiculoInput): Vehiculo
    "Elimina un vehículo"
    deleteVehiculo(id: Int!): Vehiculo
  }

  "Input para actualizar un vehículo"
  input VehiculoInput {
    "Color del vehículo"
    color: String
    "Tipo de vehículo"
    tipo: String
    "Cédula del transportador al que pertenece el vehículo"
    cedulaTransportador: String
    "Marca del vehículo"
    marca: String
    "Modelo del vehículo"
    modelo: String
    "Placa del vehículo"
    placa: String
  }
`;

const vehiculoResolvers = {
  Query: {
    vehiculos: (_parent, _args, context) => {
      return context.prisma.vehiculo.findMany();
    },
    vehiculosWhere: (_parent, args, context) => {
      return context.prisma.vehiculo.findMany({
        where: args.vehiculo,
      });
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
