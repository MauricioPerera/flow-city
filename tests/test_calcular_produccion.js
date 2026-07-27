const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularProduccion } = require('../src/calcularProduccion.js');

test('1 unidad de entrada con ratio 1:2 produce 2 unidades', () => {
  assert.equal(calcularProduccion(1, 1, 2), 2);
});

test('4 unidades de entrada con ratio 2:1 produce 2 unidades', () => {
  assert.equal(calcularProduccion(4, 2, 1), 2);
});

test('entrada no multiplo del ratio_entrada descarta el resto (floor)', () => {
  assert.equal(calcularProduccion(5, 2, 1), 2);
});

test('0 unidades de entrada produce 0', () => {
  assert.equal(calcularProduccion(0, 1, 2), 0);
});

test('entrada insuficiente para una sola unidad de ratio_entrada produce 0', () => {
  assert.equal(calcularProduccion(1, 2, 1), 0);
});

test('ratio_entrada o ratio_salida <= 0 lanza RangeError', () => {
  assert.throws(() => calcularProduccion(1, 0, 2), RangeError);
  assert.throws(() => calcularProduccion(1, 2, 0), RangeError);
  assert.throws(() => calcularProduccion(1, -1, 2), RangeError);
});

test('entrada negativa lanza RangeError', () => {
  assert.throws(() => calcularProduccion(-1, 1, 2), RangeError);
});
