const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { encontrarRuta } = require('./encontrarRuta.js');
const { calcularTicksViaje } = require('./calcularTicksViaje.js');
const { resolverViaje } = require('./resolverViaje.js');
const { iniciarViajeEnTransito } = require('./iniciarViajeEnTransito.js');
const { resolverTickConTransito } = require('./resolverTickConTransito.js');

function ejecutarDecisionOrquestacionViaje() {
  // a. SETUP
  const grid = crearGrid(5, 4, 'verde');
  colocarNodo(grid, 0, 0, 'no_extractiva', 'a');
  colocarNodo(grid, 1, 0, 'no_extractiva', 'b');
  colocarNodo(grid, 3, 3, 'no_extractiva', 'c');
  colocarNodo(grid, 4, 3, 'no_extractiva', 'd');
  const verticeA = verticeEntrada(0, 0, 'este');
  const verticeB = verticeEntrada(1, 0, 'oeste');
  const verticeC = verticeEntrada(3, 3, 'este');
  const verticeD = verticeEntrada(4, 3, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeA, verticeB, crearTramo('carretera', 20, 5, 'mercaderia'));
  conectarVertices(grafo, verticeC, verticeD, crearTramo('carretera', 20, 25, 'mercaderia'));
  const VELOCIDAD_BASE = 10;
  const CANTIDAD = 6;

  // b. RUTA CORTA (rama instantanea)
  const rutaCorta = encontrarRuta(grafo, verticeA, verticeB, 'mercaderia');
  const distanciaCorta = rutaCorta.distanciaTotal;
  const ticksCorto = calcularTicksViaje(distanciaCorta, VELOCIDAD_BASE);
  let entregadoCorto = null;
  if (ticksCorto <= 1) {
    entregadoCorto = resolverViaje(grafo, verticeA, verticeB, 'mercaderia', CANTIDAD).entregado;
  }

  // c. RUTA LARGA (rama de transito multi-tick)
  const rutaLarga = encontrarRuta(grafo, verticeC, verticeD, 'mercaderia');
  const distanciaLarga = rutaLarga.distanciaTotal;
  const ticksLargo = calcularTicksViaje(distanciaLarga, VELOCIDAD_BASE);
  let viajeActual = iniciarViajeEnTransito(rutaLarga.camino, 'mercaderia', CANTIDAD, ticksLargo);
  let ticksTranscurridos = 0;
  let entregadoLargo = null;
  while (entregadoLargo === null) {
    const resultado = resolverTickConTransito(grafo, [viajeActual]);
    ticksTranscurridos += 1;
    if (resultado.llegados.length > 0) {
      entregadoLargo = resultado.llegados[0].entregado;
    } else {
      viajeActual = resultado.enTransito[0];
    }
  }

  // d. Devolver
  return { distanciaCorta, ticksCorto, entregadoCorto, distanciaLarga, ticksLargo, ticksTranscurridos, entregadoLargo };
}

module.exports = { ejecutarDecisionOrquestacionViaje };
