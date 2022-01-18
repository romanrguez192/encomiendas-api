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
  Vehiculo: {
    __resolveType: (obj) => {
      if (obj.tipo === "motor") {
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
