const test = require('node:test');
const assert = require('node:assert/strict');
const { rutaCruzaTerrenoValido } = require('../src/rutaCruzaTerrenoValido.js');

test('carretera no puede cruzar agua profunda en ningun extremo', () => {
  assert.equal(rutaCruzaTerrenoValido('verde', 'agua_profunda', 'carretera'), false);
  assert.equal(rutaCruzaTerrenoValido('agua_profunda', 'verde', 'carretera'), false);
});

test('carretera puede cruzar entre terrenos no acuaticos', () => {
  assert.equal(rutaCruzaTerrenoValido('verde', 'elevada', 'carretera'), true);
  assert.equal(rutaCruzaTerrenoValido('neutra', 'neutra', 'carretera'), true);
});

test('maritima solo puede ir entre agua profunda y agua profunda', () => {
  assert.equal(rutaCruzaTerrenoValido('agua_profunda', 'agua_profunda', 'maritima'), true);
  assert.equal(rutaCruzaTerrenoValido('agua_profunda', 'verde', 'maritima'), false);
  assert.equal(rutaCruzaTerrenoValido('verde', 'agua_profunda', 'maritima'), false);
});

test('ferrocarril y subte estan exentos, cruzan cualquier terreno', () => {
  assert.equal(rutaCruzaTerrenoValido('agua_profunda', 'elevada', 'ferrocarril'), true);
  assert.equal(rutaCruzaTerrenoValido('agua_profunda', 'elevada', 'subte'), true);
});

test('un tipoRuta o terreno desconocido lanza RangeError', () => {
  assert.throws(() => rutaCruzaTerrenoValido('verde', 'verde', 'aerea'), RangeError);
  assert.throws(() => rutaCruzaTerrenoValido('lava', 'verde', 'carretera'), RangeError);
});
