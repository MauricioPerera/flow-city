const test = require('node:test');
const assert = require('node:assert/strict');
const { crearTramoConNivel } = require('../src/crearTramoConNivel.js');

test('nivel S deja la capacidad base sin cambios', () => {
  const tramo = crearTramoConNivel('carretera', 10, 5, 'mercaderia', 'S');
  assert.deepEqual(tramo, { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'mercaderia', nivel: 'S' });
});

test('nivel M duplica la capacidad base', () => {
  const tramo = crearTramoConNivel('carretera', 10, 5, 'mercaderia', 'M');
  assert.deepEqual(tramo, { tipoRuta: 'carretera', capacidad: 20, longitud: 5, tipoTrafico: 'mercaderia', nivel: 'M' });
});

test('nivel L triplica la capacidad base', () => {
  const tramo = crearTramoConNivel('carretera', 10, 5, 'mercaderia', 'L');
  assert.deepEqual(tramo, { tipoRuta: 'carretera', capacidad: 30, longitud: 5, tipoTrafico: 'mercaderia', nivel: 'L' });
});

test('propaga RangeError si el nivel es desconocido', () => {
  assert.throws(() => crearTramoConNivel('carretera', 10, 5, 'mercaderia', 'XL'), RangeError);
});

test('propaga RangeError si el tramo base es invalido', () => {
  assert.throws(() => crearTramoConNivel('aerea', 10, 5, 'mercaderia', 'S'), RangeError);
});
