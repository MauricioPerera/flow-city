const test = require('node:test');
const assert = require('node:assert/strict');
const { planoDeTerreno } = require('../src/planoDeTerreno.js');

test('elevada es el plano elevado', () => {
  assert.equal(planoDeTerreno('elevada'), 'elevada');
});

test('verde, agua_profunda y neutra son el plano base', () => {
  assert.equal(planoDeTerreno('verde'), 'base');
  assert.equal(planoDeTerreno('agua_profunda'), 'base');
  assert.equal(planoDeTerreno('neutra'), 'base');
});

test('un terreno desconocido lanza RangeError', () => {
  assert.throws(() => planoDeTerreno('lava'), RangeError);
});
