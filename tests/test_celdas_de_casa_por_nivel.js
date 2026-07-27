const test = require('node:test');
const assert = require('node:assert/strict');
const { celdasDeCasaPorNivel } = require('../src/celdasDeCasaPorNivel.js');

test('nivel S devuelve un footprint 2x2 (4 celdas)', () => {
  assert.deepEqual(celdasDeCasaPorNivel('S', 0, 0), [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 },
  ]);
});

test('nivel M devuelve un footprint 3x2 (6 celdas), anclado con offset', () => {
  assert.deepEqual(celdasDeCasaPorNivel('M', 2, 3), [
    { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
  ]);
});

test('nivel L devuelve un footprint 3x3 (9 celdas)', () => {
  assert.deepEqual(celdasDeCasaPorNivel('L', 0, 0), [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
    { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
  ]);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => celdasDeCasaPorNivel('XL', 0, 0), RangeError);
});

test('coordenadas de ancla negativas o no enteras lanzan RangeError', () => {
  assert.throws(() => celdasDeCasaPorNivel('S', -1, 0), RangeError);
  assert.throws(() => celdasDeCasaPorNivel('S', 0, 1.5), RangeError);
});
