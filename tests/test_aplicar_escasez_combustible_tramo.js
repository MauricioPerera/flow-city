const test = require('node:test');
const assert = require('node:assert/strict');
const { aplicarEscasezCombustibleTramo } = require('../src/aplicarEscasezCombustibleTramo.js');

test('con combustible suficiente, entrega la carga completa sin degradar', () => {
  assert.deepEqual(aplicarEscasezCombustibleTramo(10, 10), { cargaEfectiva: 10, factorDegradacion: 1 });
  assert.deepEqual(aplicarEscasezCombustibleTramo(10, 20), { cargaEfectiva: 10, factorDegradacion: 1 });
});

test('sin combustible, la carga efectiva es 0', () => {
  assert.deepEqual(aplicarEscasezCombustibleTramo(10, 0), { cargaEfectiva: 0, factorDegradacion: 0 });
});

test('con combustible parcial, degrada linealmente', () => {
  assert.deepEqual(aplicarEscasezCombustibleTramo(10, 5), { cargaEfectiva: 5, factorDegradacion: 0.5 });
});

test('lanza RangeError si cargaSolicitada no es un entero positivo', () => {
  assert.throws(() => aplicarEscasezCombustibleTramo(0, 5), RangeError);
});

test('lanza RangeError si combustibleDisponible es negativo o no finito', () => {
  assert.throws(() => aplicarEscasezCombustibleTramo(10, -1), RangeError);
});
