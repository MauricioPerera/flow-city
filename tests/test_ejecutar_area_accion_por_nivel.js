const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarAreaAccionPorNivel } = require('../src/ejecutarAreaAccionPorNivel.js');

test('el radio de area de accion crece con el nivel, y el mismo radio vale para reforestacion y tala', () => {
  const resultado = ejecutarAreaAccionPorNivel();
  assert.deepEqual(resultado, {
    centro: { x: 5, y: 5 },
    historial: [
      {
        nivel: 'S', radio: 2,
        celdaDentro: { x: 7, y: 5 }, celdaDentroEnAreaReforestacion: true, celdaDentroEnAreaTala: true,
        celdaFuera: { x: 8, y: 5 }, celdaFueraEnAreaReforestacion: false, celdaFueraEnAreaTala: false,
      },
      {
        nivel: 'M', radio: 3,
        celdaDentro: { x: 8, y: 5 }, celdaDentroEnAreaReforestacion: true, celdaDentroEnAreaTala: true,
        celdaFuera: { x: 9, y: 5 }, celdaFueraEnAreaReforestacion: false, celdaFueraEnAreaTala: false,
      },
      {
        nivel: 'L', radio: 4,
        celdaDentro: { x: 9, y: 5 }, celdaDentroEnAreaReforestacion: true, celdaDentroEnAreaTala: true,
        celdaFuera: { x: 10, y: 5 }, celdaFueraEnAreaReforestacion: false, celdaFueraEnAreaTala: false,
      },
    ],
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarAreaAccionPorNivel(), ejecutarAreaAccionPorNivel());
});
