const { encontrarRuta } = require('./encontrarRuta.js');
const { calcularSaturacion } = require('./calcularSaturacion.js');

function resolverViaje(grafo, origen, destino, tipoTrafico, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }

  const ruta = encontrarRuta(grafo, origen, destino, tipoTrafico);
  if (ruta === null) {
    return { camino: null, entregado: 0, factorVelocidadMinimo: null };
  }
  if (origen === destino) {
    return { camino: ruta.camino, entregado: cantidad, factorVelocidadMinimo: 1 };
  }

  let entregado = cantidad;
  let factorVelocidadMinimo = 1;

  for (let i = 0; i < ruta.camino.length - 1; i += 1) {
    const tramo = grafo[ruta.camino[i]][ruta.camino[i + 1]];
    const cargaActual = tramo.cargaActual || 0;
    const { factorVelocidad, perdida } = calcularSaturacion(cargaActual, tramo.capacidad);
    const fraccionPerdida = cargaActual > 0 ? perdida / cargaActual : 0;

    entregado *= 1 - fraccionPerdida;
    factorVelocidadMinimo = Math.min(factorVelocidadMinimo, factorVelocidad);
  }

  return { camino: ruta.camino, entregado, factorVelocidadMinimo };
}

module.exports = { resolverViaje };
