const test = require('node:test');
const assert = require('node:assert/strict');
const { radioAreaAccionPorNivel } = require('../src/radioAreaAccionPorNivel.js');

test('nivel S tiene radio de accion 2', () => {
  assert.equal(radioAreaAccionPorNivel('S'), 2);
});

test('nivel M tiene radio de accion 3', () => {
  assert.equal(radioAreaAccionPorNivel('M'), 3);
});

test('nivel L tiene radio de accion 4', () => {
  assert.equal(radioAreaAccionPorNivel('L'), 4);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => radioAreaAccionPorNivel('XL'), RangeError);
});
