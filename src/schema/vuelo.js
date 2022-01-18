const { gql } = require("apollo-server-express");

const Vuelo = gql`
  extend type Query {
    vuelos: [Vuelo]!
    vuelo(id: Int!): Cliente
  }

  type Vuelo {
    id: Int!
    duracionVuelo: Int
    fechaHoraSalidaEstimada: DateTime!
    fechaHoraLlegadaEstimada: DateTime!
    fechaHoraSalidaReal: DateTime
    fechaHoraLlegadaReal: DateTime
    retraso: Boolean!
    descripcionRetraso: String
    duracionRetraso: Int
    direccionOrigen: Direccion!
    direccionDestino: Direccion!
  }
`;

const vueloResolvers = {
  Query: {
    vuelos: (_parent, _args, context) => {
      return context.prisma.vuelo.findMany();
    },
    vuelo: (_parent, args, context) => {
      return context.prisma.vuelo.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Vuelo: {
    retraso: async (parent, _args, context) => {
      const vuelo = await context.prisma.vistaVuelo.findUnique({
        where: {
          id: parent.id,
        },
      });

      return vuelo.retraso;
    },
    fechaHoraSalidaReal: async (parent, _args, context) => {
      const vuelo = await context.prisma.vistaVuelo.findUnique({
        where: {
          id: parent.id,
        },
      });

      return vuelo.fechaHoraSalidaReal;
    },
    fechaHoraLlegadaReal: async (parent, _args, context) => {
      const vuelo = await context.prisma.vistaVuelo.findUnique({
        where: {
          id: parent.id,
        },
      });

      return vuelo.fechaHoraLlegadaReal;
    },
    direccionOrigen: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccionOrigen,
        },
      });
    },
    direccionDestino: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccionDestino,
        },
      });
    },
  },
};

module.exports = {
  Vuelo,
  vueloResolvers,
};
