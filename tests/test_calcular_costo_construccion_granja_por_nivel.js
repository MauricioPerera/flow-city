const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCostoConstruccionGranjaPorNivel } = require('../src/calcularCostoConstruccionGranjaPorNivel.js');

test('nivel S cuesta lo mismo que la granja base (30, sin recargo)', () => {
  assert.equal(calcularCostoConstruccionGranjaPorNivel('S'), 30);
});

test('nivel M cuesta 50 (30 base + 20 de recargo)', () => {
  assert.equal(calcularCostoConstruccionGranjaPorNivel('M'), 50);
});

test('nivel L cuesta 80 (30 base + 50 de recargo)', () => {
  assert.equal(calcularCostoConstruccionGranjaPorNivel('L'), 80);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => calcularCostoConstruccionGranjaPorNivel('XL'), RangeError);
});
