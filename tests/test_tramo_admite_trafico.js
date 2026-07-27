const test = require('node:test');
const assert = require('node:assert/strict');
const { tramoAdmiteTrafico } = require('../src/tramoAdmiteTrafico.js');

test('tramo ambos admite mercaderia', () => {
  assert.equal(tramoAdmiteTrafico({ tipoTrafico: 'ambos' }, 'mercaderia'), true);
});

test('tramo ambos admite personas', () => {
  assert.equal(tramoAdmiteTrafico({ tipoTrafico: 'ambos' }, 'personas'), true);
});

test('tramo mercaderia admite mercaderia pero no personas', () => {
  assert.equal(tramoAdmiteTrafico({ tipoTrafico: 'mercaderia' }, 'mercaderia'), true);
  assert.equal(tramoAdmiteTrafico({ tipoTrafico: 'mercaderia' }, 'personas'), false);
});

test('tramo personas admite personas pero no mercaderia', () => {
  assert.equal(tramoAdmiteTrafico({ tipoTrafico: 'personas' }, 'personas'), true);
  assert.equal(tramoAdmiteTrafico({ tipoTrafico: 'personas' }, 'mercaderia'), false);
});

test('tipoTrafico del tramo desconocido lanza RangeError', () => {
  assert.throws(() => tramoAdmiteTrafico({ tipoTrafico: 'volador' }, 'mercaderia'), RangeError);
});

test('consulta con ambos lanza RangeError (la consulta es siempre un tipo concreto)', () => {
  assert.throws(() => tramoAdmiteTrafico({ tipoTrafico: 'ambos' }, 'ambos'), RangeError);
});

test('consulta con valor desconocido lanza RangeError', () => {
  assert.throws(() => tramoAdmiteTrafico({ tipoTrafico: 'ambos' }, 'volador'), RangeError);
});
