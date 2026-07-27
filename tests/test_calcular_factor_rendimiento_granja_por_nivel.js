const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularFactorRendimientoGranjaPorNivel } = require('../src/calcularFactorRendimientoGranjaPorNivel.js');

test('nivel S tiene factor de rendimiento 1 (base)', () => {
  assert.equal(calcularFactorRendimientoGranjaPorNivel('S'), 1);
});

test('nivel M tiene factor de rendimiento 2', () => {
  assert.equal(calcularFactorRendimientoGranjaPorNivel('M'), 2);
});

test('nivel L tiene factor de rendimiento 3', () => {
  assert.equal(calcularFactorRendimientoGranjaPorNivel('L'), 3);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => calcularFactorRendimientoGranjaPorNivel('XL'), RangeError);
});
