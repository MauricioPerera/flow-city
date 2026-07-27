const test = require('node:test');
const assert = require('node:assert/strict');
const { clasificarLongitudRuta } = require('../src/clasificarLongitudRuta.js');

test('una longitud menor al umbral es corta', () => {
  assert.equal(clasificarLongitudRuta(5), 'corta');
  assert.equal(clasificarLongitudRuta(14), 'corta');
});

test('una longitud igual o mayor al umbral (15) es larga', () => {
  assert.equal(clasificarLongitudRuta(15), 'larga');
  assert.equal(clasificarLongitudRuta(25), 'larga');
});

test('una longitud no positiva lanza RangeError', () => {
  assert.throws(() => clasificarLongitudRuta(0), RangeError);
  assert.throws(() => clasificarLongitudRuta(-1), RangeError);
});
