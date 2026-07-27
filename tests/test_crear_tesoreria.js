const test = require('node:test');
const assert = require('node:assert/strict');
const { crearTesoreria } = require('../src/crearTesoreria.js');

test('crea una tesoreria con el saldo inicial pedido', () => {
  assert.deepEqual(crearTesoreria(1000), { saldo: 1000 });
});

test('acepta saldo inicial 0', () => {
  assert.deepEqual(crearTesoreria(0), { saldo: 0 });
});

test('acepta saldo inicial no entero (decimales de moneda)', () => {
  assert.deepEqual(crearTesoreria(150.5), { saldo: 150.5 });
});

test('saldo inicial negativo lanza RangeError', () => {
  assert.throws(() => crearTesoreria(-1), RangeError);
});

test('saldo inicial no finito (NaN, Infinity) lanza RangeError', () => {
  assert.throws(() => crearTesoreria(NaN), RangeError);
  assert.throws(() => crearTesoreria(Infinity), RangeError);
  assert.throws(() => crearTesoreria(-Infinity), RangeError);
});

test('saldo inicial no numerico lanza RangeError', () => {
  assert.throws(() => crearTesoreria('1000'), RangeError);
  assert.throws(() => crearTesoreria(null), RangeError);
  assert.throws(() => crearTesoreria(undefined), RangeError);
});
