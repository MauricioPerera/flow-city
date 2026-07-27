const { registrarCargaTramo } = require('./registrarCargaTramo.js');
const { avanzarViajeTick } = require('./avanzarViajeTick.js');

function esEnteroPositivo(valor) {
  return Number.isInteger(valor) && valor > 0;
}

function validarFormaViaje(viaje) {
  if (viaje === null || typeof viaje !== 'object') {
    throw new RangeError('cada viaje debe ser un objeto no nulo');
  }
  const { camino, tipoTrafico, cantidad, ticksRestantes } = viaje;
  if (!Array.isArray(camino) || camino.length < 2) {
    throw new RangeError('camino debe ser un array de al menos 2 elementos');
  }
  if (tipoTrafico !== 'mercaderia' && tipoTrafico !== 'personas') {
    throw new RangeError('tipoTrafico debe ser mercaderia o personas');
  }
  if (!esEnteroPositivo(cantidad)) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }
  if (!esEnteroPositivo(ticksRestantes)) {
    throw new RangeError('ticksRestantes debe ser un entero positivo');
  }
}

function resolverTickConTransito(grafo, viajesEnTransito) {
  if (!Array.isArray(viajesEnTransito)) {
    throw new RangeError('viajesEnTransito debe ser un array');
  }
  if (grafo === null || typeof grafo !== 'object') {
    throw new RangeError('grafo debe ser un objeto no nulo');
  }

  // (b) Validar la forma de TODOS los viajes antes de tocar el grafo.
  for (const viaje of viajesEnTransito) {
    validarFormaViaje(viaje);
  }

  // (c) Reiniciar cargaActual a 0 en TODOS los tramos del grafo.
  for (const origen of Object.keys(grafo)) {
    const vecinos = grafo[origen];
    if (vecinos && typeof vecinos === 'object') {
      for (const destino of Object.keys(vecinos)) {
        const tramo = vecinos[destino];
        if (tramo && typeof tramo === 'object') {
          tramo.cargaActual = 0;
        }
      }
    }
  }

  // (d) Acumular la carga del camino COMPLETO de TODOS los viajes antes de avanzar ninguno.
  for (const viaje of viajesEnTransito) {
    const { camino, tipoTrafico, cantidad } = viaje;
    for (let i = 0; i < camino.length - 1; i++) {
      const origen = camino[i];
      const destino = camino[i + 1];
      const tramo = grafo[origen] && grafo[origen][destino];
      registrarCargaTramo(tramo, tipoTrafico, cantidad);
    }
  }

  // (e) Recien ahora avanzar cada viaje un tick, en el mismo orden.
  const llegados = [];
  const enTransito = [];
  for (const viaje of viajesEnTransito) {
    const resultado = avanzarViajeTick(viaje, grafo);
    if (resultado.llego === true) {
      llegados.push({
        camino: viaje.camino,
        tipoTrafico: viaje.tipoTrafico,
        cantidad: viaje.cantidad,
        entregado: resultado.entregado,
      });
    } else {
      enTransito.push(resultado.estado);
    }
  }

  // (f)
  return { llegados, enTransito };
}

module.exports = { resolverTickConTransito };