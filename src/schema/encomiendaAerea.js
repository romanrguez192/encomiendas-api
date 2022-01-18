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
