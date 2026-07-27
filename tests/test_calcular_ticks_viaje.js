const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularTicksViaje } = require('../src/calcularTicksViaje.js');

test('distancia multiplo exacto de la velocidad da un numero exacto de ticks', () => {
  assert.equal(calcularTicksViaje(10, 5), 2);
});

test('distancia no multiplo redondea hacia arriba', () => {
  assert.equal(calcularTicksViaje(11, 5), 3);
});

test('distancia 0 no requiere ningun tick (llegada inmediata)', () => {
  assert.equal(calcularTicksViaje(0, 5), 0);
});

test('distancia igual a la velocidad tarda exactamente 1 tick', () => {
  assert.equal(calcularTicksViaje(5, 5), 1);
});

test('distancia menor a la velocidad tarda 1 tick (redondeo hacia arriba)', () => {
  assert.equal(calcularTicksViaje(1, 5), 1);
});

test('distanciaTotal negativa lanza RangeError', () => {
  assert.throws(() => calcularTicksViaje(-1, 5), RangeError);
});

test('velocidadBase no positiva o no finita lanza RangeError', () => {
  assert.throws(() => calcularTicksViaje(10, 0), RangeError);
  assert.throws(() => calcularTicksViaje(10, -1), RangeError);
  assert.throws(() => calcularTicksViaje(10, Infinity), RangeError);
});

test('distanciaTotal no finita lanza RangeError', () => {
  assert.throws(() => calcularTicksViaje(NaN, 5), RangeError);
  assert.throws(() => calcularTicksViaje(Infinity, 5), RangeError);
});
