const test = require('node:test');
const assert = require('node:assert/strict');
const { crearEstadoArboles } = require('../src/crearEstadoArboles.js');
const { talarArbol } = require('../src/talarArbol.js');
const { avanzarCicloArbolTick } = require('../src/avanzarCicloArbolTick.js');

test('una celda en estado arbol (por defecto, sin entrada) se mantiene arbol indefinidamente', () => {
  const estadoArboles = crearEstadoArboles();
  assert.equal(avanzarCicloArbolTick(estadoArboles, 0, 0), 'arbol');
  assert.equal(avanzarCicloArbolTick(estadoArboles, 0, 0), 'arbol');
});

test('el ciclo completo: tocon -> (2 ticks) -> limpio -> (3 ticks) -> arbol', () => {
  const estadoArboles = crearEstadoArboles();
  talarArbol(estadoArboles, 5, 5);

  assert.equal(avanzarCicloArbolTick(estadoArboles, 5, 5), 'tocon');
  assert.deepEqual(estadoArboles.get('5,5'), { estado: 'tocon', ticksEnEstado: 1 });

  assert.equal(avanzarCicloArbolTick(estadoArboles, 5, 5), 'limpio');
  assert.deepEqual(estadoArboles.get('5,5'), { estado: 'limpio', ticksEnEstado: 0 });

  assert.equal(avanzarCicloArbolTick(estadoArboles, 5, 5), 'limpio');
  assert.equal(avanzarCicloArbolTick(estadoArboles, 5, 5), 'limpio');
  assert.deepEqual(estadoArboles.get('5,5'), { estado: 'limpio', ticksEnEstado: 2 });

  assert.equal(avanzarCicloArbolTick(estadoArboles, 5, 5), 'arbol');
  assert.deepEqual(estadoArboles.get('5,5'), { estado: 'arbol', ticksEnEstado: 0 });

  assert.equal(avanzarCicloArbolTick(estadoArboles, 5, 5), 'arbol');
});
