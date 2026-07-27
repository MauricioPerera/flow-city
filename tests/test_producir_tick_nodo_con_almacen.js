const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAlmacen } = require('../src/crearAlmacen.js');
const { producirTickNodoConAlmacen } = require('../src/producirTickNodoConAlmacen.js');

function nodoExtraccion(produccionFija) {
  return { categoria: 'extraccion-agua', ratioEntrada: null, ratioSalida: null, produccionFija };
}

function nodoReceta(ratioEntrada, ratioSalida) {
  return { categoria: 'agricultura', ratioEntrada, ratioSalida, produccionFija: null };
}

test('produce completo cuando entra en el espacio disponible del almacen', () => {
  const almacen = crearAlmacen(10, 10);
  const resultado = producirTickNodoConAlmacen(nodoExtraccion(4), almacen, 0);
  assert.deepEqual(resultado, { producido: 4, almacenLleno: false });
  assert.equal(almacen.stockProducto, 4);
});

test('frena la produccion completa cuando no entra en el espacio disponible', () => {
  const almacen = crearAlmacen(10, 15);
  const resultado = producirTickNodoConAlmacen(nodoReceta(1, 2), almacen, 10);
  // produccion potencial = 20, espacio disponible = 15 -> no cabe.
  assert.deepEqual(resultado, { producido: 0, almacenLleno: true });
  assert.equal(almacen.stockProducto, 0);
});

test('produce completo cuando cabe exacto en el espacio disponible', () => {
  const almacen = crearAlmacen(10, 20);
  const resultado = producirTickNodoConAlmacen(nodoReceta(1, 2), almacen, 10);
  assert.deepEqual(resultado, { producido: 20, almacenLleno: false });
  assert.equal(almacen.stockProducto, 20);
});

test('entradaRecibida 0 en nodo de receta produce 0 sin marcar el almacen como lleno', () => {
  const almacen = crearAlmacen(10, 10);
  const resultado = producirTickNodoConAlmacen(nodoReceta(1, 2), almacen, 0);
  assert.deepEqual(resultado, { producido: 0, almacenLleno: false });
  assert.equal(almacen.stockProducto, 0);
});

test('el stock previo del almacen reduce el espacio disponible', () => {
  const almacen = crearAlmacen(10, 10);
  almacen.stockProducto = 8;
  const resultado = producirTickNodoConAlmacen(nodoExtraccion(4), almacen, 0);
  assert.deepEqual(resultado, { producido: 0, almacenLleno: true });
  assert.equal(almacen.stockProducto, 8);
});

test('almacen invalido (null o no objeto) lanza RangeError', () => {
  assert.throws(() => producirTickNodoConAlmacen(nodoExtraccion(4), null, 0), RangeError);
  assert.throws(() => producirTickNodoConAlmacen(nodoExtraccion(4), 'no-es-almacen', 0), RangeError);
});

test('nodo invalido lanza RangeError (delegado de producirTickNodo)', () => {
  const almacen = crearAlmacen(10, 10);
  const nodoInvalido = { categoria: 'x', ratioEntrada: 1, ratioSalida: null, produccionFija: null };
  assert.throws(() => producirTickNodoConAlmacen(nodoInvalido, almacen, 0), RangeError);
});

test('entradaRecibida invalida lanza RangeError (delegado de producirTickNodo)', () => {
  const almacen = crearAlmacen(10, 10);
  assert.throws(() => producirTickNodoConAlmacen(nodoReceta(1, 2), almacen, -1), RangeError);
  assert.throws(() => producirTickNodoConAlmacen(nodoReceta(1, 2), almacen, NaN), RangeError);
});
