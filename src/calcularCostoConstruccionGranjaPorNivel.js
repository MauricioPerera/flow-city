const { costoConstruccionNodo } = require('./costoConstruccionNodo.js');

function calcularCostoConstruccionGranjaPorNivel(nivel) {
  const base = costoConstruccionNodo('agricultura');
  const recargos = { S: 0, M: 20, L: 50 };

  if (!Object.prototype.hasOwnProperty.call(recargos, nivel)) {
    throw new RangeError(`Nivel no registrado: ${nivel}`);
  }

  return base + recargos[nivel];
}

module.exports = { calcularCostoConstruccionGranjaPorNivel };
