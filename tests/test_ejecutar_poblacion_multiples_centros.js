const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarPoblacionMultiplesCentros } = require('../src/ejecutarPoblacionMultiplesCentros.js');

test('una casa se construye si cae en la zona de CUALQUIER centro civico, incluyendo solapamiento', () => {
  const resultado = ejecutarPoblacionMultiplesCentros();
  assert.deepEqual(resultado, {
    centros: [
      { x: 1, y: 1, radio: 2 },
      { x: 4, y: 4, radio: 2 },
    ],
    casasIntentadas: [
      { x: 0, y: 0, construida: true },
      { x: 5, y: 5, construida: true },
      { x: 3, y: 3, construida: true },
      { x: 0, y: 5, construida: false },
    ],
    casasConstruidas: 3,
    poblacionTotal: 30,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarPoblacionMultiplesCentros(), ejecutarPoblacionMultiplesCentros());
});
