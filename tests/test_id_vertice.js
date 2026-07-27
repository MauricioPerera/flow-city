const test = require('node:test');
const assert = require('node:assert/strict');
const { idVertice } = require('../src/idVertice.js');

test('genera un id canonico a partir de coordenadas', () => {
  assert.equal(idVertice(0, 0), '0,0');
  assert.equal(idVertice(3, 5), '3,5');
});

test('es deterministico: mismas coordenadas dan siempre el mismo id', () => {
  assert.equal(idVertice(7, 2), idVertice(7, 2));
});

test('coordenadas distintas dan ids distintos (x e y no se confunden)', () => {
  assert.notEqual(idVertice(1, 2), idVertice(2, 1));
});

test('el id es un string', () => {
  assert.equal(typeof idVertice(0, 0), 'string');
});

test('x o y negativos lanzan RangeError', () => {
  assert.throws(() => idVertice(-1, 0), RangeError);
  assert.throws(() => idVertice(0, -1), RangeError);
});

test('x o y no enteros lanzan RangeError', () => {
  assert.throws(() => idVertice(1.5, 0), RangeError);
  assert.throws(() => idVertice(0, 2.5), RangeError);
});
