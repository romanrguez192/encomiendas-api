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
