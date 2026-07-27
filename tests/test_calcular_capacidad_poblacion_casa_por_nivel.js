const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCapacidadPoblacionCasaPorNivel } = require('../src/calcularCapacidadPoblacionCasaPorNivel.js');

test('nivel S aloja 4 personas', () => {
  assert.equal(calcularCapacidadPoblacionCasaPorNivel('S'), 4);
});

test('nivel M aloja 6 personas', () => {
  assert.equal(calcularCapacidadPoblacionCasaPorNivel('M'), 6);
});

test('nivel L aloja 9 personas', () => {
  assert.equal(calcularCapacidadPoblacionCasaPorNivel('L'), 9);
});

test('un nivel desconocido lanza RangeError', () => {
  assert.throws(() => calcularCapacidadPoblacionCasaPorNivel('XL'), RangeError);
});
