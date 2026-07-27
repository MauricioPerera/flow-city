const test = require('node:test');
const assert = require('node:assert/strict');
const { conectarVertices } = require('../src/conectarVertices.js');
const { resolverViaje } = require('../src/resolverViaje.js');

function tramo(tipoRuta, capacidad, longitud, tipoTrafico, cargaActual) {
  const t = { tipoRuta, capacidad, longitud, tipoTrafico };
  if (cargaActual !== undefined) {
    t.cargaActual = cargaActual;
  }
  return t;
}

test('origen igual a destino entrega toda la cantidad sin perdida', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  const resultado = resolverViaje(grafo, 'A', 'A', 'mercaderia', 10);
  assert.deepEqual(resultado, { camino: ['A'], entregado: 10, factorVelocidadMinimo: 1 });
});

test('tramo sin saturacion entrega toda la cantidad', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos', 3));
  const resultado = resolverViaje(grafo, 'A', 'B', 'mercaderia', 5);
  assert.equal(resultado.entregado, 5);
  assert.equal(resultado.factorVelocidadMinimo, 1);
  assert.deepEqual(resultado.camino, ['A', 'B']);
});

test('tramo saturado al doble de su capacidad pierde proporcionalmente la mitad', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos', 20));
  const resultado = resolverViaje(grafo, 'A', 'B', 'mercaderia', 8);
  assert.equal(resultado.entregado, 4);
  assert.equal(resultado.factorVelocidadMinimo, 0.5);
});

test('perdidas de varios tramos se componen a lo largo del camino', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos', 5));
  conectarVertices(grafo, 'B', 'C', tramo('carretera', 10, 5, 'ambos', 20));
  const resultado = resolverViaje(grafo, 'A', 'C', 'mercaderia', 8);
  assert.deepEqual(resultado.camino, ['A', 'B', 'C']);
  assert.equal(resultado.entregado, 4);
  assert.equal(resultado.factorVelocidadMinimo, 0.5);
});

test('tramo sin cargaActual previa (undefined) se trata como sin saturacion', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  const resultado = resolverViaje(grafo, 'A', 'B', 'mercaderia', 6);
  assert.equal(resultado.entregado, 6);
  assert.equal(resultado.factorVelocidadMinimo, 1);
});

test('destino inalcanzable devuelve entregado 0 y camino null', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  conectarVertices(grafo, 'E', 'F', tramo('carretera', 10, 5, 'ambos'));
  const resultado = resolverViaje(grafo, 'A', 'E', 'mercaderia', 5);
  assert.deepEqual(resultado, { camino: null, entregado: 0, factorVelocidadMinimo: null });
});

test('cantidad no positiva o no entera lanza RangeError', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  assert.throws(() => resolverViaje(grafo, 'A', 'B', 'mercaderia', 0), RangeError);
  assert.throws(() => resolverViaje(grafo, 'A', 'B', 'mercaderia', -1), RangeError);
  assert.throws(() => resolverViaje(grafo, 'A', 'B', 'mercaderia', 1.5), RangeError);
});

test('tipoTrafico o vertices invalidos lanzan RangeError (delegado de encontrarRuta)', () => {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  assert.throws(() => resolverViaje(grafo, 'A', 'B', 'ambos', 5), RangeError);
  assert.throws(() => resolverViaje(grafo, 'Z', 'B', 'mercaderia', 5), RangeError);
});
