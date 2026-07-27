const test = require('node:test');
const assert = require('node:assert/strict');
const { avanzarViajeTick } = require('../src/avanzarViajeTick.js');

function tramo(cargaActual, capacidad) {
  const t = { tipoRuta: 'carretera', capacidad, longitud: 5, tipoTrafico: 'ambos' };
  if (cargaActual !== undefined) {
    t.cargaActual = cargaActual;
  }
  return t;
}

test('con mas de 1 tick restante, sigue en transito y decrementa el contador', () => {
  const viaje = { camino: ['A', 'B', 'C'], tipoTrafico: 'mercaderia', cantidad: 10, ticksRestantes: 2 };
  const grafo = { A: { B: tramo(0, 10) }, B: { A: tramo(0, 10), C: tramo(0, 10) }, C: { B: tramo(0, 10) } };
  const resultado = avanzarViajeTick(viaje, grafo);
  assert.equal(resultado.llego, false);
  assert.equal(resultado.entregado, null);
  assert.deepEqual(resultado.estado, {
    camino: ['A', 'B', 'C'],
    tipoTrafico: 'mercaderia',
    cantidad: 10,
    ticksRestantes: 1,
  });
});

test('con 1 tick restante, llega y entrega toda la cantidad si no hay saturacion', () => {
  const viaje = { camino: ['A', 'B'], tipoTrafico: 'mercaderia', cantidad: 10, ticksRestantes: 1 };
  const grafo = { A: { B: tramo(0, 10) }, B: { A: tramo(0, 10) } };
  const resultado = avanzarViajeTick(viaje, grafo);
  assert.equal(resultado.llego, true);
  assert.equal(resultado.entregado, 10);
  assert.equal(resultado.estado, null);
});

test('al llegar, aplica la perdida proporcional de saturacion del tramo', () => {
  const viaje = { camino: ['A', 'B'], tipoTrafico: 'mercaderia', cantidad: 8, ticksRestantes: 1 };
  const grafo = { A: { B: tramo(20, 10) }, B: { A: tramo(20, 10) } };
  const resultado = avanzarViajeTick(viaje, grafo);
  assert.equal(resultado.llego, true);
  assert.equal(resultado.entregado, 4);
});

test('las perdidas de varios tramos se componen al llegar', () => {
  const viaje = { camino: ['A', 'B', 'C'], tipoTrafico: 'mercaderia', cantidad: 8, ticksRestantes: 1 };
  const grafo = {
    A: { B: tramo(0, 10) },
    B: { A: tramo(0, 10), C: tramo(20, 10) },
    C: { B: tramo(20, 10) },
  };
  const resultado = avanzarViajeTick(viaje, grafo);
  assert.equal(resultado.llego, true);
  assert.equal(resultado.entregado, 4);
});

test('viajeEnTransito invalido lanza RangeError', () => {
  const grafo = { A: { B: tramo(0, 10) }, B: { A: tramo(0, 10) } };
  assert.throws(() => avanzarViajeTick(null, grafo), RangeError);
  assert.throws(
    () => avanzarViajeTick({ camino: ['A'], tipoTrafico: 'mercaderia', cantidad: 1, ticksRestantes: 1 }, grafo),
    RangeError
  );
  assert.throws(
    () => avanzarViajeTick({ camino: ['A', 'B'], tipoTrafico: 'ambos', cantidad: 1, ticksRestantes: 1 }, grafo),
    RangeError
  );
});

test('grafo invalido lanza RangeError', () => {
  const viaje = { camino: ['A', 'B'], tipoTrafico: 'mercaderia', cantidad: 10, ticksRestantes: 1 };
  assert.throws(() => avanzarViajeTick(viaje, null), RangeError);
});

test('un tramo del camino ausente en el grafo lanza RangeError', () => {
  const viaje = { camino: ['A', 'B'], tipoTrafico: 'mercaderia', cantidad: 10, ticksRestantes: 1 };
  const grafo = { A: {}, B: {} };
  assert.throws(() => avanzarViajeTick(viaje, grafo), RangeError);
});
