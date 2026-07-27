const { radioAreaAccionPorNivel } = require('./radioAreaAccionPorNivel.js');
const { estaEnZonaInfluencia } = require('./estaEnZonaInfluencia.js');
const { crearEstadoArboles } = require('./crearEstadoArboles.js');
const { talarArbol } = require('./talarArbol.js');
const { avanzarCicloArbolTick } = require('./avanzarCicloArbolTick.js');
const { talaProduceEnZona } = require('./talaProduceEnZona.js');

function ejecutarCadenaTalaReforestacionConNivel() {
  const centro = { x: 5, y: 5 };
  const nivel = 'S';
  const radio = radioAreaAccionPorNivel(nivel);
  const celda = { x: 5, y: 5 };
  const celdaEnAreaDeAccion = estaEnZonaInfluencia(centro.x, centro.y, radio, celda.x, celda.y);
  const estadoArboles = crearEstadoArboles();
  const historial = [];

  for (let tick = 0; tick < 6; tick++) {
    const clave = celda.x + ',' + celda.y;
    const entrada = estadoArboles.get(clave) || { estado: 'arbol' };
    const estadoAntes = entrada.estado;
    let maderaProducida = 0;
    if (talaProduceEnZona(estadoArboles, [celda])) {
      talarArbol(estadoArboles, celda.x, celda.y);
      maderaProducida = 1;
    }
    const estadoDespues = avanzarCicloArbolTick(estadoArboles, celda.x, celda.y);
    historial.push({ tick, estadoAntes, maderaProducida, estadoDespues });
  }

  return { centro, nivel, radio, celda, celdaEnAreaDeAccion, historial };
}

module.exports = { ejecutarCadenaTalaReforestacionConNivel };
