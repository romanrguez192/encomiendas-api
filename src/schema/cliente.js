const { gql } = require("apollo-server-express");

const Cliente = gql`
  extend type Query {
    "Consulta que retorna todos los clientes"
    clientes: [Cliente]!
    "Consulta que retorna un cliente dada su cédula"
    cliente(cedula: String!): Cliente
  }

  "Clientes de la empresa"
  type Cliente {
    "Cédula del cliente"
    cedula: String!
    "Nombre del cliente"
    nombre: String!
    "Apellido del cliente"
    apellido: String!
    "Teléfono del cliente"
    telefono: String!
    "Teléfono alternativo del cliente"
    telefonoAlternativo: String
    "Email del cliente"
    email: String!
    "Dirección del cliente"
    direccion: Direccion
    "Recargas hechas por el cliente"
    recargas: [Recarga]!
    "Retiros hechos por el cliente"
    retiros: [RetiroCliente]!
    "Envíos hechos por el cliente"
    encomiendasEnviadas: [Encomienda]!
    "Envíos recibidos por el cliente"
    encomiendasRecibidas: [Encomienda]!
    "Saldo del cliente"
    saldo: Float!
  }

  extend type Mutation {
    "Crea un cliente"
    createCliente(cliente: ClienteInput!): Cliente
    "Actualiza un cliente"
    updateCliente(cedula: String!, cliente: ClienteUpdateInput!): Cliente
    "Elimina un cliente"
    deleteCliente(cedula: String!): Cliente
  }

  "Input para crear un cliente"
  input ClienteInput {
    "Cédula del cliente"
    cedula: String!
    "Nombre del cliente"
    nombre: String!
    "Apellido del cliente"
    apellido: String!
    "Teléfono del cliente"
    telefono: String!
    "Teléfono alternativo del cliente"
    telefonoAlternativo: String
    "Email del cliente"
    email: String!
    "Id de la dirección del cliente"
    idDireccion: Int!
  }

  "Input para actualizar un cliente"
  input ClienteUpdateInput {
    "Cédula del cliente"
    cedula: String
    "Nombre del cliente"
    nombre: String
    "Apellido del cliente"
    apellido: String
    "Teléfono del cliente"
    telefono: String
    "Teléfono alternativo del cliente"
    telefonoAlternativo: String
    "Email del cliente"
    email: String
    "Id de la dirección del cliente"
    idDireccion: Int
  }
`;

const clienteResolvers = {
  Query: {
    clientes: (_parent, _args, context) => {
      return context.prisma.cliente.findMany();
    },
    cliente: (_parent, args, context) => {
      return context.prisma.cliente.findUnique({
        where: {
          cedula: args.cedula,
        },
      });
    },
  },
  Mutation: {
    createCliente: (_parent, args, context) => {
      return context.prisma.cliente.create({
        data: args.cliente,
      });
    },
    updateCliente: (_parent, args, context) => {
      return context.prisma.cliente.update({
        where: {
          cedula: args.cedula,
        },
        data: args.cliente,
      });
    },
    deleteCliente: (_parent, args, context) => {
      return context.prisma.cliente.delete({
        where: {
          cedula: args.cedula,
        },
      });
    },
  },
  Cliente: {
    direccion: (parent, _args, context) => {
      return context.prisma.direccion.findUnique({
        where: {
          id: parent.idDireccion,
        },
      });
    },
    recargas: (parent, _args, context) => {
      return context.prisma.recarga.findMany({
        where: {
          cedulaCliente: parent.cedula,
        },
      });
    },
    retiros: (parent, _args, context) => {
      return context.prisma.retiro.findMany({
        where: {
          cedulaCliente: parent.cedula,
        },
      });
    },
    encomiendasEnviadas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          cedulaEmisor: parent.cedula,
        },
      });
    },
    encomiendasRecibidas: (parent, _args, context) => {
      return context.prisma.encomienda.findMany({
        where: {
          cedulaReceptor: parent.cedula,
        },
      });
    },
    saldo: async (parent, _args, context) => {
      const cliente = await context.prisma.vistaCliente.findUnique({
        where: {
          cedula: parent.cedula,
        },
      });

      return cliente.saldo;
    },
  },
};

module.exports = {
  Cliente,
  clienteResolvers,
};
