const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCoberturaNecesidad } = require('../src/calcularCoberturaNecesidad.js');

test('recibido igual a requerido cubre completamente (1)', () => {
  assert.equal(calcularCoberturaNecesidad(10, 10), 1);
});

test('recibido a la mitad de lo requerido cubre 0.5', () => {
  assert.equal(calcularCoberturaNecesidad(10, 5), 0.5);
});

test('recibido en superavit no supera 1 (no sobre-satisface)', () => {
  assert.equal(calcularCoberturaNecesidad(10, 20), 1);
});

test('requerido 0 (sin necesidad) siempre esta cubierto', () => {
  assert.equal(calcularCoberturaNecesidad(0, 0), 1);
  assert.equal(calcularCoberturaNecesidad(0, 5), 1);
});

test('recibido 0 con requerido positivo cubre 0', () => {
  assert.equal(calcularCoberturaNecesidad(10, 0), 0);
});

test('requerido negativo lanza RangeError', () => {
  assert.throws(() => calcularCoberturaNecesidad(-1, 5), RangeError);
});

test('recibido negativo lanza RangeError', () => {
  assert.throws(() => calcularCoberturaNecesidad(10, -1), RangeError);
});

test('valores no finitos lanzan RangeError', () => {
  assert.throws(() => calcularCoberturaNecesidad(NaN, 5), RangeError);
  assert.throws(() => calcularCoberturaNecesidad(10, Infinity), RangeError);
});
