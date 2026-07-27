const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');
const { colocarNodoFlexible } = require('../src/colocarNodoFlexible.js');

test('coloca una construccion residencial en terreno elevado', () => {
  const grid = crearGrid(2, 2, 'elevada');
  const celda = colocarNodoFlexible(grid, 0, 0, 'residencial', 'casa-1');
  assert.equal(celda.nodo, 'casa-1');
  assert.equal(celda.terreno, 'elevada');
});

test('coloca una construccion industrial en terreno neutro', () => {
  const grid = crearGrid(2, 2, 'neutra');
  const celda = colocarNodoFlexible(grid, 1, 1, 'industrial', 'fabrica-1');
  assert.equal(celda.nodo, 'fabrica-1');
});

test('rechaza colocar sobre agua_profunda con Error', () => {
  const grid = crearGrid(2, 2, 'agua_profunda');
  assert.throws(() => colocarNodoFlexible(grid, 0, 0, 'residencial', 'casa-1'), Error);
});

test('propaga RangeError si la categoria no es flexible', () => {
  const grid = crearGrid(2, 2, 'verde');
  assert.throws(() => colocarNodoFlexible(grid, 0, 0, 'agricultura', 'granja-1'), RangeError);
});

test('propaga Error si la celda ya esta ocupada', () => {
  const grid = crearGrid(2, 2, 'verde');
  colocarNodoFlexible(grid, 0, 0, 'residencial', 'casa-1');
  assert.throws(() => colocarNodoFlexible(grid, 0, 0, 'residencial', 'casa-2'), Error);
});
