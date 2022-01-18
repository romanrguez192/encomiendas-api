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
};

module.exports = {
  EncomiendaTerrestre,
  encomiendaTerrestreResolvers,
};
