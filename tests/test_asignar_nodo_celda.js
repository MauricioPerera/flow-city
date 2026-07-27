const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');
const { asignarNodoCelda } = require('../src/asignarNodoCelda.js');

test('asigna un nodo a una celda vacia, sin importar el terreno', () => {
  const grid = crearGrid(2, 2, 'agua_profunda');
  const celda = asignarNodoCelda(grid, 0, 0, 'fabrica-1');
  assert.equal(celda.nodo, 'fabrica-1');
  assert.equal(celda.terreno, 'agua_profunda');
});

test('lanza Error si la celda ya esta ocupada', () => {
  const grid = crearGrid(2, 2, 'verde');
  asignarNodoCelda(grid, 1, 1, 'casa-1');
  assert.throws(() => asignarNodoCelda(grid, 1, 1, 'casa-2'), Error);
});

test('lanza RangeError si el nodo es null o undefined', () => {
  const grid = crearGrid(2, 2, 'verde');
  assert.throws(() => asignarNodoCelda(grid, 0, 0, null), RangeError);
  assert.throws(() => asignarNodoCelda(grid, 0, 0, undefined), RangeError);
});

test('propaga el error de coordenadas fuera de rango', () => {
  const grid = crearGrid(2, 2, 'verde');
  assert.throws(() => asignarNodoCelda(grid, 5, 5, 'x'), RangeError);
});
