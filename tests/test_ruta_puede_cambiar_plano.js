const test = require('node:test');
const assert = require('node:assert/strict');
const { rutaPuedeCambiarPlano } = require('../src/rutaPuedeCambiarPlano.js');

test('nivel S no puede cambiar de plano', () => {
  assert.equal(rutaPuedeCambiarPlano('S'), false);
});

test('nivel M puede cambiar de plano', () => {
  assert.equal(rutaPuedeCambiarPlano('M'), true);
});

test('nivel L puede cambiar de plano', () => {
  assert.equal(rutaPuedeCambiarPlano('L'), true);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => rutaPuedeCambiarPlano('XL'), RangeError);
});
