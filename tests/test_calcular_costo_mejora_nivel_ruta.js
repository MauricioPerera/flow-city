const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCostoMejoraNivelRuta } = require('../src/calcularCostoMejoraNivelRuta.js');

test('mejorar de S a M cuesta la diferencia (20)', () => {
  assert.equal(calcularCostoMejoraNivelRuta('S', 'M'), 20);
});

test('mejorar de M a L cuesta la diferencia (30)', () => {
  assert.equal(calcularCostoMejoraNivelRuta('M', 'L'), 30);
});

test('mejorar de S a L cuesta la diferencia total (50)', () => {
  assert.equal(calcularCostoMejoraNivelRuta('S', 'L'), 50);
});

test('lanza RangeError al intentar degradar (M a S)', () => {
  assert.throws(() => calcularCostoMejoraNivelRuta('M', 'S'), RangeError);
});

test('lanza RangeError al intentar quedarse en el mismo nivel (S a S)', () => {
  assert.throws(() => calcularCostoMejoraNivelRuta('S', 'S'), RangeError);
});
