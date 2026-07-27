const { calcularProduccion } = require('./calcularProduccion.js');

function esEnteroPositivo(x) {
  return Number.isInteger(x) && x > 0;
}

function esModoReceta(nodo) {
  return esEnteroPositivo(nodo.ratioEntrada)
    && esEnteroPositivo(nodo.ratioSalida)
    && nodo.produccionFija === null;
}

function esModoExtraccion(nodo) {
  return nodo.ratioEntrada === null
    && nodo.ratioSalida === null
    && typeof nodo.produccionFija === 'number'
    && Number.isFinite(nodo.produccionFija)
    && nodo.produccionFija > 0;
}

function producirTickNodo(nodo, entradaRecibida) {
  if (nodo === null || typeof nodo !== 'object') {
    throw new RangeError('nodo debe ser un objeto no nulo');
  }
  if (!Number.isFinite(entradaRecibida) || entradaRecibida < 0) {
    throw new RangeError('entradaRecibida debe ser un numero finito >= 0');
  }
  if (nodo.produccionFija !== null) {
    if (!esModoExtraccion(nodo)) {
      throw new RangeError('nodo no cumple un modo valido de crearNodoProductivo');
    }
    return nodo.produccionFija;
  }
  if (!esModoReceta(nodo)) {
    throw new RangeError('nodo no cumple un modo valido de crearNodoProductivo');
  }
  return calcularProduccion(entradaRecibida, nodo.ratioEntrada, nodo.ratioSalida);
}

module.exports = { producirTickNodo };