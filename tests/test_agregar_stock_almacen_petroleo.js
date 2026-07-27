const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAlmacenPetroleo } = require('../src/crearAlmacenPetroleo.js');
const { agregarStockAlmacenPetroleo } = require('../src/agregarStockAlmacenPetroleo.js');

test('agrega stock de crudo dentro de la capacidad, todo aceptado', () => {
  const almacen = crearAlmacenPetroleo(10, 10);
  const resultado = agregarStockAlmacenPetroleo(almacen, 'crudo', 4);
  assert.deepEqual(resultado, { aceptado: 4, rechazado: 0 });
  assert.equal(almacen.stockCrudo, 4);
});

test('agrega stock de refinado, clamp al espacio libre restante', () => {
  const almacen = crearAlmacenPetroleo(10, 5);
  agregarStockAlmacenPetroleo(almacen, 'refinado', 3);
  const resultado = agregarStockAlmacenPetroleo(almacen, 'refinado', 4);
  assert.deepEqual(resultado, { aceptado: 2, rechazado: 2 });
  assert.equal(almacen.stockRefinado, 5);
});

test('lanza RangeError si campo no es crudo ni refinado', () => {
  const almacen = crearAlmacenPetroleo(10, 10);
  assert.throws(() => agregarStockAlmacenPetroleo(almacen, 'producto', 1), RangeError);
});

test('lanza RangeError si cantidad no es un entero positivo', () => {
  const almacen = crearAlmacenPetroleo(10, 10);
  assert.throws(() => agregarStockAlmacenPetroleo(almacen, 'crudo', 0), RangeError);
});
