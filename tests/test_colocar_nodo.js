const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');
const { colocarNodo } = require('../src/colocarNodo.js');

function esErrorDeNegocio(mensajeParcial) {
  return (err) =>
    err instanceof Error &&
    !(err instanceof RangeError) &&
    err.message.includes(mensajeParcial);
}

test('coloca el nodo en una celda de terreno compatible', () => {
  const grid = crearGrid(2, 2, 'verde');
  const celda = colocarNodo(grid, 0, 0, 'agricultura', 'granja-1');
  assert.equal(celda.nodo, 'granja-1');
  assert.equal(grid.celdas[0][0].nodo, 'granja-1');
});

test('terreno incompatible con la categoria lanza error de negocio (no RangeError)', () => {
  const grid = crearGrid(2, 2, 'neutra');
  assert.throws(
    () => colocarNodo(grid, 0, 0, 'agricultura', 'granja-1'),
    esErrorDeNegocio('terreno')
  );
});

test('celda ya ocupada lanza error de negocio (no RangeError)', () => {
  const grid = crearGrid(2, 2, 'verde');
  colocarNodo(grid, 0, 0, 'agricultura', 'granja-1');
  assert.throws(
    () => colocarNodo(grid, 0, 0, 'agricultura', 'granja-2'),
    esErrorDeNegocio('ocupada')
  );
});

test('coordenadas fuera de rango lanzan RangeError', () => {
  const grid = crearGrid(2, 2, 'verde');
  assert.throws(() => colocarNodo(grid, 5, 0, 'agricultura', 'granja-1'), RangeError);
});

test('categoria de construccion desconocida lanza RangeError', () => {
  const grid = crearGrid(2, 2, 'verde');
  assert.throws(() => colocarNodo(grid, 0, 0, 'castillo', 'granja-1'), RangeError);
});

test('nodo null o undefined lanza RangeError', () => {
  const grid = crearGrid(2, 2, 'verde');
  assert.throws(() => colocarNodo(grid, 0, 0, 'agricultura', null), RangeError);
  assert.throws(() => colocarNodo(grid, 0, 0, 'agricultura', undefined), RangeError);
});

test('no_extractiva se puede colocar en neutra', () => {
  const grid = crearGrid(2, 2, 'neutra');
  const celda = colocarNodo(grid, 1, 1, 'no_extractiva', 'casa-1');
  assert.equal(celda.nodo, 'casa-1');
});
