function aplicarEscasezCombustibleTramo(cargaSolicitada, combustibleDisponible) {
  if (!Number.isInteger(cargaSolicitada) || cargaSolicitada <= 0) {
    throw new RangeError('cargaSolicitada debe ser un entero positivo');
  }

  if (
    typeof combustibleDisponible !== 'number' ||
    !Number.isFinite(combustibleDisponible) ||
    combustibleDisponible < 0
  ) {
    throw new RangeError('combustibleDisponible debe ser un numero finito no negativo');
  }

  if (combustibleDisponible <= 0) {
    return { cargaEfectiva: 0, factorDegradacion: 0 };
  }

  const factor = Math.min(1, combustibleDisponible / cargaSolicitada);
  return {
    cargaEfectiva: Math.floor(cargaSolicitada * factor),
    factorDegradacion: factor,
  };
}

module.exports = { aplicarEscasezCombustibleTramo };
