function calcularCrecimientoPoblacion(poblacionActual, indice, tasaBase) {
  if (!Number.isInteger(poblacionActual) || poblacionActual < 0) {
    throw new RangeError('poblacionActual debe ser un entero no negativo');
  }
  if (typeof indice !== 'number' || !Number.isFinite(indice) || indice < 0 || indice > 1) {
    throw new RangeError('indice debe ser un numero finito en el rango [0, 1]');
  }
  if (typeof tasaBase !== 'number' || !Number.isFinite(tasaBase) || tasaBase <= 0) {
    throw new RangeError('tasaBase debe ser un numero finito positivo');
  }

  return poblacionActual * tasaBase * (indice - 0.5) * 2;
}

module.exports = { calcularCrecimientoPoblacion };
