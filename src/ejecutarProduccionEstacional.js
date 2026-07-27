const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { resolverViaje } = require('./resolverViaje.js');
const { calendarioDeTick } = require('./calendarioDeTick.js');
const { calcularMultiplicadorClima } = require('./calcularMultiplicadorClima.js');

function ejecutarProduccionEstacional() {
  // SETUP (una sola vez)
  const grid = crearGrid(2, 1, 'verde');
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  colocarNodo(grid, 0, 0, 'no_extractiva', bomba);
  colocarNodo(grid, 1, 0, 'agricultura', granja);
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));
  const ticksMuestra = [0, 84, 168, 252];
  const historial = [];

  for (const tick of ticksMuestra) {
    const calendario = calendarioDeTick(tick);
    const aguaProducida = producirTickNodo(bomba, 0);
    const resultadoViaje = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaProducida);
    const aguaRecibida = resultadoViaje.entregado;
    const manzanasCrudo = producirTickNodo(granja, aguaRecibida);
    const multiplicadorClima = calcularMultiplicadorClima(calendario.estacion);
    const manzanasProducidas = manzanasCrudo * multiplicadorClima;
    historial.push({
      tick,
      estacion: calendario.estacion,
      aguaProducida,
      aguaRecibida,
      manzanasCrudo,
      multiplicadorClima,
      manzanasProducidas,
    });
  }

  return { ticksMuestra, historial };
}

module.exports = { ejecutarProduccionEstacional };
