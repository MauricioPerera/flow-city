const test = require('node:test');
const assert = require('node:assert/strict');
const { poblacionTotalCasas } = require('../src/poblacionTotalCasas.js');

test('suma la poblacion de varias casas', () => {
  assert.equal(poblacionTotalCasas([10, 10]), 20);
});

test('funciona con una sola casa', () => {
  assert.equal(poblacionTotalCasas([10]), 10);
});

test('lista vacia (sin casas todavia) da poblacion total 0', () => {
  assert.equal(poblacionTotalCasas([]), 0);
});

test('suma casas con distinta poblacion', () => {
  assert.equal(poblacionTotalCasas([10, 15, 5]), 30);
});

test('un elemento no positivo o no entero lanza RangeError', () => {
  assert.throws(() => poblacionTotalCasas([10, 0]), RangeError);
  assert.throws(() => poblacionTotalCasas([10, -5]), RangeError);
  assert.throws(() => poblacionTotalCasas([10, 1.5]), RangeError);
});

test('no es un array lanza RangeError', () => {
  assert.throws(() => poblacionTotalCasas('no-es-array'), RangeError);
  assert.throws(() => poblacionTotalCasas(null), RangeError);
});
