const test = require('node:test');
const assert = require('node:assert/strict');
const { crearEstadoArboles } = require('../src/crearEstadoArboles.js');

test('crea un Map vacio', () => {
  const estadoArboles = crearEstadoArboles();
  assert.ok(estadoArboles instanceof Map);
  assert.equal(estadoArboles.size, 0);
});

test('cada llamada devuelve un Map nuevo e independiente', () => {
  const a = crearEstadoArboles();
  const b = crearEstadoArboles();
  a.set('0,0', { estado: 'tocon', ticksEnEstado: 0 });
  assert.equal(b.size, 0);
});
