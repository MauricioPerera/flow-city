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
const { calendarioDeTick } = require('./calendarioDeTick.js');

function ejecutarGastoTiempoLibre() {
  // SETUP (una sola vez, antes del loop)
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
  const tesoreria = crearTesoreria(0);
  const historial = [];

  // LOOP: para tick de 0 a 6 (7 iteraciones)
  for (let tick = 0; tick < 7; tick += 1) {
    const calendario = calendarioDeTick(tick);
    const personasQueViajan = 10;
    const resultadoViaje = resolverViaje(
      grafo,
      verticeCasa,
      verticeRestaurante,
      'personas',
      personasQueViajan
    );
    const personasQueLlegan = resultadoViaje.entregado;
    const aforoDisp = aforoDisponible(6, 0);
    const stockDisponible = 8;
    const ventaResuelta = resolverVentaLocal(
      personasQueLlegan,
      stockDisponible,
      aforoDisp
    );
    const montoVenta = calcularMontoVenta(ventaResuelta, 3);
    registrarIngreso(tesoreria, montoVenta);
    historial.push({
      tick,
      diaDeSemana: calendario.diaDeSemana,
      personasQueViajan,
      personasQueLlegan,
      ventaResuelta,
      montoVenta,
      saldoTesoreria: tesoreria.saldo,
    });
  }

  return { historial, tesoreriaFinal: tesoreria };
}

module.exports = { ejecutarGastoTiempoLibre };
