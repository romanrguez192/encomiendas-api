const { gql } = require("apollo-server-express");

const Paquete = gql`
  extend type Query {
    "Consulta que retorna todos los paquetes"
    paquetes: [Paquete]!
    "Consulta que retorna un paquete por su id"
    paquete(id: Int!): Paquete
  }

  "Paquetes que se encuentran en una encomienda"
  type Paquete {
    "Id del paquete"
    id: Int!
    "Si el paquete está en empaquetado"
    empaquetado: Boolean!
    "Peso del paquete en gramos"
    peso: Int
    "Alto del paquete en centímetros"
    alto: Int
    "Ancho del paquete en centímetros"
    ancho: Int
    "Profundidad del paquete en centímetros"
    profundidad: Int
    "Si el paquete es frágil"
    fragil: Boolean!
    "Tarifa del paquete"
    tarifa: Float
    "Encomienda a la que pertenece este paquete"
    encomienda: Encomienda!
    "Artículos que se encuentran en este paquete"
    articulos: [Articulo]!
  }

  extend type Mutation {
    "Crea un paquete"
    createPaquete(paquete: PaqueteInput!): Paquete
    "Actualiza un paquete"
    updatePaquete(id: Int!, paquete: PaqueteUpdateInput!): Paquete
    "Elimina un paquete"
    deletePaquete(id: Int!): Paquete
  }

  "Input para crear un paquete"
  input PaqueteInput {
    "Si el paquete está en empaquetado"
    empaquetado: Boolean!
    "Peso del paquete en gramos"
    peso: Int!
    "Alto del paquete en centímetros"
    alto: Int
    "Ancho del paquete en centímetros"
    ancho: Int
    "Profundidad del paquete en centímetros"
    profundidad: Int
    "Si el paquete es frágil"
    fragil: Boolean!
    "Tarifa del paquete"
    tarifa: Float
    "Id de la encomienda a la que pertenece este paquete"
    idEncomienda: Int!
  }

  "Input para actualizar un paquete"
  input PaqueteUpdateInput {
    "Si el paquete está en empaquetado"
    empaquetado: Boolean
    "Peso del paquete en gramos"
    peso: Int
    "Alto del paquete en centímetros"
    alto: Int
    "Ancho del paquete en centímetros"
    ancho: Int
    "Profundidad del paquete en centímetros"
    profundidad: Int
    "Si el paquete es frágil"
    fragil: Boolean
    "Tarifa del paquete"
    tarifa: Float
    "Id de la encomienda a la que pertenece este paquete"
    idEncomienda: Int
  }
`;

const paqueteResolvers = {
  Query: {
    paquetes: (_parent, _args, context) => {
      return context.prisma.paquete.findMany();
    },
    paquete: (_parent, args, context) => {
      return context.prisma.paquete.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createPaquete: (_parent, args, context) => {
      return context.prisma.paquete.create({
        data: args.paquete,
      });
    },
    updatePaquete: (_parent, args, context) => {
      return context.prisma.paquete.update({
        where: {
          id: args.id,
        },
        data: args.paquete,
      });
    },
    deletePaquete: (_parent, args, context) => {
      return context.prisma.paquete.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  Paquete: {
    encomienda: (parent, _args, context) => {
      return context.prisma.encomienda.findUnique({
        where: {
          id: parent.idEncomienda,
        },
      });
    },
    articulos: (parent, _args, context) => {
      return context.prisma.articulo.findMany({
        where: {
          idPaquete: parent.id,
        },
      });
    },
  },
};

module.exports = {
  Paquete,
  paqueteResolvers,
};
