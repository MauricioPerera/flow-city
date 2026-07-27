const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAlmacen } = require('../src/crearAlmacen.js');

test('crea un almacen con las capacidades pedidas y stock en 0', () => {
  assert.deepEqual(crearAlmacen(10, 5), {
    capacidadMateriaPrima: 10,
    capacidadProducto: 5,
    stockMateriaPrima: 0,
    stockProducto: 0,
  });
});

test('acepta capacidades distintas para materia prima y producto', () => {
  const almacen = crearAlmacen(3, 20);
  assert.equal(almacen.capacidadMateriaPrima, 3);
  assert.equal(almacen.capacidadProducto, 20);
});

test('capacidadMateriaPrima no positiva o no entera lanza RangeError', () => {
  assert.throws(() => crearAlmacen(0, 5), RangeError);
  assert.throws(() => crearAlmacen(-1, 5), RangeError);
  assert.throws(() => crearAlmacen(1.5, 5), RangeError);
});

test('capacidadProducto no positiva o no entera lanza RangeError', () => {
  assert.throws(() => crearAlmacen(10, 0), RangeError);
  assert.throws(() => crearAlmacen(10, -1), RangeError);
  assert.throws(() => crearAlmacen(10, 1.5), RangeError);
});
