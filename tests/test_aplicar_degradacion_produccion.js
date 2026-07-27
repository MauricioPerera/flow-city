const test = require('node:test');
const assert = require('node:assert/strict');
const { aplicarDegradacionProduccion } = require('../src/aplicarDegradacionProduccion.js');

test('sin degradar, la produccion pasa completa', () => {
  assert.equal(aplicarDegradacionProduccion(8, false), 8);
});

test('degradado, la produccion se reduce a la mitad', () => {
  assert.equal(aplicarDegradacionProduccion(8, true), 4);
});

test('degradado con produccion impar descarta el resto (floor)', () => {
  assert.equal(aplicarDegradacionProduccion(5, true), 2);
});

test('produccion 0 sigue siendo 0 este degradado o no', () => {
  assert.equal(aplicarDegradacionProduccion(0, true), 0);
  assert.equal(aplicarDegradacionProduccion(0, false), 0);
});

test('produccionPotencial negativa o no finita lanza RangeError', () => {
  assert.throws(() => aplicarDegradacionProduccion(-1, true), RangeError);
  assert.throws(() => aplicarDegradacionProduccion(NaN, true), RangeError);
  assert.throws(() => aplicarDegradacionProduccion(Infinity, true), RangeError);
});

test('degradado no booleano lanza RangeError', () => {
  assert.throws(() => aplicarDegradacionProduccion(8, 'true'), RangeError);
  assert.throws(() => aplicarDegradacionProduccion(8, 1), RangeError);
  assert.throws(() => aplicarDegradacionProduccion(8, null), RangeError);
});
