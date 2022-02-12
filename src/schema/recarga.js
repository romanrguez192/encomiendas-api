const { gql } = require("apollo-server-express");

const Recarga = gql`
  extend type Query {
    "Consulta que retorna todas las recargas"
    recargas: [Recarga]!
    "Consulta que retorna una recarga por su id"
    recarga(id: Int!): Recarga
  }

  "Recargas hechas por los clientes"
  type Recarga {
    "Id de la recarga"
    id: Int!
    "Precio de la recarga en dólares"
    precio: Float!
    "Saldo recargado"
    saldo: Float!
    "Fecha de la recarga"
    fecha: Date!
    "Cliente que realiza la recarga"
    cliente: Cliente!
  }

  extend type Mutation {
    "Crea una recarga"
    createRecarga(recarga: RecargaInput!): Recarga
    "Actualiza una recarga"
    updateRecarga(id: Int!, recarga: RecargaUpdateInput!): Recarga
    "Elimina una recarga"
    deleteRecarga(id: Int!): Recarga
  }

  "Input para crear una recarga"
  input RecargaInput {
    "Precio de la recarga en dólares"
    precio: Float!
    "Fecha de la recarga"
    fecha: Date
    "Saldo recargado"
    saldo: Float
    "Cédula del cliente que realiza la recarga"
    cedulaCliente: String!
  }

  "Input para actualizar una recarga"
  input RecargaUpdateInput {
    "Precio de la recarga en dólares"
    precio: Float
    "Fecha de la recarga"
    fecha: Date
    "Saldo recargado"
    saldo: Float
    "Cédula del cliente que realiza la recarga"
    cedulaCliente: String
  }
`;

const recargaResolvers = {
  Query: {
    recargas: (_parent, _args, context) => {
      return context.prisma.recarga.findMany();
    },
    recarga: (_parent, args, context) => {
      return context.prisma.recarga.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createRecarga: (_parent, args, context) => {
      return context.prisma.recarga.create({
        data: args.recarga,
      });
    },
    updateRecarga: (_parent, args, context) => {
      return context.prisma.recarga.update({
        where: {
          id: args.id,
        },
        data: args.recarga,
      });
    },
    deleteRecarga: (_parent, args, context) => {
      return context.prisma.recarga.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  Recarga: {
    cliente: (parent, _args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: parent.cedulaCliente,
        },
      });
    },
  },
};

module.exports = {
  Recarga,
  recargaResolvers,
};
