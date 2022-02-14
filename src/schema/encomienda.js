const { gql } = require("apollo-server-express");

const Encomienda = gql`
  extend type Query {
    "Consulta que retorna todas las encomiendas"
    encomiendas: [Encomienda]!
    "Consulta que retorna las encomiendas cuyos campos coincidan con los pasados por parámetro"
    encomiendasWhere(encomienda: EncomiendaInput!): [Encomienda]!
    "Consulta que retorna una encomienda por su id"
    encomienda(id: Int!): Encomienda
  }

  "Encomiendas que realizan los clientes"
  interface Encomienda {
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
    "Clente que envía la encomienda"
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
    "Actualiza una encomienda"
    updateEncomienda(id: Int!, encomienda: EncomiendaInput!): Encomienda
    "Elimina una encomienda"
    deleteEncomienda(id: Int!): Encomienda
  }

  "Input para actualizar una encomienda"
  input EncomiendaInput {
    "Cédula del cliente que envía la encomienda"
    cedulaEmisor: String
    "Cédula del cliente que recibe la encomienda"
    cedulaReceptor: String
    "Status de la encomienda"
    status: String
    "Fecha y hora de salida de la encomienda"
    fechaHoraSalida: DateTime
    "Fecha y hora de llegada de la encomienda"
    fechaHoraLlegada: DateTime
    "Id del núcleo de donde se envía la encomienda"
    idNucleoOrigen: Int
    "Id del núcleo donde se recibe la encomienda"
    idNucleoDestino: Int
    "Cédula del transportador que lleva la encomienda"
    cedulaTransportador: String
    "Precio de la encomienda"
    precio: Float
    "Comisión que recibe el transportador"
    comisionTransportador: Float
    "Id del vuelo donde se envía la encomienda"
    idVuelo: Int
  }
`;

const encomiendaResolvers = {
  Query: {
    encomiendas: (_parent, _args, context) => {
      return context.prisma.encomienda.findMany();
    },
    encomiendasWhere: (_parent, args, context) => {
      return context.prisma.encomienda.findMany({
        where: args.encomienda,
      });
    },
    encomienda: (_parent, args, context) => {
      return context.prisma.encomienda.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    updateEncomienda: (_parent, args, context) => {
      return context.prisma.encomienda.update({
        where: {
          id: args.id,
        },
        data: args.encomienda,
      });
    },
    deleteEncomienda: (_parent, args, context) => {
      return context.prisma.encomienda.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  Encomienda: {
    __resolveType: (parent) => {
      if (parent.tipo === "terrestre") {
        return "EncomiendaTerrestre";
      }

      return "EncomiendaAerea";
    },
    clienteEmisor: (parent, _args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: parent.cedulaEmisor,
        },
      });
    },
    clienteReceptor: (parent, _args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: parent.cedulaReceptor,
        },
      });
    },
    transportador: (parent, _args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: parent.cedulaTransportador,
        },
      });
    },
    nucleoOrigen: (parent, _args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: parent.idNucleoOrigen,
        },
      });
    },
    nucleoDestino: (parent, _args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: parent.idNucleoDestino,
        },
      });
    },
    paquetes: (parent, _args, context) => {
      return context.prisma.paquete.findMany({
        where: {
          idEncomienda: parent.id,
        },
      });
    },
  },
};

module.exports = {
  Encomienda,
  encomiendaResolvers,
};
