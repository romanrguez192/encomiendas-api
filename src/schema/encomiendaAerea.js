const { gql } = require("apollo-server-express");

const EncomiendaAerea = gql`
  extend type Query {
    encomiendasAereas: [EncomiendaAerea]!
  }

  type EncomiendaAerea implements Encomienda {
    id: Int!
    tipo: String!
    status: String!
    fechaHoraSalida: DateTime!
    fechaHoraLlegada: DateTime
    precio: Float
    comisionTransportador: Float
    clienteEmisor: Cliente!
    clienteReceptor: Cliente!
    transportador: Transportador!
    nucleoOrigen: Nucleo!
    nucleoDestino: Nucleo!
    vuelo: Vuelo!
    paquetes: [Paquete]!
  }

  extend type Mutation {
    createEncomiendaAerea(
      encomiendaAerea: EncomiendaAereaInput!
    ): EncomiendaAerea
  }

  input EncomiendaAereaInput {
    cedulaEmisor: String!
    cedulaReceptor: String!
    status: String!
    fechaHoraSalida: DateTime!
    fechaHoraLlegada: DateTime
    idNucleoOrigen: Int!
    idNucleoDestino: Int!
    cedulaTransportador: String!
    precio: Float
    comisionTransportador: Float
    idVuelo: Int!
  }
`;

const encomiendaAereaResolvers = {
  Query: {
    encomiendasAereas: (_parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          tipo: "aerea",
        },
      });
    },
  },
  Mutation: {
    createEncomiendaAerea: (_parent, args, context) => {
      return context.prisma.encomienda.create({
        data: {
          tipo: "aerea",
          ...args.encomiendaAerea,
        },
      });
    },
  },
  EncomiendaAerea: {
    vuelo: (parent, _args, context) => {
      return context.prisma.vuelo.findUnique({
        where: {
          id: parent.idVuelo,
        },
      });
    },
  },
};

module.exports = {
  EncomiendaAerea,
  encomiendaAereaResolvers,
};
