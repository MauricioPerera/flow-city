const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularMultiplicadorClima } = require('../src/calcularMultiplicadorClima.js');

test('verano da bonus de cosecha (1.5x)', () => {
  assert.equal(calcularMultiplicadorClima('verano'), 1.5);
});

test('invierno da penalizacion de cosecha (0.5x)', () => {
  assert.equal(calcularMultiplicadorClima('invierno'), 0.5);
});

test('otono es neutral (1x)', () => {
  assert.equal(calcularMultiplicadorClima('otono'), 1);
});

test('primavera es neutral (1x)', () => {
  assert.equal(calcularMultiplicadorClima('primavera'), 1);
});

test('una estacion desconocida lanza RangeError', () => {
  assert.throws(() => calcularMultiplicadorClima('verano2'), RangeError);
});

test('un valor no string lanza RangeError', () => {
  assert.throws(() => calcularMultiplicadorClima(42), RangeError);
});
