const test = require('node:test');
const assert = require('node:assert/strict');
const { resolverCompraAlmacen } = require('../src/resolverCompraAlmacen.js');

test('cuando el almacen tiene mas capacidad que lo ofrecido, se compra todo lo ofrecido', () => {
  assert.equal(resolverCompraAlmacen(10, 15), 10);
});

test('cuando lo ofrecido supera la capacidad del almacen, se compra solo la capacidad', () => {
  assert.equal(resolverCompraAlmacen(15, 10), 10);
});

test('cantidades iguales: se compra esa misma cantidad', () => {
  assert.equal(resolverCompraAlmacen(10, 10), 10);
});

test('nada ofrecido da compra 0', () => {
  assert.equal(resolverCompraAlmacen(0, 10), 0);
});

test('almacen sin capacidad de compra da compra 0', () => {
  assert.equal(resolverCompraAlmacen(10, 0), 0);
});

test('cantidadOfrecida negativa lanza RangeError', () => {
  assert.throws(() => resolverCompraAlmacen(-1, 10), RangeError);
});

test('capacidadCompraAlmacen negativa lanza RangeError', () => {
  assert.throws(() => resolverCompraAlmacen(10, -1), RangeError);
});

test('valores no finitos lanzan RangeError', () => {
  assert.throws(() => resolverCompraAlmacen(NaN, 10), RangeError);
  assert.throws(() => resolverCompraAlmacen(10, Infinity), RangeError);
});
