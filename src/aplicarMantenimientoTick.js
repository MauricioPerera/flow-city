const { registrarGasto } = require('./registrarGasto.js');

function esObjetoPlano(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function aplicarMantenimientoTick(tesoreria, costosMantenimiento) {
  if (
    !esObjetoPlano(tesoreria) ||
    typeof tesoreria.saldo !== 'number' ||
    !Number.isFinite(tesoreria.saldo)
  ) {
    throw new RangeError('tesoreria debe ser un objeto con saldo numerico finito');
  }
  if (!Array.isArray(costosMantenimiento)) {
    throw new RangeError('costosMantenimiento debe ser un array');
  }
  for (const costo of costosMantenimiento) {
    if (typeof costo !== 'number' || !Number.isFinite(costo) || costo < 0) {
      throw new RangeError('cada costo de mantenimiento debe ser un numero finito no negativo');
    }
  }

  const total = costosMantenimiento.reduce((suma, costo) => suma + costo, 0);
  if (total > 0) {
    registrarGasto(tesoreria, total);
  }
  return tesoreria;
}

module.exports = { aplicarMantenimientoTick };
