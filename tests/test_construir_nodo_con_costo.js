const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');
const { crearTesoreria } = require('../src/crearTesoreria.js');
const { construirNodoConCosto } = require('../src/construirNodoConCosto.js');

test('construye el nodo y descuenta exactamente su costo de la tesoreria', () => {
  const grid = crearGrid(2, 2, 'verde');
  const tesoreria = crearTesoreria(100);
  const celda = construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura', 'agricultura', 'granja-1');
  assert.equal(celda.nodo, 'granja-1');
  assert.equal(grid.celdas[0][0].nodo, 'granja-1');
  assert.equal(tesoreria.saldo, 70);
});

test('la categoria de terreno y la categoria de costo pueden ser distintas', () => {
  const grid = crearGrid(2, 2, 'neutra');
  const tesoreria = crearTesoreria(100);
  construirNodoConCosto(grid, tesoreria, 1, 1, 'no_extractiva', 'extraccion-agua', 'bomba-1');
  assert.equal(grid.celdas[1][1].nodo, 'bomba-1');
  assert.equal(tesoreria.saldo, 50);
});

test('dos construcciones sucesivas descuentan acumulativamente', () => {
  const grid = crearGrid(2, 2, 'verde');
  const tesoreria = crearTesoreria(100);
  construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura', 'agricultura', 'granja-1');
  construirNodoConCosto(grid, tesoreria, 1, 0, 'agricultura', 'agricultura', 'granja-2');
  assert.equal(tesoreria.saldo, 40);
});

test('terreno incompatible: no se gasta nada (error de negocio propagado)', () => {
  const grid = crearGrid(2, 2, 'neutra');
  const tesoreria = crearTesoreria(100);
  assert.throws(
    () => construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura', 'agricultura', 'granja-1'),
    (err) => err instanceof Error && !(err instanceof RangeError)
  );
  assert.equal(tesoreria.saldo, 100);
  assert.equal(grid.celdas[0][0].nodo, null);
});

test('celda ya ocupada: no se gasta nada de mas (error de negocio propagado)', () => {
  const grid = crearGrid(2, 2, 'verde');
  const tesoreria = crearTesoreria(100);
  construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura', 'agricultura', 'granja-1');
  assert.throws(
    () => construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura', 'agricultura', 'granja-2'),
    (err) => err instanceof Error && !(err instanceof RangeError)
  );
  assert.equal(tesoreria.saldo, 70);
});

test('categoria de costo desconocida lanza RangeError antes de tocar el grid', () => {
  const grid = crearGrid(2, 2, 'verde');
  const tesoreria = crearTesoreria(100);
  assert.throws(
    () => construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura', 'mineria', 'granja-1'),
    RangeError
  );
  assert.equal(tesoreria.saldo, 100);
  assert.equal(grid.celdas[0][0].nodo, null);
});
