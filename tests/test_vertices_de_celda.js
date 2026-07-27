const test = require('node:test');
const assert = require('node:assert/strict');
const { verticesDeCelda } = require('../src/verticesDeCelda.js');

test('devuelve las 4 esquinas de la celda (0,0)', () => {
  assert.deepEqual(verticesDeCelda(0, 0), {
    noroeste: '0,0',
    noreste: '1,0',
    suroeste: '0,1',
    sureste: '1,1',
  });
});

test('devuelve las 4 esquinas de una celda no adyacente al origen', () => {
  assert.deepEqual(verticesDeCelda(2, 3), {
    noroeste: '2,3',
    noreste: '3,3',
    suroeste: '2,4',
    sureste: '3,4',
  });
});

test('celdas adyacentes comparten exactamente la esquina esperada', () => {
  const izquierda = verticesDeCelda(0, 0);
  const derecha = verticesDeCelda(1, 0);
  assert.equal(izquierda.noreste, derecha.noroeste);
  assert.equal(izquierda.sureste, derecha.suroeste);
});

test('x o y negativos lanzan RangeError', () => {
  assert.throws(() => verticesDeCelda(-1, 0), RangeError);
  assert.throws(() => verticesDeCelda(0, -1), RangeError);
});

test('x o y no enteros lanzan RangeError', () => {
  assert.throws(() => verticesDeCelda(1.5, 0), RangeError);
});
