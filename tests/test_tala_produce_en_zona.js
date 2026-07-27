const test = require('node:test');
const assert = require('node:assert/strict');
const { crearEstadoArboles } = require('../src/crearEstadoArboles.js');
const { talarArbol } = require('../src/talarArbol.js');
const { talaProduceEnZona } = require('../src/talaProduceEnZona.js');

test('devuelve true si al menos una celda de la zona esta en estado arbol (por defecto)', () => {
  const estadoArboles = crearEstadoArboles();
  assert.equal(talaProduceEnZona(estadoArboles, [{ x: 0, y: 0 }, { x: 1, y: 0 }]), true);
});

test('devuelve false si ninguna celda de la zona esta en estado arbol', () => {
  const estadoArboles = crearEstadoArboles();
  talarArbol(estadoArboles, 0, 0);
  talarArbol(estadoArboles, 1, 0);
  assert.equal(talaProduceEnZona(estadoArboles, [{ x: 0, y: 0 }, { x: 1, y: 0 }]), false);
});

test('devuelve false si la zona esta vacia', () => {
  const estadoArboles = crearEstadoArboles();
  assert.equal(talaProduceEnZona(estadoArboles, []), false);
});
