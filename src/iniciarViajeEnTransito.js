function iniciarViajeEnTransito(camino, tipoTrafico, cantidad, ticksRestantes) {
  if (!Array.isArray(camino) || camino.length < 2) {
    throw new RangeError('camino debe ser un array de al menos 2 elementos');
  }
  if (tipoTrafico !== 'mercaderia' && tipoTrafico !== 'personas') {
    throw new RangeError("tipoTrafico debe ser 'mercaderia' o 'personas'");
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }
  if (!Number.isInteger(ticksRestantes) || ticksRestantes < 1) {
    throw new RangeError('ticksRestantes debe ser un entero positivo (>= 1)');
  }
  return { camino, tipoTrafico, cantidad, ticksRestantes };
}

module.exports = { iniciarViajeEnTransito };