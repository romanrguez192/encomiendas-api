const { gql } = require("apollo-server-express");

const Curso = gql`
  extend type Query {
    "Consulta que retorna todos los cursos"
    cursos: [Curso]!
    "Consulta que retorna los cursos cuyos campos coincidan con los pasados por parámetro"
    cursosWhere(curso: CursoUpdateInput!): [Curso]!
    "Consulta que retorna un curso por su id"
    curso(id: Int!): Curso
  }

  "Cursos que realizan los transportadores"
  type Curso {
    "Id del curso"
    id: Int!
    "Nombre del curso"
    nombre: String!
    "Lugar del curso"
    lugar: String!
    "Fecha del curso"
    fecha: Date!
    "Transportador que hicieron el curso"
    transportadores: [Transportador]!
  }

  extend type Mutation {
    "Crea un curso"
    createCurso(curso: CursoInput!): Curso
    "Actualiza un curso"
    updateCurso(id: Int!, curso: CursoUpdateInput!): Curso
    "Elimina un curso"
    deleteCurso(id: Int!): Curso
    "Agrega un transportador a un curso"
    addTransportadorToCurso(idCurso: Int!, cedulaTransportador: String!): Curso
    "Elimina a un transportador de un curso"
    deleteTransportadorFromCurso(
      idCurso: Int!
      cedulaTransportador: String!
    ): Curso
  }

  "Input para crear un curso"
  input CursoInput {
    "Nombre del curso"
    nombre: String!
    "Lugar del curso"
    lugar: String!
    "Fecha del curso"
    fecha: Date!
  }

  "Input para actualizar un curso"
  input CursoUpdateInput {
    "Nombre del curso"
    nombre: String
    "Lugar del curso"
    lugar: String
    "Fecha del curso"
    fecha: Date
  }
`;

const cursoResolvers = {
  Query: {
    cursos: (_parent, _args, context) => {
      return context.prisma.curso.findMany();
    },
    cursosWhere: (_parent, args, context) => {
      return context.prisma.curso.findMany({
        where: args.curso,
      });
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
