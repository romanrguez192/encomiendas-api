const { gql } = require("apollo-server-express");

const Transportador = gql`
  extend type Query {
    transportadores: [Transportador]!
    transportador(cedula: String!): Transportador
  }

  type Transportador {
    cedula: String!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    fechaIngreso: Date!
    disponible: Boolean!
    antecedentesPenales: Boolean!
    licencia: Boolean!
    nucleo: Nucleo!
    direccion: Direccion!
    vehiculos: [Vehiculo]!
    retiros: [RetiroTransportador]!
    cursos: [Curso]!
    encomiendas: [Encomienda]!
    saldo: Float!
    cantidadPedidos: Int!
  }

  extend type Mutation {
    createTransportador(transportador: TransportadorInput!): Transportador
    updateTransportador(
      cedula: String!
      transportador: TransportadorUpdateInput!
    ): Transportador
    deleteTransportador(cedula: String!): Transportador
    addCursoToTransportador(
      cedulaTransportador: String!
      idCurso: Int!
    ): Transportador
    deleteCursoFromTransportador(
      cedulaTransportador: String!
      idCurso: Int!
    ): Transportador
  }

  input TransportadorInput {
    cedula: String!
    nombre: String!
    apellido: String!
    telefono: String!
    telefonoAlternativo: String
    email: String!
    fechaIngreso: Date!
    disponible: Boolean!
    antecedentesPenales: Boolean!
    licencia: Boolean!
    idNucleo: Int!
    idDireccion: Int!
  }

  input TransportadorUpdateInput {
    cedula: String
    nombre: String
    apellido: String
    telefono: String
    telefonoAlternativo: String
    email: String
    fechaIngreso: Date
    disponible: Boolean
    antecedentesPenales: Boolean
    licencia: Boolean
    idNucleo: Int
    idDireccion: Int
  }
`;

const transportadorResolvers = {
  Query: {
    transportadores: (_parent, _args, context) => {
      return context.prisma.transportador.findMany();
    },
    transportador: (_parent, args, context) => {
      return context.prisma.transportador.findUnique({
        where: {
          cedula: args.cedula,
        },
      });
    },
  },
  Mutation: {
    createTransportador: (_parent, args, context) => {
      return context.prisma.transportador.create({
        data: args.transportador,
      });
    },
    updateTransportador: (_parent, args, context) => {
      return context.prisma.transportador.update({
        where: {
          cedula: args.cedula,
        },
        data: args.transportador,
      });
    },
    deleteTransportador: (_parent, args, context) => {
      return context.prisma.transportador.delete({
        where: {
          cedula: args.cedula,
        },
      });
    },
    addCursoToTransportador: (_parent, args, context) => {
      return context.prisma.transportador.update({
        where: {
          cedula: args.cedulaTransportador,
        },
        data: {
          cursos: {
            create: {
              idCurso: args.idCurso,
            },
          },
        },
      });
    },
    deleteCursoFromTransportador: (_parent, args, context) => {
      return context.prisma.transportador.update({
        where: {
          cedula: args.cedulaTransportador,
        },
        data: {
          cursos: {
            deleteMany: {
              idCurso: args.idCurso,
            },
          },
        },
      });
    },
  },
  Transportador: {
    nucleo: (parent, _args, context) => {
      return context.prisma.nucleo.findUnique({
        where: {
          id: parent.idNucleo,
        },
      });
    },
    direccion: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccion,
        },
      });
    },
    vehiculos: (parent, _args, context) => {
      return context.prisma.vehiculo.findMany({
        where: {
          cedulaTransportador: parent.cedula,
        },
      });
    },
    retiros: (parent, _args, context) => {
      return context.prisma.retiro.findMany({
        where: {
          cedulaTransportador: parent.cedula,
        },
      });
    },
    cursos: (parent, _args, context) => {
      return context.prisma.curso.findMany({
        where: {
          transportadores: {
            some: {
              transportador: {
                cedula: parent.cedula,
              },
            },
          },
        },
      });
    },
    encomiendas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          cedulaTransportador: parent.cedula,
        },
      });
    },
    saldo: async (parent, _args, context) => {
      const transportador = await context.prisma.vistaTransportador.findUnique({
        where: {
          cedula: parent.cedula,
        },
      });

      return transportador.saldo;
    },
    cantidadPedidos: async (parent, _args, context) => {
      const transportador = await context.prisma.vistaTransportador.findUnique({
        where: {
          cedula: parent.cedula,
        },
      });

      return transportador.cantidadPedidos;
    },
  },
};

module.exports = {
  Transportador,
  transportadorResolvers,
};
