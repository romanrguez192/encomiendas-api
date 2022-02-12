const { gql } = require("apollo-server-express");

const EncomiendaTerrestre = gql`
  extend type Query {
    "Consulta que retorna todos las encomiendas terrestres"
    encomiendasTerrestres: [EncomiendaTerrestre]!
  }

  "Encomiendas terrestres"
  type EncomiendaTerrestre implements Encomienda {
    "Id de la encomienda"
    id: Int!
    "Tipo de encomienda"
    tipo: String!
    "Status de la encomienda"
    status: String!
    "Fecha y hora de salida de la encomienda"
    fechaHoraSalida: DateTime!
    "Fecha y hora de llegada de la encomienda"
    fechaHoraLlegada: DateTime
    "Precio de la encomienda"
    precio: Float
    "Comisión que recibe el transportador"
    comisionTransportador: Float
    "Cliente que envía la encomienda"
    clienteEmisor: Cliente!
    "Cliente que recibe la encomienda"
    clienteReceptor: Cliente!
    "Transportador que lleva la encomienda"
    transportador: Transportador!
    "Núcleo de donde se envía la encomienda"
    nucleoOrigen: Nucleo!
    "Núcleo donde se recibe la encomienda"
    nucleoDestino: Nucleo!
    "Paquetes que se envían en la encomienda"
    paquetes: [Paquete]!
  }

  extend type Mutation {
    "Crea una encomienda terrestre"
    createEncomiendaTerrestre(
      encomiendaTerrestre: EncomiendaTerrestreInput!
    ): EncomiendaTerrestre
  }

  "Input para crear una encomienda terrestre"
  input EncomiendaTerrestreInput {
    "Cédula del cliente que envía la encomienda"
    cedulaEmisor: String!
    "Cédula del cliente que recibe la encomienda"
    cedulaReceptor: String!
    "Status de la encomienda"
    status: String!
    "Fecha y hora de salida de la encomienda"
    fechaHoraSalida: DateTime!
    "Fecha y hora de llegada de la encomienda"
    fechaHoraLlegada: DateTime
    "Id del núcleo de donde se envía la encomienda"
    idNucleoOrigen: Int!
    "Id del núcleo donde se recibe la encomienda"
    idNucleoDestino: Int!
    "Cédula del transportador que lleva la encomienda"
    cedulaTransportador: String!
    "Precio de la encomienda"
    precio: Float
    "Comisión que recibe el transportador"
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
