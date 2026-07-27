function poblacionTotalCasas(poblacionesPorCasa) {
  if (!Array.isArray(poblacionesPorCasa)) {
    throw new RangeError('poblacionesPorCasa debe ser un array');
  }

  let total = 0;
  for (const poblacion of poblacionesPorCasa) {
    if (!Number.isInteger(poblacion) || poblacion <= 0) {
      throw new RangeError('cada elemento debe ser un entero positivo');
    }
    total += poblacion;
  }

  return total;
}

module.exports = { poblacionTotalCasas };
