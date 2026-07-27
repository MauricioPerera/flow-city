const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarComercioCompradorViajaAlBien } = require('../src/ejecutarComercioCompradorViajaAlBien.js');

test('el aforo del restaurante limita la venta, no la demanda ni el stock', () => {
  const resultado = ejecutarComercioCompradorViajaAlBien();
  assert.deepEqual(resultado, {
    personasQueViajan: 10,
    personasQueLlegan: 10,
    aforoMaximo: 6,
    ocupacionActual: 0,
    aforoDisp: 6,
    stockDisponible: 8,
    ventaResuelta: 6,
    precioUnitario: 3,
    montoVenta: 18,
    tesoreriaFinal: { saldo: 18 },
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarComercioCompradorViajaAlBien(),
    ejecutarComercioCompradorViajaAlBien()
  );
});
