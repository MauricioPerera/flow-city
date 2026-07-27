const test = require('node:test');
const assert = require('node:assert/strict');
const { combinarCoberturas } = require('../src/combinarCoberturas.js');

test('devuelve el minimo entre varias coberturas', () => {
  assert.equal(combinarCoberturas([1, 0.5, 0.8]), 0.5);
});

test('si todas las coberturas son 1, el indice es 1', () => {
  assert.equal(combinarCoberturas([1, 1, 1]), 1);
});

test('una sola cobertura en 0 arrastra el indice general a 0', () => {
  assert.equal(combinarCoberturas([1, 1, 0]), 0);
});

test('funciona con un unico elemento', () => {
  assert.equal(combinarCoberturas([0.7]), 0.7);
});

test('array vacio lanza RangeError', () => {
  assert.throws(() => combinarCoberturas([]), RangeError);
});

test('no array lanza RangeError', () => {
  assert.throws(() => combinarCoberturas('no-es-array'), RangeError);
  assert.throws(() => combinarCoberturas(null), RangeError);
});

test('un elemento fuera de [0,1] lanza RangeError', () => {
  assert.throws(() => combinarCoberturas([0.5, 1.1]), RangeError);
  assert.throws(() => combinarCoberturas([0.5, -0.1]), RangeError);
});

test('un elemento no finito lanza RangeError', () => {
  assert.throws(() => combinarCoberturas([0.5, NaN]), RangeError);
});
