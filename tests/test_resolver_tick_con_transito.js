const test = require('node:test');
const assert = require('node:assert/strict');
const { conectarVertices } = require('../src/conectarVertices.js');
const { resolverTickConTransito } = require('../src/resolverTickConTransito.js');

function tramo(tipoRuta, capacidad, longitud, tipoTrafico) {
  return { tipoRuta, capacidad, longitud, tipoTrafico };
}

function viaje(camino, tipoTrafico, cantidad, ticksRestantes) {
  return { camino, tipoTrafico, cantidad, ticksRestantes };
}

test('sin viajes, devuelve listas vacias', () => {
  const grafo = {};
  assert.deepEqual(resolverTickConTransito(grafo, []), { llegados: [], enTransito: [] });
});

test('un viaje con mas de 1 tick restante sigue en transito', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  const resultado = resolverTickConTransito(grafo, [viaje(['A', 'B'], 'mercaderia', 10, 2)]);
  assert.equal(resultado.llegados.length, 0);
  assert.equal(resultado.enTransito.length, 1);
  assert.equal(resultado.enTransito[0].ticksRestantes, 1);
});

test('un viaje con 1 tick restante llega y entrega toda la cantidad sin saturacion', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  const resultado = resolverTickConTransito(grafo, [viaje(['A', 'B'], 'mercaderia', 10, 1)]);
  assert.equal(resultado.enTransito.length, 0);
  assert.equal(resultado.llegados.length, 1);
  assert.equal(resultado.llegados[0].entregado, 10);
  assert.deepEqual(resultado.llegados[0].camino, ['A', 'B']);
});

test('la carga de dos viajes que llegan sobre el mismo tramo se acumula antes de resolver', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  const resultado = resolverTickConTransito(grafo, [
    viaje(['A', 'B'], 'mercaderia', 15, 1),
    viaje(['A', 'B'], 'mercaderia', 5, 1),
  ]);
  // Carga total = 20, capacidad = 10 -> fraccionPerdida 0.5.
  assert.equal(resultado.llegados.length, 2);
  assert.equal(resultado.llegados[0].entregado, 7.5);
  assert.equal(resultado.llegados[1].entregado, 2.5);
});

test('un viaje que llega y otro que sigue en transito conviven en el mismo tick', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  conectarVertices(grafo, 'C', 'D', tramo('carretera', 10, 5, 'ambos'));
  const resultado = resolverTickConTransito(grafo, [
    viaje(['A', 'B'], 'mercaderia', 5, 1),
    viaje(['C', 'D'], 'personas', 3, 3),
  ]);
  assert.equal(resultado.llegados.length, 1);
  assert.equal(resultado.llegados[0].entregado, 5);
  assert.equal(resultado.enTransito.length, 1);
  assert.equal(resultado.enTransito[0].ticksRestantes, 2);
});

test('la carga se reinicia entre llamadas sucesivas (ticks distintos)', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  resolverTickConTransito(grafo, [viaje(['A', 'B'], 'mercaderia', 15, 1)]);
  const resultado = resolverTickConTransito(grafo, [viaje(['A', 'B'], 'mercaderia', 4, 1)]);
  assert.equal(resultado.llegados[0].entregado, 4);
});

test('viajesEnTransito no es un array lanza RangeError', () => {
  const grafo = {};
  assert.throws(() => resolverTickConTransito(grafo, 'no-es-array'), RangeError);
  assert.throws(() => resolverTickConTransito(grafo, null), RangeError);
});

test('grafo invalido lanza RangeError', () => {
  assert.throws(() => resolverTickConTransito(null, []), RangeError);
});

test('un viaje malformado dentro del array lanza RangeError', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  assert.throws(
    () => resolverTickConTransito(grafo, [viaje(['A'], 'mercaderia', 10, 1)]),
    RangeError
  );
});
