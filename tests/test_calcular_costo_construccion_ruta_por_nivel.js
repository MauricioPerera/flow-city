const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCostoConstruccionRutaPorNivel } = require('../src/calcularCostoConstruccionRutaPorNivel.js');

test('nivel S cuesta 20', () => {
  assert.equal(calcularCostoConstruccionRutaPorNivel('S'), 20);
});

test('nivel M cuesta 40', () => {
  assert.equal(calcularCostoConstruccionRutaPorNivel('M'), 40);
});

test('nivel L cuesta 70', () => {
  assert.equal(calcularCostoConstruccionRutaPorNivel('L'), 70);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => calcularCostoConstruccionRutaPorNivel('XL'), RangeError);
});
