const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAlmacen } = require('../src/crearAlmacen.js');
const { agregarStockAlmacen } = require('../src/agregarStockAlmacen.js');

test('agrega toda la cantidad si hay espacio suficiente', () => {
  const almacen = crearAlmacen(10, 5);
  const resultado = agregarStockAlmacen(almacen, 'materiaPrima', 7);
  assert.deepEqual(resultado, { aceptado: 7, rechazado: 0 });
  assert.equal(almacen.stockMateriaPrima, 7);
});

test('acepta solo lo que cabe y rechaza el resto cuando excede la capacidad', () => {
  const almacen = crearAlmacen(10, 5);
  agregarStockAlmacen(almacen, 'materiaPrima', 7);
  const resultado = agregarStockAlmacen(almacen, 'materiaPrima', 5);
  assert.deepEqual(resultado, { aceptado: 3, rechazado: 2 });
  assert.equal(almacen.stockMateriaPrima, 10);
});

test('almacen ya lleno rechaza todo lo nuevo', () => {
  const almacen = crearAlmacen(10, 5);
  agregarStockAlmacen(almacen, 'materiaPrima', 10);
  const resultado = agregarStockAlmacen(almacen, 'materiaPrima', 1);
  assert.deepEqual(resultado, { aceptado: 0, rechazado: 1 });
  assert.equal(almacen.stockMateriaPrima, 10);
});

test('funciona igual para el campo producto, independiente de materiaPrima', () => {
  const almacen = crearAlmacen(10, 5);
  const resultado = agregarStockAlmacen(almacen, 'producto', 10);
  assert.deepEqual(resultado, { aceptado: 5, rechazado: 5 });
  assert.equal(almacen.stockProducto, 5);
  assert.equal(almacen.stockMateriaPrima, 0);
});

test('campo desconocido lanza RangeError', () => {
  const almacen = crearAlmacen(10, 5);
  assert.throws(() => agregarStockAlmacen(almacen, 'volador', 5), RangeError);
});

test('cantidad no positiva o no entera lanza RangeError', () => {
  const almacen = crearAlmacen(10, 5);
  assert.throws(() => agregarStockAlmacen(almacen, 'materiaPrima', 0), RangeError);
  assert.throws(() => agregarStockAlmacen(almacen, 'materiaPrima', -1), RangeError);
  assert.throws(() => agregarStockAlmacen(almacen, 'materiaPrima', 1.5), RangeError);
});

test('almacen invalido (null o no objeto) lanza RangeError', () => {
  assert.throws(() => agregarStockAlmacen(null, 'materiaPrima', 5), RangeError);
  assert.throws(() => agregarStockAlmacen('no-es-almacen', 'materiaPrima', 5), RangeError);
});
