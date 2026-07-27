const test = require('node:test');
const assert = require('node:assert/strict');
const { verticeEntrada } = require('../src/verticeEntrada.js');

test('norte apunta a la esquina noreste', () => {
  assert.equal(verticeEntrada(0, 0, 'norte'), '1,0');
});

test('este apunta a la esquina sureste', () => {
  assert.equal(verticeEntrada(0, 0, 'este'), '1,1');
});

test('sur apunta a la esquina suroeste', () => {
  assert.equal(verticeEntrada(0, 0, 'sur'), '0,1');
});

test('oeste apunta a la esquina noroeste', () => {
  assert.equal(verticeEntrada(0, 0, 'oeste'), '0,0');
});

test('funciona igual para una celda no adyacente al origen', () => {
  assert.equal(verticeEntrada(2, 3, 'norte'), '3,3');
  assert.equal(verticeEntrada(2, 3, 'sur'), '2,4');
});

test('direccion de rotacion desconocida lanza RangeError', () => {
  assert.throws(() => verticeEntrada(0, 0, 'arriba'), RangeError);
});

test('coordenadas invalidas lanzan RangeError (delegado)', () => {
  assert.throws(() => verticeEntrada(-1, 0, 'norte'), RangeError);
  assert.throws(() => verticeEntrada(0, 1.5, 'norte'), RangeError);
});
