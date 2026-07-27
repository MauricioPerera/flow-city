const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAlmacenPetroleo } = require('../src/crearAlmacenPetroleo.js');
const { agregarStockAlmacenPetroleo } = require('../src/agregarStockAlmacenPetroleo.js');
const { retirarStockAlmacenPetroleo } = require('../src/retirarStockAlmacenPetroleo.js');

test('retira hasta la cantidad pedida si hay stock suficiente', () => {
  const almacen = crearAlmacenPetroleo(10, 10);
  agregarStockAlmacenPetroleo(almacen, 'crudo', 5);
  const retirado = retirarStockAlmacenPetroleo(almacen, 'crudo', 3);
  assert.equal(retirado, 3);
  assert.equal(almacen.stockCrudo, 2);
});

test('retira como maximo el stock disponible, no mas', () => {
  const almacen = crearAlmacenPetroleo(10, 10);
  agregarStockAlmacenPetroleo(almacen, 'refinado', 2);
  const retirado = retirarStockAlmacenPetroleo(almacen, 'refinado', 5);
  assert.equal(retirado, 2);
  assert.equal(almacen.stockRefinado, 0);
});

test('lanza RangeError si campo no es crudo ni refinado', () => {
  const almacen = crearAlmacenPetroleo(10, 10);
  assert.throws(() => retirarStockAlmacenPetroleo(almacen, 'producto', 1), RangeError);
});
