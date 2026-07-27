const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCrecimientoPoblacion } = require('../src/calcularCrecimientoPoblacion.js');

test('indice 1 (cobertura perfecta) crece a tasaBase completa', () => {
  assert.equal(calcularCrecimientoPoblacion(100, 1, 0.1), 10);
});

test('indice 0.5 no cambia la poblacion', () => {
  assert.equal(calcularCrecimientoPoblacion(100, 0.5, 0.1), 0);
});

test('indice 0 (sin cobertura) decrece a tasaBase completa', () => {
  assert.equal(calcularCrecimientoPoblacion(100, 0, 0.1), -10);
});

test('indice intermedio da un cambio proporcional', () => {
  assert.equal(calcularCrecimientoPoblacion(100, 0.75, 0.1), 5);
});

test('poblacion 0 no crece sin importar el indice', () => {
  assert.equal(calcularCrecimientoPoblacion(0, 1, 0.1), 0);
});

test('poblacionActual negativa o no entera lanza RangeError', () => {
  assert.throws(() => calcularCrecimientoPoblacion(-1, 0.5, 0.1), RangeError);
  assert.throws(() => calcularCrecimientoPoblacion(1.5, 0.5, 0.1), RangeError);
});

test('indice fuera de [0,1] lanza RangeError', () => {
  assert.throws(() => calcularCrecimientoPoblacion(100, 1.1, 0.1), RangeError);
  assert.throws(() => calcularCrecimientoPoblacion(100, -0.1, 0.1), RangeError);
});

test('tasaBase no positiva o no finita lanza RangeError', () => {
  assert.throws(() => calcularCrecimientoPoblacion(100, 0.5, 0), RangeError);
  assert.throws(() => calcularCrecimientoPoblacion(100, 0.5, -0.1), RangeError);
  assert.throws(() => calcularCrecimientoPoblacion(100, 0.5, Infinity), RangeError);
});
