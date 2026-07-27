const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarProduccionGranjaPorNivel } = require('../src/ejecutarProduccionGranjaPorNivel.js');

test('la misma agua recibida produce mas manzanas cuanto mas alto es el nivel de la granja', () => {
  const resultado = ejecutarProduccionGranjaPorNivel();
  assert.deepEqual(resultado, {
    historial: [
      { nivel: 'S', aguaRecibida: 4, rawManzanas: 8, factor: 1, manzanasProducidas: 8, costoConstruccion: 30 },
      { nivel: 'M', aguaRecibida: 4, rawManzanas: 8, factor: 2, manzanasProducidas: 16, costoConstruccion: 50 },
      { nivel: 'L', aguaRecibida: 4, rawManzanas: 8, factor: 3, manzanasProducidas: 24, costoConstruccion: 80 },
    ],
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarProduccionGranjaPorNivel(), ejecutarProduccionGranjaPorNivel());
});
