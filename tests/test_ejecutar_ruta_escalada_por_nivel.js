const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarRutaEscaladaPorNivel } = require('../src/ejecutarRutaEscaladaPorNivel.js');

test('la capacidad de la ruta crece con el nivel, el costo tambien, y solo se permite mejorar (nunca degradar)', () => {
  const resultado = ejecutarRutaEscaladaPorNivel();
  assert.deepEqual(resultado, {
    historialCapacidad: [
      { nivel: 'S', capacidad: 10 },
      { nivel: 'M', capacidad: 20 },
      { nivel: 'L', capacidad: 30 },
    ],
    historialCosto: [
      { nivel: 'S', costo: 20 },
      { nivel: 'M', costo: 40 },
      { nivel: 'L', costo: 70 },
    ],
    mejoras: [
      { nivelActual: 'S', nivelNuevo: 'M', costoMejora: 20 },
      { nivelActual: 'M', nivelNuevo: 'L', costoMejora: 30 },
      { nivelActual: 'S', nivelNuevo: 'L', costoMejora: 50 },
    ],
    degradarLanzaError: true,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarRutaEscaladaPorNivel(), ejecutarRutaEscaladaPorNivel());
});
