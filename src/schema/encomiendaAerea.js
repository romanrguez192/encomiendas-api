const { gql } = require("apollo-server-express");

const EncomiendaAerea = gql`
  extend type Query {
    "Consulta que retorna todas las encomiendas aéreas"
    encomiendasAereas: [EncomiendaAerea]!
  }

  "Encomiendas aéreas"
  type EncomiendaAerea implements Encomienda {
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
    "Vuelo en el que se envía la encomienda"
    vuelo: Vuelo!
    "Paquetes que se envían en la encomienda"
    paquetes: [Paquete]!
  }

  extend type Mutation {
    "Crea una encomienda aérea"
    createEncomiendaAerea(
      encomiendaAerea: EncomiendaAereaInput!
    ): EncomiendaAerea
  }

  "Input para crear una encomienda aérea"
  input EncomiendaAereaInput {
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
    "Id del vuelo en el que se envía la encomienda"
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
