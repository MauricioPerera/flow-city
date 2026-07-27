function esNumeroFinitoNoNegativo(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0;
}

function resolverVentaLocal(demanda, stockDisponible, aforoDisponible) {
  if (!esNumeroFinitoNoNegativo(demanda)) {
    throw new RangeError('demanda debe ser un numero finito no negativo');
  }
  if (!esNumeroFinitoNoNegativo(stockDisponible)) {
    throw new RangeError('stockDisponible debe ser un numero finito no negativo');
  }
  if (!esNumeroFinitoNoNegativo(aforoDisponible)) {
    throw new RangeError('aforoDisponible debe ser un numero finito no negativo');
  }
  return Math.min(demanda, stockDisponible, aforoDisponible);
}

module.exports = { resolverVentaLocal };
