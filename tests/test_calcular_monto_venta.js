const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularMontoVenta } = require('../src/calcularMontoVenta.js');

test('calcula el monto como cantidad por precio unitario', () => {
  assert.equal(calcularMontoVenta(10, 5), 50);
});

test('cantidad 0 da monto 0 (nada vendido, no es un error)', () => {
  assert.equal(calcularMontoVenta(0, 5), 0);
});

test('acepta cantidad fraccionaria (proveniente de perdida proporcional de tramo)', () => {
  assert.equal(calcularMontoVenta(7.5, 4), 30);
});

test('cantidad negativa lanza RangeError', () => {
  assert.throws(() => calcularMontoVenta(-1, 5), RangeError);
});

test('precioUnitario no positivo lanza RangeError', () => {
  assert.throws(() => calcularMontoVenta(10, 0), RangeError);
  assert.throws(() => calcularMontoVenta(10, -5), RangeError);
});

test('valores no finitos lanzan RangeError', () => {
  assert.throws(() => calcularMontoVenta(NaN, 5), RangeError);
  assert.throws(() => calcularMontoVenta(10, Infinity), RangeError);
});
