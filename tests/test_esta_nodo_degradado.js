const test = require('node:test');
const assert = require('node:assert/strict');
const { estaNodoDegradado } = require('../src/estaNodoDegradado.js');

test('contador por debajo del umbral: no degradado', () => {
  assert.equal(estaNodoDegradado(0, 3), false);
  assert.equal(estaNodoDegradado(2, 3), false);
});

test('contador igual al umbral: degradado', () => {
  assert.equal(estaNodoDegradado(3, 3), true);
});

test('contador por encima del umbral: degradado', () => {
  assert.equal(estaNodoDegradado(5, 3), true);
});

test('contador 0 con umbral 1: no degradado', () => {
  assert.equal(estaNodoDegradado(0, 1), false);
});

test('contadorQuiebra negativo o no entero lanza RangeError', () => {
  assert.throws(() => estaNodoDegradado(-1, 3), RangeError);
  assert.throws(() => estaNodoDegradado(1.5, 3), RangeError);
});

test('umbral no positivo o no entero lanza RangeError', () => {
  assert.throws(() => estaNodoDegradado(3, 0), RangeError);
  assert.throws(() => estaNodoDegradado(3, -1), RangeError);
  assert.throws(() => estaNodoDegradado(3, 1.5), RangeError);
});
