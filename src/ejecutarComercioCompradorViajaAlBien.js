const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { resolverViaje } = require('./resolverViaje.js');
const { aforoDisponible } = require('./aforoDisponible.js');
const { resolverVentaLocal } = require('./resolverVentaLocal.js');
const { calcularMontoVenta } = require('./calcularMontoVenta.js');
const { crearTesoreria } = require('./crearTesoreria.js');
const { registrarIngreso } = require('./registrarIngreso.js');

function ejecutarComercioCompradorViajaAlBien() {
  // a. SETUP DEL GRID Y LA RUTA
  const grid = crearGrid(2, 1, 'verde');
  colocarNodo(grid, 0, 0, 'no_extractiva', 'casa');
  colocarNodo(grid, 1, 0, 'no_extractiva', 'restaurante');
  const verticeCasa = verticeEntrada(0, 0, 'este');
  const verticeRestaurante = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(
    grafo,
    verticeCasa,
    verticeRestaurante,
    crearTramo('carretera', 20, 1, 'personas')
  );

  // b. VIAJE DEL COMPRADOR
  const personasQueViajan = 10;
  const resultadoViaje = resolverViaje(
    grafo,
    verticeCasa,
    verticeRestaurante,
    'personas',
    personasQueViajan
  );
  const personasQueLlegan = resultadoViaje.entregado;

  // c. AFORO DEL RESTAURANTE
  const aforoMaximo = 6;
  const ocupacionActual = 0;
  const aforoDisp = aforoDisponible(aforoMaximo, ocupacionActual);

  // d. VENTA
  const stockDisponible = 8;
  const ventaResuelta = resolverVentaLocal(personasQueLlegan, stockDisponible, aforoDisp);
  const precioUnitario = 3;
  const montoVenta = calcularMontoVenta(ventaResuelta, precioUnitario);

  // e. TESORERIA
  const tesoreria = crearTesoreria(0);
  registrarIngreso(tesoreria, montoVenta);

  // f. Resultado
  return {
    personasQueViajan,
    personasQueLlegan,
    aforoMaximo,
    ocupacionActual,
    aforoDisp,
    stockDisponible,
    ventaResuelta,
    precioUnitario,
    montoVenta,
    tesoreriaFinal: tesoreria,
  };
}

module.exports = { ejecutarComercioCompradorViajaAlBien };
