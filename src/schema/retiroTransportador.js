const { gql } = require("apollo-server-express");

const RetiroTransportador = gql`
  extend type Query {
    "Consulta que retorna todos los retiros de transportadores"
    retirosTransportadores: [RetiroTransportador]!
  }

  "Retiros hechos por los transportadores"
  type RetiroTransportador implements Retiro {
    "Id del retiro"
    id: Int!
    "Precio del retiro en dólares"
    precio: Float!
    "Saldo retirado"
    saldo: Float!
    "Fecha del retiro"
    fecha: Date!
    "Transportador que realiza el retiro"
    transportador: Transportador
  }

  extend type Mutation {
    "Crea un retiro de transportador"
    createRetiroTransportador(
      retiroTransportador: RetiroTransportadorInput!
    ): RetiroTransportador
  }

  "Input para crear un retiro de transportador"
  input RetiroTransportadorInput {
    "Precio del retiro en dólares"
    precio: Float!
    "Saldo retirado"
    saldo: Float
    "Fecha del retiro"
    fecha: Date
    "Cédula del transportador que realiza el retiro"
    cedulaTransportador: String!
  }
`;

const retiroTransportadorResolvers = {
  Query: {
    retirosTransportadores: (_parent, _args, context) => {
      return context.prisma.retiro.findMany({
        where: {
          cedulaCliente: null,
        },
      });
    },
  },
  Mutation: {
    createRetiroTransportador: (_parent, args, context) => {
      return context.prisma.retiro.create({
        data: args.retiroTransportador,
      });
    },
  },
  RetiroTransportador: {
    transportador: (parent, _args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: parent.cedulaTransportador,
        },
      });
    },
  },
};

module.exports = {
  RetiroTransportador,
  retiroTransportadorResolvers,
};
