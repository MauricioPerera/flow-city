const { calcularSaturacion } = require('./calcularSaturacion.js');

function avanzarViajeTick(viajeEnTransito, grafo) {
  if (viajeEnTransito === null || typeof viajeEnTransito !== 'object') {
    throw new RangeError('viajeEnTransito debe ser un objeto no nulo');
  }
  if (grafo === null || typeof grafo !== 'object') {
    throw new RangeError('grafo debe ser un objeto no nulo');
  }

  const { camino, tipoTrafico, cantidad, ticksRestantes } = viajeEnTransito;

  if (!Array.isArray(camino) || camino.length < 2) {
    throw new RangeError('camino debe ser un array de al menos 2 elementos');
  }
  if (tipoTrafico !== 'mercaderia' && tipoTrafico !== 'personas') {
    throw new RangeError('tipoTrafico debe ser mercaderia o personas');
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }
  if (!Number.isInteger(ticksRestantes) || ticksRestantes <= 0) {
    throw new RangeError('ticksRestantes debe ser un entero positivo');
  }

  const ticksFinales = ticksRestantes - 1;

  if (ticksFinales > 0) {
    return {
      llego: false,
      estado: { ...viajeEnTransito, ticksRestantes: ticksFinales },
      entregado: null,
    };
  }

  // ticksFinales === 0: el viaje llega.
  let entregado = cantidad;
  for (let i = 0; i < camino.length - 1; i++) {
    const origen = camino[i];
    const destino = camino[i + 1];
    const tramosOrigen = grafo[origen];
    if (!tramosOrigen || typeof tramosOrigen !== 'object') {
      throw new RangeError(`segmento ${origen}->${destino} ausente en el grafo`);
    }
    const tramo = tramosOrigen[destino];
    if (!tramo || typeof tramo !== 'object') {
      throw new RangeError(`segmento ${origen}->${destino} ausente en el grafo`);
    }
    const cargaActual = tramo.cargaActual || 0;
    const { perdida } = calcularSaturacion(cargaActual, tramo.capacidad);
    const fraccionPerdida = cargaActual > 0 ? perdida / cargaActual : 0;
    entregado = entregado * (1 - fraccionPerdida);
  }

  return { llego: true, estado: null, entregado };
}

module.exports = { avanzarViajeTick };