const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');
const { obtenerCelda } = require('../src/obtenerCelda.js');

test('devuelve la celda en una posicion valida', () => {
  const grid = crearGrid(2, 3, 'verde');
  assert.deepEqual(obtenerCelda(grid, 0, 0), { terreno: 'verde', nodo: null });
});

test('respeta x como columna e y como fila', () => {
  const grid = crearGrid(3, 2, 'neutra');
  grid.celdas[1][2].terreno = 'elevada';
  assert.equal(obtenerCelda(grid, 2, 1).terreno, 'elevada');
});

test('devuelve la referencia real de la celda, no una copia', () => {
  const grid = crearGrid(2, 2, 'neutra');
  const celda = obtenerCelda(grid, 0, 0);
  celda.nodo = 'granja';
  assert.equal(grid.celdas[0][0].nodo, 'granja');
});

test('esquina inferior derecha es una posicion valida', () => {
  const grid = crearGrid(2, 3, 'neutra');
  assert.deepEqual(obtenerCelda(grid, 1, 2), { terreno: 'neutra', nodo: null });
});

test('x fuera de rango lanza RangeError', () => {
  const grid = crearGrid(2, 3, 'neutra');
  assert.throws(() => obtenerCelda(grid, 2, 0), RangeError);
  assert.throws(() => obtenerCelda(grid, -1, 0), RangeError);
});

test('y fuera de rango lanza RangeError', () => {
  const grid = crearGrid(2, 3, 'neutra');
  assert.throws(() => obtenerCelda(grid, 0, 3), RangeError);
  assert.throws(() => obtenerCelda(grid, 0, -1), RangeError);
});

test('x o y no enteros lanzan RangeError', () => {
  const grid = crearGrid(2, 3, 'neutra');
  assert.throws(() => obtenerCelda(grid, 0.5, 0), RangeError);
  assert.throws(() => obtenerCelda(grid, 0, 1.5), RangeError);
});
