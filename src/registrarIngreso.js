function esObjetoPlano(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function registrarIngreso(tesoreria, monto) {
  if (
    !esObjetoPlano(tesoreria) ||
    typeof tesoreria.saldo !== 'number' ||
    !Number.isFinite(tesoreria.saldo)
  ) {
    throw new RangeError('tesoreria debe ser un objeto con saldo numerico finito');
  }
  if (typeof monto !== 'number' || !Number.isFinite(monto) || monto <= 0) {
    throw new RangeError('monto debe ser un numero finito positivo');
  }

  tesoreria.saldo += monto;
  return tesoreria;
}

module.exports = { registrarIngreso };
