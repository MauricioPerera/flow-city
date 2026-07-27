const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');
const { obtenerCelda } = require('../src/obtenerCelda.js');
const { asignarNodoCelda } = require('../src/asignarNodoCelda.js');
const { colocarCasaMultiCelda } = require('../src/colocarCasaMultiCelda.js');

test('coloca una casa nivel S en un grid 2x2 verde, las 4 celdas comparten el mismo nodo', () => {
  const grid = crearGrid(2, 2, 'verde');
  const resultado = colocarCasaMultiCelda(grid, 'S', 0, 0, 'casa-1');
  assert.deepEqual(resultado.celdas, [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 },
  ]);
  for (const { x, y } of resultado.celdas) {
    assert.equal(obtenerCelda(grid, x, y).nodo, 'casa-1');
  }
});

test('coloca una casa nivel L en terreno elevado (terreno flexible, no ideal)', () => {
  const grid = crearGrid(3, 3, 'elevada');
  colocarCasaMultiCelda(grid, 'L', 0, 0, 'casa-2');
  for (let y = 0; y < 3; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      assert.equal(obtenerCelda(grid, x, y).nodo, 'casa-2');
    }
  }
});

test('atomico: si una celda del footprint ya esta ocupada, no coloca ninguna', () => {
  const grid = crearGrid(2, 2, 'verde');
  asignarNodoCelda(grid, 1, 1, 'otra-cosa');
  assert.throws(() => colocarCasaMultiCelda(grid, 'S', 0, 0, 'casa-3'), Error);
  assert.equal(obtenerCelda(grid, 0, 0).nodo, null);
  assert.equal(obtenerCelda(grid, 1, 0).nodo, null);
  assert.equal(obtenerCelda(grid, 0, 1).nodo, null);
  assert.equal(obtenerCelda(grid, 1, 1).nodo, 'otra-cosa');
});

test('atomico: si el footprint completo esta sobre agua_profunda, no coloca ninguna celda', () => {
  const grid = crearGrid(2, 2, 'agua_profunda');
  assert.throws(() => colocarCasaMultiCelda(grid, 'S', 0, 0, 'casa-4'), Error);
  assert.equal(obtenerCelda(grid, 0, 0).nodo, null);
  assert.equal(obtenerCelda(grid, 1, 0).nodo, null);
  assert.equal(obtenerCelda(grid, 0, 1).nodo, null);
  assert.equal(obtenerCelda(grid, 1, 1).nodo, null);
});

test('propaga RangeError si el nivel es desconocido', () => {
  const grid = crearGrid(2, 2, 'verde');
  assert.throws(() => colocarCasaMultiCelda(grid, 'XL', 0, 0, 'casa-5'), RangeError);
});

test('propaga RangeError si el footprint se sale del grid', () => {
  const grid = crearGrid(1, 1, 'verde');
  assert.throws(() => colocarCasaMultiCelda(grid, 'S', 0, 0, 'casa-6'), RangeError);
});
