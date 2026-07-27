const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');

test('crea una grilla con las dimensiones pedidas', () => {
  const grid = crearGrid(2, 3, 'neutra');
  assert.equal(grid.ancho, 2);
  assert.equal(grid.alto, 3);
  assert.equal(grid.celdas.length, 3);
  assert.equal(grid.celdas[0].length, 2);
});

test('toda celda arranca con el terreno default y sin nodo', () => {
  const grid = crearGrid(2, 2, 'verde');
  for (const fila of grid.celdas) {
    for (const celda of fila) {
      assert.deepEqual(celda, { terreno: 'verde', nodo: null });
    }
  }
});

test('las celdas son objetos independientes (mutar una no afecta a otras)', () => {
  const grid = crearGrid(2, 2, 'neutra');
  grid.celdas[0][0].nodo = 'granja';
  assert.equal(grid.celdas[0][1].nodo, null);
  assert.equal(grid.celdas[1][0].nodo, null);
});

test('acepta los 4 tipos de terreno validos', () => {
  for (const terreno of ['verde', 'elevada', 'agua_profunda', 'neutra']) {
    const grid = crearGrid(1, 1, terreno);
    assert.equal(grid.celdas[0][0].terreno, terreno);
  }
});

test('ancho o alto no positivos lanzan RangeError', () => {
  assert.throws(() => crearGrid(0, 3, 'neutra'), RangeError);
  assert.throws(() => crearGrid(3, 0, 'neutra'), RangeError);
  assert.throws(() => crearGrid(-1, 3, 'neutra'), RangeError);
});

test('ancho o alto no enteros lanzan RangeError', () => {
  assert.throws(() => crearGrid(2.5, 3, 'neutra'), RangeError);
});

test('tipo de terreno default desconocido lanza RangeError', () => {
  assert.throws(() => crearGrid(2, 2, 'lava'), RangeError);
});
