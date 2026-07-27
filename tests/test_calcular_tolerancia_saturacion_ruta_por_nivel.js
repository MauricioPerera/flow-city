const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularToleranciaSaturacionRutaPorNivel } = require('../src/calcularToleranciaSaturacionRutaPorNivel.js');

test('nivel S tiene tolerancia 1 (sin bono)', () => {
  assert.equal(calcularToleranciaSaturacionRutaPorNivel('S'), 1);
});

test('nivel M tiene tolerancia 2', () => {
  assert.equal(calcularToleranciaSaturacionRutaPorNivel('M'), 2);
});

test('nivel L tiene tolerancia 3', () => {
  assert.equal(calcularToleranciaSaturacionRutaPorNivel('L'), 3);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => calcularToleranciaSaturacionRutaPorNivel('XL'), RangeError);
});
