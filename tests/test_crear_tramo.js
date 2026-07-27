const test = require('node:test');
const assert = require('node:assert/strict');
const { crearTramo } = require('../src/crearTramo.js');

test('carretera sin tipoTrafico usa default ambos', () => {
  const tramo = crearTramo('carretera', 10, 5);
  assert.deepEqual(tramo, {
    tipoRuta: 'carretera',
    capacidad: 10,
    longitud: 5,
    tipoTrafico: 'ambos',
  });
});

test('carretera admite mercaderia, personas o ambos explicito', () => {
  assert.equal(crearTramo('carretera', 10, 5, 'mercaderia').tipoTrafico, 'mercaderia');
  assert.equal(crearTramo('carretera', 10, 5, 'personas').tipoTrafico, 'personas');
  assert.equal(crearTramo('carretera', 10, 5, 'ambos').tipoTrafico, 'ambos');
});

test('maritima se comporta igual que carretera (configurable, default ambos)', () => {
  assert.equal(crearTramo('maritima', 8, 12).tipoTrafico, 'ambos');
  assert.equal(crearTramo('maritima', 8, 12, 'personas').tipoTrafico, 'personas');
});

test('ferrocarril sin tipoTrafico se autocompleta a mercaderia', () => {
  const tramo = crearTramo('ferrocarril', 20, 7);
  assert.equal(tramo.tipoTrafico, 'mercaderia');
});

test('ferrocarril con tipoTrafico mercaderia explicito es valido', () => {
  assert.equal(crearTramo('ferrocarril', 20, 7, 'mercaderia').tipoTrafico, 'mercaderia');
});

test('ferrocarril con tipoTrafico distinto de mercaderia lanza RangeError', () => {
  assert.throws(() => crearTramo('ferrocarril', 20, 7, 'personas'), RangeError);
  assert.throws(() => crearTramo('ferrocarril', 20, 7, 'ambos'), RangeError);
});

test('subte sin tipoTrafico se autocompleta a personas', () => {
  const tramo = crearTramo('subte', 15, 3);
  assert.equal(tramo.tipoTrafico, 'personas');
});

test('subte con tipoTrafico distinto de personas lanza RangeError', () => {
  assert.throws(() => crearTramo('subte', 15, 3, 'mercaderia'), RangeError);
  assert.throws(() => crearTramo('subte', 15, 3, 'ambos'), RangeError);
});

test('tipo de ruta desconocido lanza RangeError', () => {
  assert.throws(() => crearTramo('teleferico', 10, 5), RangeError);
});

test('capacidad no positiva lanza RangeError', () => {
  assert.throws(() => crearTramo('carretera', 0, 5), RangeError);
  assert.throws(() => crearTramo('carretera', -1, 5), RangeError);
});

test('longitud no positiva lanza RangeError', () => {
  assert.throws(() => crearTramo('carretera', 10, 0), RangeError);
  assert.throws(() => crearTramo('carretera', 10, -1), RangeError);
});

test('tipoTrafico explicito con valor desconocido lanza RangeError', () => {
  assert.throws(() => crearTramo('carretera', 10, 5, 'volador'), RangeError);
});
