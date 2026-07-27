const test = require('node:test');
const assert = require('node:assert/strict');
const { tramoRequiereCombustible } = require('../src/tramoRequiereCombustible.js');

test('carretera siempre requiere combustible, sin importar la longitud', () => {
  assert.equal(tramoRequiereCombustible('carretera', false), true);
  assert.equal(tramoRequiereCombustible('carretera', true), true);
});

test('subte y ferrocarril nunca requieren combustible', () => {
  assert.equal(tramoRequiereCombustible('subte', true), false);
  assert.equal(tramoRequiereCombustible('ferrocarril', true), false);
});

test('maritima requiere combustible solo si es ruta larga', () => {
  assert.equal(tramoRequiereCombustible('maritima', false), false);
  assert.equal(tramoRequiereCombustible('maritima', true), true);
});

test('un tipoRuta desconocido lanza RangeError', () => {
  assert.throws(() => tramoRequiereCombustible('aerea', false), RangeError);
});

test('un esRutaLarga no booleano lanza RangeError', () => {
  assert.throws(() => tramoRequiereCombustible('carretera', 'si'), RangeError);
});
