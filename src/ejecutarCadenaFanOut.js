const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { resolverViaje } = require('./resolverViaje.js');

function ejecutarCadenaFanOut() {
  // a. SETUP
  const grid = crearGrid(2, 2, 'verde');
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  const reforestacion = crearNodoProductivo('reforestacion', 2, 1, null);
  colocarNodo(grid, 0, 0, 'no_extractiva', bomba);
  colocarNodo(grid, 1, 0, 'agricultura', granja);
  colocarNodo(grid, 0, 1, 'reforestacion', reforestacion);
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const verticeReforestacion = verticeEntrada(0, 1, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));
  conectarVertices(grafo, verticeBomba, verticeReforestacion, crearTramo('carretera', 10, 1, 'mercaderia'));

  // b. PRODUCCION Y REPARTO DE LA BOMBA
  const aguaProducida = producirTickNodo(bomba, 0);
  const aguaParaGranja = 2;
  const aguaParaReforestacion = 2;

  // c. ENVIO A LA GRANJA
  const resultadoViajeGranja = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaParaGranja);
  const aguaRecibidaGranja = resultadoViajeGranja.entregado;
  const manzanasProducidas = producirTickNodo(granja, aguaRecibidaGranja);

  // d. ENVIO A REFORESTACION
  const resultadoViajeReforestacion = resolverViaje(grafo, verticeBomba, verticeReforestacion, 'mercaderia', aguaParaReforestacion);
  const aguaRecibidaReforestacion = resultadoViajeReforestacion.entregado;
  const arbolesProducidos = producirTickNodo(reforestacion, aguaRecibidaReforestacion);

  // e. Devolver
  return {
    aguaProducida,
    aguaParaGranja,
    aguaRecibidaGranja,
    manzanasProducidas,
    aguaParaReforestacion,
    aguaRecibidaReforestacion,
    arbolesProducidos,
  };
}

module.exports = { ejecutarCadenaFanOut };
