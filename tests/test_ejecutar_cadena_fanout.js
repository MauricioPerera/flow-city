const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaFanOut } = require('../src/ejecutarCadenaFanOut.js');

test('la bomba reparte su produccion entre la granja y reforestacion en paralelo', () => {
  const resultado = ejecutarCadenaFanOut();
  assert.deepEqual(resultado, {
    aguaProducida: 4,
    aguaParaGranja: 2,
    aguaRecibidaGranja: 2,
    manzanasProducidas: 4,
    aguaParaReforestacion: 2,
    aguaRecibidaReforestacion: 2,
    arbolesProducidos: 1,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarCadenaFanOut(), ejecutarCadenaFanOut());
});
