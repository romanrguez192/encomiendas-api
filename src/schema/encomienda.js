const { gql } = require("apollo-server-express");

const Encomienda = gql`
  extend type Query {
    encomiendas: [Encomienda]!
    encomienda(id: Int!): Encomienda
  }

  interface Encomienda {
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
    updateEncomienda(id: Int!, encomienda: EncomiendaInput!): Encomienda
    deleteEncomienda(id: Int!): Encomienda
  }

  input EncomiendaInput {
    cedulaEmisor: String
    cedulaReceptor: String
    status: String
    fechaHoraSalida: DateTime
    fechaHoraLlegada: DateTime
    idNucleoOrigen: Int
    idNucleoDestino: Int
    cedulaTransportador: String
    precio: Float
    comisionTransportador: Float
    idVuelo: Int
  }
`;

const encomiendaResolvers = {
  Query: {
    encomiendas: (_parent, _args, context) => {
      return context.prisma.encomienda.findMany();
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
