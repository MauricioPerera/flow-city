const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularSaturacion } = require('../src/calcularSaturacion.js');

test('carga 0 no tiene enlentecimiento ni perdida', () => {
  assert.deepEqual(calcularSaturacion(0, 10), { factorVelocidad: 1, perdida: 0 });
});

test('carga por debajo de la capacidad: velocidad normal, sin perdida', () => {
  assert.deepEqual(calcularSaturacion(5, 10), { factorVelocidad: 1, perdida: 0 });
});

test('carga igual a la capacidad: velocidad normal, sin perdida', () => {
  assert.deepEqual(calcularSaturacion(10, 10), { factorVelocidad: 1, perdida: 0 });
});

test('carga el doble de la capacidad: velocidad a la mitad, se pierde el excedente', () => {
  assert.deepEqual(calcularSaturacion(20, 10), { factorVelocidad: 0.5, perdida: 10 });
});

test('carga 1.5x la capacidad: degradacion proporcional, perdida parcial', () => {
  const resultado = calcularSaturacion(15, 10);
  assert.ok(Math.abs(resultado.factorVelocidad - (2 / 3)) < 1e-9);
  assert.equal(resultado.perdida, 5);
});

test('carga negativa lanza RangeError', () => {
  assert.throws(() => calcularSaturacion(-1, 10), RangeError);
});

test('capacidad 0 o negativa lanza RangeError', () => {
  assert.throws(() => calcularSaturacion(5, 0), RangeError);
  assert.throws(() => calcularSaturacion(5, -1), RangeError);
});
