const test = require('node:test');
const assert = require('node:assert/strict');
const { resolverVentaLocal } = require('../src/resolverVentaLocal.js');

test('limitado por stock disponible cuando es el menor de los tres', () => {
  assert.equal(resolverVentaLocal(10, 5, 8), 5);
});

test('limitado por aforo disponible cuando es el menor de los tres', () => {
  assert.equal(resolverVentaLocal(10, 20, 3), 3);
});

test('limitado por demanda cuando es el menor de los tres', () => {
  assert.equal(resolverVentaLocal(2, 20, 8), 2);
});

test('cuando los tres coinciden, se vende esa cantidad', () => {
  assert.equal(resolverVentaLocal(5, 5, 5), 5);
});

test('demanda 0 da venta 0', () => {
  assert.equal(resolverVentaLocal(0, 5, 8), 0);
});

test('stock 0 da venta 0', () => {
  assert.equal(resolverVentaLocal(10, 0, 8), 0);
});

test('aforo 0 da venta 0', () => {
  assert.equal(resolverVentaLocal(10, 5, 0), 0);
});

test('cualquier argumento negativo lanza RangeError', () => {
  assert.throws(() => resolverVentaLocal(-1, 5, 8), RangeError);
  assert.throws(() => resolverVentaLocal(10, -1, 8), RangeError);
  assert.throws(() => resolverVentaLocal(10, 5, -1), RangeError);
});

test('valores no finitos lanzan RangeError', () => {
  assert.throws(() => resolverVentaLocal(NaN, 5, 8), RangeError);
  assert.throws(() => resolverVentaLocal(10, Infinity, 8), RangeError);
});
