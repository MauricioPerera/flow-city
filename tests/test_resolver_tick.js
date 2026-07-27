const test = require('node:test');
const assert = require('node:assert/strict');
const { conectarVertices } = require('../src/conectarVertices.js');
const { resolverTick } = require('../src/resolverTick.js');

function tramo(tipoRuta, capacidad, longitud, tipoTrafico) {
  return { tipoRuta, capacidad, longitud, tipoTrafico };
}

test('viajes sin tramos compartidos se resuelven cada uno sin saturacion', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  conectarVertices(grafo, 'C', 'D', tramo('carretera', 10, 5, 'ambos'));
  const resultados = resolverTick(grafo, [
    { origen: 'A', destino: 'B', tipoTrafico: 'mercaderia', cantidad: 4 },
    { origen: 'C', destino: 'D', tipoTrafico: 'mercaderia', cantidad: 6 },
  ]);
  assert.equal(resultados[0].entregado, 4);
  assert.equal(resultados[1].entregado, 6);
  assert.equal(resultados[0].factorVelocidadMinimo, 1);
  assert.equal(resultados[1].factorVelocidadMinimo, 1);
});

test('la carga de dos viajes sobre el mismo tramo se acumula ANTES de aplicar saturacion', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  const resultados = resolverTick(grafo, [
    { origen: 'A', destino: 'B', tipoTrafico: 'mercaderia', cantidad: 15 },
    { origen: 'A', destino: 'B', tipoTrafico: 'mercaderia', cantidad: 5 },
  ]);
  // Carga total = 20, capacidad = 10 -> factorVelocidad 0.5, fraccionPerdida 0.5.
  assert.equal(resultados[0].entregado, 7.5);
  assert.equal(resultados[1].entregado, 2.5);
  assert.equal(resultados[0].factorVelocidadMinimo, 0.5);
  assert.equal(resultados[1].factorVelocidadMinimo, 0.5);
});

test('un viaje sin ruta no afecta la acumulacion de los demas', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  conectarVertices(grafo, 'E', 'F', tramo('carretera', 10, 5, 'ambos'));
  const resultados = resolverTick(grafo, [
    { origen: 'A', destino: 'E', tipoTrafico: 'mercaderia', cantidad: 5 },
    { origen: 'A', destino: 'B', tipoTrafico: 'mercaderia', cantidad: 4 },
  ]);
  assert.deepEqual(resultados[0], { camino: null, entregado: 0, factorVelocidadMinimo: null });
  assert.equal(resultados[1].entregado, 4);
  assert.equal(resultados[1].factorVelocidadMinimo, 1);
});

test('lista de viajes vacia devuelve lista de resultados vacia', () => {
  const grafo = {};
  assert.deepEqual(resolverTick(grafo, []), []);
});

test('las cargas se reinician entre llamadas sucesivas (ticks distintos)', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  resolverTick(grafo, [{ origen: 'A', destino: 'B', tipoTrafico: 'mercaderia', cantidad: 15 }]);
  const resultados = resolverTick(grafo, [
    { origen: 'A', destino: 'B', tipoTrafico: 'mercaderia', cantidad: 4 },
  ]);
  // Si la carga del tick anterior no se reiniciara, esto arrastraria saturacion falsa.
  assert.equal(resultados[0].entregado, 4);
  assert.equal(resultados[0].factorVelocidadMinimo, 1);
});

test('viajes no es un array lanza RangeError', () => {
  const grafo = {};
  assert.throws(() => resolverTick(grafo, 'no-es-array'), RangeError);
  assert.throws(() => resolverTick(grafo, null), RangeError);
});

test('un viaje malformado (no objeto) lanza RangeError', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  assert.throws(() => resolverTick(grafo, [null]), RangeError);
  assert.throws(() => resolverTick(grafo, ['no-es-viaje']), RangeError);
});
