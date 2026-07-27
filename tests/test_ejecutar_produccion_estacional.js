const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarProduccionEstacional } = require('../src/ejecutarProduccionEstacional.js');

test('la produccion de la granja varia segun la estacion: bonus en verano, penalizacion en invierno', () => {
  const resultado = ejecutarProduccionEstacional();
  assert.deepEqual(resultado, {
    ticksMuestra: [0, 84, 168, 252],
    historial: [
      { tick: 0, estacion: 'otono', aguaProducida: 4, aguaRecibida: 4, manzanasCrudo: 8, multiplicadorClima: 1, manzanasProducidas: 8 },
      { tick: 84, estacion: 'invierno', aguaProducida: 4, aguaRecibida: 4, manzanasCrudo: 8, multiplicadorClima: 0.5, manzanasProducidas: 4 },
      { tick: 168, estacion: 'primavera', aguaProducida: 4, aguaRecibida: 4, manzanasCrudo: 8, multiplicadorClima: 1, manzanasProducidas: 8 },
      { tick: 252, estacion: 'verano', aguaProducida: 4, aguaRecibida: 4, manzanasCrudo: 8, multiplicadorClima: 1.5, manzanasProducidas: 12 },
    ],
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarProduccionEstacional(), ejecutarProduccionEstacional());
});
