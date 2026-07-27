const test = require('node:test');
const assert = require('node:assert/strict');
const { actualizarContadorQuiebra } = require('../src/actualizarContadorQuiebra.js');

test('saldo negativo incrementa el contador en 1', () => {
  assert.equal(actualizarContadorQuiebra(0, -5), 1);
  assert.equal(actualizarContadorQuiebra(3, -1), 4);
});

test('saldo exactamente 0 cuenta como quiebra e incrementa el contador', () => {
  assert.equal(actualizarContadorQuiebra(5, 0), 6);
});

test('saldo positivo reinicia el contador a 0', () => {
  assert.equal(actualizarContadorQuiebra(5, 10), 0);
  assert.equal(actualizarContadorQuiebra(0, 10), 0);
});

test('saldo positivo minimo (mayor a 0) tambien reinicia el contador', () => {
  assert.equal(actualizarContadorQuiebra(3, 0.01), 0);
});

test('contadorActual negativo o no entero lanza RangeError', () => {
  assert.throws(() => actualizarContadorQuiebra(-1, -5), RangeError);
  assert.throws(() => actualizarContadorQuiebra(1.5, -5), RangeError);
});

test('saldoTesoreria no finito lanza RangeError', () => {
  assert.throws(() => actualizarContadorQuiebra(0, NaN), RangeError);
  assert.throws(() => actualizarContadorQuiebra(0, Infinity), RangeError);
  assert.throws(() => actualizarContadorQuiebra(0, -Infinity), RangeError);
});
