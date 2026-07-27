const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { resolverViaje } = require('./resolverViaje.js');
const { calendarioDeTick } = require('./calendarioDeTick.js');

function ejecutarViajesFaseLaboral() {
  // SETUP (una sola vez)
  const grid = crearGrid(2, 1, 'verde');
  colocarNodo(grid, 0, 0, 'no_extractiva', 'casa');
  colocarNodo(grid, 1, 0, 'no_extractiva', 'trabajo');
  const verticeCasa = verticeEntrada(0, 0, 'este');
  const verticeTrabajo = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeCasa, verticeTrabajo, crearTramo('carretera', 20, 1, 'personas'));
  const personasQueTrabajan = 8;
  const historial = [];

  // LOOP: tick 0 a 6 (una semana)
  for (let tick = 0; tick <= 6; tick += 1) {
    const calendario = calendarioDeTick(tick);
    let viajeGenerado = false;
    let personasIda = 0;
    let personasVuelta = 0;

    if (calendario.esLaboral) {
      personasIda = resolverViaje(grafo, verticeCasa, verticeTrabajo, 'personas', personasQueTrabajan).entregado;
      personasVuelta = resolverViaje(grafo, verticeTrabajo, verticeCasa, 'personas', personasQueTrabajan).entregado;
      viajeGenerado = true;
    }

    historial.push({
      tick,
      diaDeSemana: calendario.diaDeSemana,
      esLaboral: calendario.esLaboral,
      viajeGenerado,
      personasIda,
      personasVuelta,
    });
  }

  return { personasQueTrabajan, historial };
}

module.exports = { ejecutarViajesFaseLaboral };
