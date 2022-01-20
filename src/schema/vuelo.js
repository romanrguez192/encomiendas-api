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
    encomiendas: [EncomiendaAerea]!
  }

  extend type Mutation {
    createVuelo(vuelo: VueloInput!): Vuelo
    updateVuelo(id: Int!, vuelo: VueloUpdateInput!): Vuelo
    deleteVuelo(id: Int!): Vuelo
  }

  input VueloInput {
    duracionVuelo: Int
    fechaHoraSalidaEstimada: DateTime!
    fechaHoraLlegadaEstimada: DateTime!
    descripcionRetraso: String
    duracionRetraso: Int
    idDireccionOrigen: Int!
    idDireccionDestino: Int!
  }

  input VueloUpdateInput {
    duracionVuelo: Int
    fechaHoraSalidaEstimada: DateTime
    fechaHoraLlegadaEstimada: DateTime
    descripcionRetraso: String
    duracionRetraso: Int
    idDireccionOrigen: Int
    idDireccionDestino: Int
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
  Mutation: {
    createVuelo: (_parent, args, context) => {
      return context.prisma.vuelo.create({
        data: args.vuelo,
      });
    },
    updateVuelo: (_parent, args, context) => {
      return context.prisma.vuelo.update({
        where: {
          id: args.id,
        },
        data: args.vuelo,
      });
    },
    deleteVuelo: (_parent, args, context) => {
      return context.prisma.vuelo.delete({
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
    encomiendas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          idVuelo: parent.id,
        },
      });
    },
  },
};

module.exports = {
  Vuelo,
  vueloResolvers,
};
