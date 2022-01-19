const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { DateResolver, DateTimeResolver } = require("graphql-scalars");
const { Cliente, clienteResolvers } = require("./cliente");
const { Direccion, direccionResolvers } = require("./direccion");
const { Nucleo, nucleoResolvers } = require("./nucleo");
const { Transportador, transportadorResolvers } = require("./transportador");
const { Vehiculo, vehiculoResolvers } = require("./vehiculo");
const { VehiculoMotor, vehiculoMotorResolvers } = require("./vehiculoMotor");
const { Bicicleta, bicicletaResolvers } = require("./bicicleta");
const { Recarga, recargaResolvers } = require("./recarga");
const { Retiro, retiroResolvers } = require("./retiro");
const { RetiroCliente, retiroClienteResolvers } = require("./retiroCliente");
const {
  RetiroTransportador,
  retiroTransportadorResolvers,
} = require("./retiroTransportador");
const { Curso, cursoResolvers } = require("./curso");
const { Vuelo, vueloResolvers } = require("./vuelo");
const { Encomienda, encomiendaResolvers } = require("./encomienda");
const {
  EncomiendaTerrestre,
  encomiendaTerrestreResolvers,
} = require("./encomiendaTerrestre");
const {
  EncomiendaAerea,
  encomiendaAereaResolvers,
} = require("./encomiendaAerea");
const { Paquete, paqueteResolvers } = require("./paquete");
const { Articulo, articuloResolvers } = require("./articulo");

const typeDefs = gql`
  scalar Date
  scalar DateTime

  type Query {
    autores: [String!]!
  }

  type Mutation {
    autores: [String!]!
  }
`;

const resolvers = {
  Date: DateResolver,
  DateTime: DateTimeResolver,
  Query: {
    autores: () => [
      "Román Rodríguez",
      "Luisa López",
      "María Guerra",
      "Mónica Cuaulma",
    ],
  },
  Mutation: {
    autores: () => [
      "Román Rodríguez",
      "Luisa López",
      "María Guerra",
      "Mónica Cuaulma",
    ],
  },
};

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    Cliente,
    Direccion,
    Nucleo,
    Transportador,
    Vehiculo,
    VehiculoMotor,
    Bicicleta,
    Recarga,
    Retiro,
    RetiroCliente,
    RetiroTransportador,
    Curso,
    Vuelo,
    Encomienda,
    EncomiendaTerrestre,
    EncomiendaAerea,
    Paquete,
    Articulo,
  ],
  resolvers: [
    resolvers,
    clienteResolvers,
    direccionResolvers,
    nucleoResolvers,
    transportadorResolvers,
    vehiculoResolvers,
    vehiculoMotorResolvers,
    bicicletaResolvers,
    recargaResolvers,
    retiroResolvers,
    retiroClienteResolvers,
    retiroTransportadorResolvers,
    cursoResolvers,
    vueloResolvers,
    encomiendaResolvers,
    encomiendaTerrestreResolvers,
    encomiendaAereaResolvers,
    paqueteResolvers,
    articuloResolvers,
  ],
  inheritResolversFromInterfaces: true,
});

module.exports = schema;
