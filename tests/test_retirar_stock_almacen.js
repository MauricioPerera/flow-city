const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAlmacen } = require('../src/crearAlmacen.js');
const { agregarStockAlmacen } = require('../src/agregarStockAlmacen.js');
const { retirarStockAlmacen } = require('../src/retirarStockAlmacen.js');

test('retira toda la cantidad si hay suficiente stock disponible', () => {
  const almacen = crearAlmacen(10, 5);
  agregarStockAlmacen(almacen, 'materiaPrima', 7);
  const retirado = retirarStockAlmacen(almacen, 'materiaPrima', 5);
  assert.equal(retirado, 5);
  assert.equal(almacen.stockMateriaPrima, 2);
});

test('retira solo lo disponible cuando se pide mas de lo que hay', () => {
  const almacen = crearAlmacen(10, 5);
  agregarStockAlmacen(almacen, 'materiaPrima', 3);
  const retirado = retirarStockAlmacen(almacen, 'materiaPrima', 10);
  assert.equal(retirado, 3);
  assert.equal(almacen.stockMateriaPrima, 0);
});

test('almacen sin stock retira 0', () => {
  const almacen = crearAlmacen(10, 5);
  const retirado = retirarStockAlmacen(almacen, 'materiaPrima', 5);
  assert.equal(retirado, 0);
  assert.equal(almacen.stockMateriaPrima, 0);
});

test('funciona igual para el campo producto, independiente de materiaPrima', () => {
  const almacen = crearAlmacen(10, 5);
  agregarStockAlmacen(almacen, 'producto', 4);
  const retirado = retirarStockAlmacen(almacen, 'producto', 2);
  assert.equal(retirado, 2);
  assert.equal(almacen.stockProducto, 2);
  assert.equal(almacen.stockMateriaPrima, 0);
});

test('campo desconocido lanza RangeError', () => {
  const almacen = crearAlmacen(10, 5);
  assert.throws(() => retirarStockAlmacen(almacen, 'volador', 5), RangeError);
});

test('cantidad no positiva o no entera lanza RangeError', () => {
  const almacen = crearAlmacen(10, 5);
  assert.throws(() => retirarStockAlmacen(almacen, 'materiaPrima', 0), RangeError);
  assert.throws(() => retirarStockAlmacen(almacen, 'materiaPrima', -1), RangeError);
  assert.throws(() => retirarStockAlmacen(almacen, 'materiaPrima', 1.5), RangeError);
});

test('almacen invalido (null o no objeto) lanza RangeError', () => {
  assert.throws(() => retirarStockAlmacen(null, 'materiaPrima', 5), RangeError);
  assert.throws(() => retirarStockAlmacen('no-es-almacen', 'materiaPrima', 5), RangeError);
});
