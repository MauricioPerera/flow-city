const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ejecutarCadenaBombaGranjaComercio,
} = require('../src/ejecutarCadenaBombaGranjaComercio.js');

test('simula 3 ticks: la granja nunca se bloquea porque el comercio drena todo cada tick', () => {
  const resultado = ejecutarCadenaBombaGranjaComercio(3);
  assert.equal(resultado.historial.length, 3);

  for (let i = 0; i < 3; i += 1) {
    assert.deepEqual(resultado.historial[i], {
      tick: i,
      aguaProducida: 4,
      aguaEnviada: 4,
      aguaRecibida: 4,
      manzanasProducidas: 8,
      manzanasCompradas: 8,
      montoVenta: 16,
      granjaAlmacenLleno: false,
    });
  }
});

test('el almacen de la granja queda vacio cada tick (el comercio compra todo)', () => {
  const resultado = ejecutarCadenaBombaGranjaComercio(3);
  assert.equal(resultado.almacenGranjaFinal.stockProducto, 0);
});

test('el almacen de la bomba tambien queda vacio (sin cambios respecto al Contrato 11)', () => {
  const resultado = ejecutarCadenaBombaGranjaComercio(3);
  assert.equal(resultado.almacenBombaFinal.stockProducto, 0);
});

test('la tesoreria acumula el ingreso de cada venta', () => {
  const resultado = ejecutarCadenaBombaGranjaComercio(3);
  assert.equal(resultado.tesoreriaFinal.saldo, 48);
});

test('con 1 tick, la tesoreria refleja una sola venta', () => {
  const resultado = ejecutarCadenaBombaGranjaComercio(1);
  assert.equal(resultado.tesoreriaFinal.saldo, 16);
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarCadenaBombaGranjaComercio(2),
    ejecutarCadenaBombaGranjaComercio(2)
  );
});

test('numTicks no positivo o no entero lanza RangeError', () => {
  assert.throws(() => ejecutarCadenaBombaGranjaComercio(0), RangeError);
  assert.throws(() => ejecutarCadenaBombaGranjaComercio(-1), RangeError);
  assert.throws(() => ejecutarCadenaBombaGranjaComercio(1.5), RangeError);
});
