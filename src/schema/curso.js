const { gql } = require("apollo-server-express");

const Curso = gql`
  extend type Query {
    cursos: [Curso]!
    curso(id: Int!): Curso
  }

  type Curso {
    id: Int!
    nombre: String!
    lugar: String!
    fecha: Date!
    transportadores: [Transportador]!
  }

  extend type Mutation {
    createCurso(curso: CursoInput!): Curso
    updateCurso(id: Int!, curso: CursoUpdateInput!): Curso
    deleteCurso(id: Int!): Curso
    addTransportadorToCurso(idCurso: Int!, cedulaTransportador: String!): Curso
    deleteTransportadorFromCurso(
      idCurso: Int!
      cedulaTransportador: String!
    ): Curso
  }

  input CursoInput {
    nombre: String!
    lugar: String!
    fecha: Date!
  }

  input CursoUpdateInput {
    nombre: String
    lugar: String
    fecha: Date
  }
`;

const cursoResolvers = {
  Query: {
    cursos: (_parent, _args, context) => {
      return context.prisma.curso.findMany();
    },
    curso: (_parent, args, context) => {
      return context.prisma.curso.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createCurso: (_parent, args, context) => {
      return context.prisma.curso.create({
        data: args.curso,
      });
    },
    updateCurso: (_parent, args, context) => {
      return context.prisma.curso.update({
        where: {
          id: args.id,
        },
        data: args.curso,
      });
    },
    deleteCurso: (_parent, args, context) => {
      return context.prisma.curso.delete({
        where: {
          id: args.id,
        },
      });
    },
    addTransportadorToCurso: (_parent, args, context) => {
      return context.prisma.curso.update({
        where: {
          id: args.idCurso,
        },
        data: {
          transportadores: {
            create: {
              cedulaTransportador: args.cedulaTransportador,
            },
          },
        },
      });
    },
    deleteTransportadorFromCurso: (_parent, args, context) => {
      return context.prisma.curso.update({
        where: {
          id: args.idCurso,
        },
        data: {
          transportadores: {
            deleteMany: {
              cedulaTransportador: args.cedulaTransportador,
            },
          },
        },
      });
    },
  },
  Curso: {
    transportadores: (parent, _args, context) => {
      return context.prisma.transportador.findMany({
        where: {
          cursos: {
            some: {
              curso: {
                id: parent.id,
              },
            },
          },
        },
      });
    },
  },
};

module.exports = {
  Curso,
  cursoResolvers,
};
