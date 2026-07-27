function calcularCoberturaNecesidad(requerido, recibido) {
  if (typeof requerido !== 'number' || !Number.isFinite(requerido) || requerido < 0) {
    throw new RangeError('requerido debe ser un numero finito no negativo');
  }
  if (typeof recibido !== 'number' || !Number.isFinite(recibido) || recibido < 0) {
    throw new RangeError('recibido debe ser un numero finito no negativo');
  }
  if (requerido === 0) {
    return 1;
  }
  return Math.min(1, recibido / requerido);
}

module.exports = { calcularCoberturaNecesidad };
