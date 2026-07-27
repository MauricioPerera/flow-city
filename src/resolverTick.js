const { encontrarRuta } = require('./encontrarRuta.js');
const { registrarCargaTramo } = require('./registrarCargaTramo.js');
const { resolverViaje } = require('./resolverViaje.js');

function esObjetoPlano(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function reiniciarCargas(grafo) {
  for (const verticeId of Object.keys(grafo)) {
    for (const vecinoId of Object.keys(grafo[verticeId])) {
      grafo[verticeId][vecinoId].cargaActual = 0;
    }
  }
}

function resolverTick(grafo, viajes) {
  if (!Array.isArray(viajes)) {
    throw new RangeError('viajes debe ser un array');
  }
  for (const viaje of viajes) {
    if (!esObjetoPlano(viaje)) {
      throw new RangeError('cada viaje debe ser un objeto');
    }
  }

  reiniciarCargas(grafo);

  for (const viaje of viajes) {
    const { origen, destino, tipoTrafico, cantidad } = viaje;
    const ruta = encontrarRuta(grafo, origen, destino, tipoTrafico);
    if (ruta === null) {
      continue;
    }
    for (let i = 0; i < ruta.camino.length - 1; i += 1) {
      const tramo = grafo[ruta.camino[i]][ruta.camino[i + 1]];
      registrarCargaTramo(tramo, tipoTrafico, cantidad);
    }
  }

  return viajes.map((viaje) =>
    resolverViaje(grafo, viaje.origen, viaje.destino, viaje.tipoTrafico, viaje.cantidad)
  );
}

module.exports = { resolverTick };
