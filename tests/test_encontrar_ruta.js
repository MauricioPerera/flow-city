const test = require('node:test');
const assert = require('node:assert/strict');
const { conectarVertices } = require('../src/conectarVertices.js');
const { encontrarRuta } = require('../src/encontrarRuta.js');

function tramo(tipoRuta, capacidad, longitud, tipoTrafico) {
  return { tipoRuta, capacidad, longitud, tipoTrafico };
}

function construirGrafoDePrueba() {
  const grafo = {};
  conectarVertices(grafo, 'A', 'B', tramo('carretera', 10, 5, 'ambos'));
  conectarVertices(grafo, 'B', 'C', tramo('carretera', 10, 3, 'ambos'));
  conectarVertices(grafo, 'A', 'C', tramo('carretera', 10, 100, 'ambos'));
  conectarVertices(grafo, 'A', 'D', tramo('ferrocarril', 20, 2, 'mercaderia'));
  conectarVertices(grafo, 'E', 'F', tramo('carretera', 10, 1, 'ambos'));
  return grafo;
}

test('encuentra el camino mas corto por distancia total, no por menos saltos', () => {
  const grafo = construirGrafoDePrueba();
  const resultado = encontrarRuta(grafo, 'A', 'C', 'mercaderia');
  assert.deepEqual(resultado.camino, ['A', 'B', 'C']);
  assert.equal(resultado.distanciaTotal, 8);
});

test('origen igual a destino devuelve camino trivial de distancia 0', () => {
  const grafo = construirGrafoDePrueba();
  const resultado = encontrarRuta(grafo, 'A', 'A', 'mercaderia');
  assert.deepEqual(resultado, { camino: ['A'], distanciaTotal: 0 });
});

test('vertice existente pero inalcanzable devuelve null', () => {
  const grafo = construirGrafoDePrueba();
  assert.equal(encontrarRuta(grafo, 'A', 'E', 'mercaderia'), null);
});

test('filtra tramos que no admiten el tipo de trafico pedido', () => {
  const grafo = construirGrafoDePrueba();
  // A-D es ferrocarril (solo mercaderia): para 'personas' no hay camino directo.
  assert.equal(encontrarRuta(grafo, 'A', 'D', 'personas'), null);
  // Para 'mercaderia' si existe.
  const resultado = encontrarRuta(grafo, 'A', 'D', 'mercaderia');
  assert.deepEqual(resultado.camino, ['A', 'D']);
  assert.equal(resultado.distanciaTotal, 2);
});

test('origen o destino inexistentes en el grafo lanzan RangeError', () => {
  const grafo = construirGrafoDePrueba();
  assert.throws(() => encontrarRuta(grafo, 'Z', 'A', 'mercaderia'), RangeError);
  assert.throws(() => encontrarRuta(grafo, 'A', 'Z', 'mercaderia'), RangeError);
});

test('tipoTrafico invalido (incluido ambos) lanza RangeError', () => {
  const grafo = construirGrafoDePrueba();
  assert.throws(() => encontrarRuta(grafo, 'A', 'B', 'ambos'), RangeError);
  assert.throws(() => encontrarRuta(grafo, 'A', 'B', 'volador'), RangeError);
});

test('grafo invalido (null o no objeto) lanza RangeError', () => {
  assert.throws(() => encontrarRuta(null, 'A', 'B', 'mercaderia'), RangeError);
  assert.throws(() => encontrarRuta('no-es-un-grafo', 'A', 'B', 'mercaderia'), RangeError);
});
