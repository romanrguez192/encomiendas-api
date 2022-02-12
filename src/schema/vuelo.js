const { gql } = require("apollo-server-express");

const Vuelo = gql`
  extend type Query {
    "Consulta que retorna todos los vuelos"
    vuelos: [Vuelo]!
    "Consulta que retorna un vuelo por id"
    vuelo(id: Int!): Cliente
  }

  "Vuelos en los que se envían encomiendas"
  type Vuelo {
    "Id del vuelo"
    id: Int!
    "Duración del vuelo en minutos"
    duracionVuelo: Int
    "Fecha y hora de salida estimada"
    fechaHoraSalidaEstimada: DateTime!
    "Fecha y hora de llegada estimada"
    fechaHoraLlegadaEstimada: DateTime!
    "Fecha y hora de salida real"
    fechaHoraSalidaReal: DateTime
    "Fecha y hora de llegada real"
    fechaHoraLlegadaReal: DateTime
    "Si hubo retraso en el vuelo"
    retraso: Boolean!
    "Descripción del retraso"
    descripcionRetraso: String
    "Duración del retraso en minutos"
    duracionRetraso: Int
    "Dirección de salida"
    direccionOrigen: Direccion!
    "Dirección de llegada"
    direccionDestino: Direccion!
    "Encomiendas que van en el vuelo"
    encomiendas: [EncomiendaAerea]!
  }

  extend type Mutation {
    "Crea un vuelo"
    createVuelo(vuelo: VueloInput!): Vuelo
    "Actualiza un vuelo"
    updateVuelo(id: Int!, vuelo: VueloUpdateInput!): Vuelo
    "Elimina un vuelo"
    deleteVuelo(id: Int!): Vuelo
  }

  "Input para crear un vuelo"
  input VueloInput {
    "Duración del vuelo en minutos"
    duracionVuelo: Int
    "Fecha y hora de salida estimada"
    fechaHoraSalidaEstimada: DateTime!
    "Fecha y hora de llegada estimada"
    fechaHoraLlegadaEstimada: DateTime!
    "Descripción del retraso"
    descripcionRetraso: String
    "Duración del retraso en minutos"
    duracionRetraso: Int
    "Id de la dirección de salida"
    idDireccionOrigen: Int!
    "Id de la dirección de llegada"
    idDireccionDestino: Int!
  }

  "Input para actualizar un vuelo"
  input VueloUpdateInput {
    "Duración del vuelo en minutos"
    duracionVuelo: Int
    "Fecha y hora de salida estimada"
    fechaHoraSalidaEstimada: DateTime
    "Fecha y hora de llegada estimada"
    fechaHoraLlegadaEstimada: DateTime
    "Descripción del retraso"
    descripcionRetraso: String
    "Duración del retraso en minutos"
    duracionRetraso: Int
    "Id de la dirección de salida"
    idDireccionOrigen: Int
    "Id de la dirección de llegada"
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
