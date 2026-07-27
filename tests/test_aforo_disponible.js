const test = require('node:test');
const assert = require('node:assert/strict');
const { aforoDisponible } = require('../src/aforoDisponible.js');

test('con ocupacion parcial, devuelve el espacio restante', () => {
  assert.equal(aforoDisponible(10, 3), 7);
});

test('con ocupacion 0, todo el aforo esta disponible', () => {
  assert.equal(aforoDisponible(10, 0), 10);
});

test('con ocupacion igual al aforo maximo, no queda espacio', () => {
  assert.equal(aforoDisponible(10, 10), 0);
});

test('ocupacion mayor al aforo maximo (estado inconsistente) se clampea a 0, no negativo', () => {
  assert.equal(aforoDisponible(10, 15), 0);
});

test('aforoMaximo no positivo o no entero lanza RangeError', () => {
  assert.throws(() => aforoDisponible(0, 0), RangeError);
  assert.throws(() => aforoDisponible(-1, 0), RangeError);
  assert.throws(() => aforoDisponible(1.5, 0), RangeError);
});

test('ocupacionActual negativa o no entera lanza RangeError', () => {
  assert.throws(() => aforoDisponible(10, -1), RangeError);
  assert.throws(() => aforoDisponible(10, 1.5), RangeError);
});
