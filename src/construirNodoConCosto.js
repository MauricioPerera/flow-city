const { colocarNodo } = require('./colocarNodo.js');
const { costoConstruccionNodo } = require('./costoConstruccionNodo.js');
const { registrarGasto } = require('./registrarGasto.js');

function construirNodoConCosto(grid, tesoreria, x, y, categoriaTerreno, categoriaCosto, nodo) {
  const monto = costoConstruccionNodo(categoriaCosto);
  const celda = colocarNodo(grid, x, y, categoriaTerreno, nodo);
  registrarGasto(tesoreria, monto);
  return celda;
}

module.exports = { construirNodoConCosto };