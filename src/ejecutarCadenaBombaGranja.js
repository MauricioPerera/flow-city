const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { resolverViaje } = require('./resolverViaje.js');

function ejecutarCadenaBombaGranja(numTicks) {
  if (!Number.isInteger(numTicks) || numTicks <= 0) {
    throw new RangeError('numTicks debe ser un entero positivo');
  }

  const grid = crearGrid(2, 1, 'verde');
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  colocarNodo(grid, 0, 0, 'no_extractiva', bomba);
  colocarNodo(grid, 1, 0, 'agricultura', granja);
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));

  const historial = [];
  for (let tick = 0; tick < numTicks; tick += 1) {
    const aguaProducida = producirTickNodo(bomba, 0);
    const resultadoViaje = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaProducida);
    const aguaRecibida = resultadoViaje.entregado;
    const manzanasProducidas = producirTickNodo(granja, aguaRecibida);
    historial.push({ tick, aguaProducida, aguaRecibida, manzanasProducidas });
  }

  return historial;
}

module.exports = { ejecutarCadenaBombaGranja };