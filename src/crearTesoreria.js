function crearTesoreria(saldoInicial) {
  if (typeof saldoInicial !== 'number' || !Number.isFinite(saldoInicial) || saldoInicial < 0) {
    throw new RangeError('saldoInicial debe ser un numero finito no negativo');
  }
  return { saldo: saldoInicial };
}

module.exports = { crearTesoreria };
