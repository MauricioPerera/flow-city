function actualizarContadorQuiebra(contadorActual, saldoTesoreria) {
  if (!Number.isInteger(contadorActual) || contadorActual < 0) {
    throw new RangeError('contadorActual debe ser un entero no negativo');
  }
  if (!Number.isFinite(saldoTesoreria)) {
    throw new RangeError('saldoTesoreria debe ser un numero finito');
  }
  if (saldoTesoreria <= 0) {
    return contadorActual + 1;
  }
  return 0;
}

module.exports = { actualizarContadorQuiebra };