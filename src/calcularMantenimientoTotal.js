const { costoMantenimientoNodo } = require('./costoMantenimientoNodo.js');

function calcularMantenimientoTotal(categorias) {
  if (!Array.isArray(categorias)) {
    throw new RangeError('categorias debe ser un array');
  }
  let total = 0;
  for (const c of categorias) {
    total += costoMantenimientoNodo(c);
  }
  return total;
}

module.exports = { calcularMantenimientoTotal };