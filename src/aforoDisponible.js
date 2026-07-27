function aforoDisponible(aforoMaximo, ocupacionActual) {
  if (!Number.isInteger(aforoMaximo) || aforoMaximo <= 0) {
    throw new RangeError('aforoMaximo debe ser un entero positivo');
  }
  if (!Number.isInteger(ocupacionActual) || ocupacionActual < 0) {
    throw new RangeError('ocupacionActual debe ser un entero no negativo');
  }
  return Math.max(0, aforoMaximo - ocupacionActual);
}

module.exports = { aforoDisponible };
