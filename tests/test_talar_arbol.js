const test = require('node:test');
const assert = require('node:assert/strict');
const { crearEstadoArboles } = require('../src/crearEstadoArboles.js');
const { talarArbol } = require('../src/talarArbol.js');

test('tala una celda sin entrada previa (arbol por defecto), queda en tocon con 0 ticks', () => {
  const estadoArboles = crearEstadoArboles();
  talarArbol(estadoArboles, 0, 0);
  assert.deepEqual(estadoArboles.get('0,0'), { estado: 'tocon', ticksEnEstado: 0 });
});

test('lanza Error si se intenta talar una celda que no esta en estado arbol', () => {
  const estadoArboles = crearEstadoArboles();
  talarArbol(estadoArboles, 1, 1);
  assert.throws(() => talarArbol(estadoArboles, 1, 1), Error);
});

test('lanza Error si se intenta talar una celda en estado limpio', () => {
  const estadoArboles = crearEstadoArboles();
  estadoArboles.set('2,2', { estado: 'limpio', ticksEnEstado: 0 });
  assert.throws(() => talarArbol(estadoArboles, 2, 2), Error);
});
