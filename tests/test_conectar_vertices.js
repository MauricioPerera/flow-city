const test = require('node:test');
const assert = require('node:assert/strict');
const { conectarVertices } = require('../src/conectarVertices.js');

test('conecta dos vertices en ambos sentidos con el mismo tramo', () => {
  const grafo = {};
  const tramo = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  conectarVertices(grafo, 'A', 'B', tramo);
  assert.equal(grafo.A.B, tramo);
  assert.equal(grafo.B.A, tramo);
});

test('devuelve el grafo actualizado', () => {
  const grafo = {};
  const tramo = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  const resultado = conectarVertices(grafo, 'A', 'B', tramo);
  assert.equal(resultado, grafo);
});

test('permite multiples conexiones distintas desde el mismo vertice', () => {
  const grafo = {};
  const tramoAB = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  const tramoAC = { tipoRuta: 'ferrocarril', capacidad: 20, longitud: 8, tipoTrafico: 'mercaderia' };
  conectarVertices(grafo, 'A', 'B', tramoAB);
  conectarVertices(grafo, 'A', 'C', tramoAC);
  assert.equal(grafo.A.B, tramoAB);
  assert.equal(grafo.A.C, tramoAC);
  assert.equal(grafo.C.A, tramoAC);
});

test('conectar dos veces la misma pareja lanza error de negocio (no RangeError)', () => {
  const grafo = {};
  const tramo1 = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  const tramo2 = { tipoRuta: 'subte', capacidad: 15, longitud: 3, tipoTrafico: 'personas' };
  conectarVertices(grafo, 'A', 'B', tramo1);
  assert.throws(
    () => conectarVertices(grafo, 'A', 'B', tramo2),
    (err) => err instanceof Error && !(err instanceof RangeError) && err.message.includes('ya')
  );
});

test('conectar la misma pareja en orden inverso tambien lanza error de negocio', () => {
  const grafo = {};
  const tramo1 = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  const tramo2 = { tipoRuta: 'subte', capacidad: 15, longitud: 3, tipoTrafico: 'personas' };
  conectarVertices(grafo, 'A', 'B', tramo1);
  assert.throws(
    () => conectarVertices(grafo, 'B', 'A', tramo2),
    (err) => err instanceof Error && !(err instanceof RangeError)
  );
});

test('conectar un vertice consigo mismo lanza RangeError', () => {
  const grafo = {};
  const tramo = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  assert.throws(() => conectarVertices(grafo, 'A', 'A', tramo), RangeError);
});

test('vertice no string o vacio lanza RangeError', () => {
  const grafo = {};
  const tramo = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  assert.throws(() => conectarVertices(grafo, '', 'B', tramo), RangeError);
  assert.throws(() => conectarVertices(grafo, 'A', '', tramo), RangeError);
  assert.throws(() => conectarVertices(grafo, 5, 'B', tramo), RangeError);
});

test('tramo invalido (null, undefined o no objeto) lanza RangeError', () => {
  const grafo = {};
  assert.throws(() => conectarVertices(grafo, 'A', 'B', null), RangeError);
  assert.throws(() => conectarVertices(grafo, 'A', 'B', undefined), RangeError);
  assert.throws(() => conectarVertices(grafo, 'A', 'B', 'no-es-un-tramo'), RangeError);
});

test('grafo invalido (null o no objeto) lanza RangeError', () => {
  const tramo = { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
  assert.throws(() => conectarVertices(null, 'A', 'B', tramo), RangeError);
  assert.throws(() => conectarVertices('no-es-un-grafo', 'A', 'B', tramo), RangeError);
});
