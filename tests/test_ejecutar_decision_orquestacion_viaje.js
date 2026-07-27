const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarDecisionOrquestacionViaje } = require('../src/ejecutarDecisionOrquestacionViaje.js');

test('un viaje corto se resuelve instantaneo y uno largo se resuelve en varios ticks de transito', () => {
  const resultado = ejecutarDecisionOrquestacionViaje();
  assert.deepEqual(resultado, {
    distanciaCorta: 5,
    ticksCorto: 1,
    entregadoCorto: 6,
    distanciaLarga: 25,
    ticksLargo: 3,
    ticksTranscurridos: 3,
    entregadoLargo: 6,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarDecisionOrquestacionViaje(),
    ejecutarDecisionOrquestacionViaje()
  );
});
