const { gql } = require("apollo-server-express");

const EncomiendaTerrestre = gql`
  extend type Query {
    encomiendasTerrestres: [EncomiendaTerrestre]!
  }

  type EncomiendaTerrestre implements Encomienda {
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
    paquetes: [Paquete]!
  }

  extend type Mutation {
    createEncomiendaTerrestre(
      encomiendaTerrestre: EncomiendaTerrestreInput!
    ): EncomiendaTerrestre
  }

  input EncomiendaTerrestreInput {
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
  }
`;

const encomiendaTerrestreResolvers = {
  Query: {
    encomiendasTerrestres: (_parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          tipo: "terrestre",
        },
      });
    },
  },
  Mutation: {
    createEncomiendaTerrestre: (_parent, args, context) => {
      return context.prisma.encomienda.create({
        data: {
          tipo: "terrestre",
          ...args.encomiendaTerrestre,
        },
      });
    },
  },
};

module.exports = {
  EncomiendaTerrestre,
  encomiendaTerrestreResolvers,
};
