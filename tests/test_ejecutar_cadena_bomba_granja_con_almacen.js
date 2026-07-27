const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ejecutarCadenaBombaGranjaConAlmacen,
} = require('../src/ejecutarCadenaBombaGranjaConAlmacen.js');

test('simula 3 ticks: flujo normal en los primeros 2, la granja se queda sin espacio en el tercero', () => {
  const resultado = ejecutarCadenaBombaGranjaConAlmacen(3);
  assert.equal(resultado.historial.length, 3);

  assert.deepEqual(resultado.historial[0], {
    tick: 0,
    aguaProducida: 4,
    aguaEnviada: 4,
    aguaRecibida: 4,
    manzanasProducidas: 8,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  });

  assert.deepEqual(resultado.historial[1], {
    tick: 1,
    aguaProducida: 4,
    aguaEnviada: 4,
    aguaRecibida: 4,
    manzanasProducidas: 8,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  });

  assert.deepEqual(resultado.historial[2], {
    tick: 2,
    aguaProducida: 4,
    aguaEnviada: 4,
    aguaRecibida: 4,
    manzanasProducidas: 0,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: true,
  });
});

test('el almacen de la bomba queda vacio cada tick (se retira todo lo producido)', () => {
  const resultado = ejecutarCadenaBombaGranjaConAlmacen(3);
  assert.equal(resultado.almacenBombaFinal.stockProducto, 0);
});

test('el almacen de la granja acumula lo producido y se detiene en 16 (bloqueado en el tercer tick)', () => {
  const resultado = ejecutarCadenaBombaGranjaConAlmacen(3);
  assert.equal(resultado.almacenGranjaFinal.stockProducto, 16);
});

test('con 1 solo tick no hay bloqueo todavia', () => {
  const resultado = ejecutarCadenaBombaGranjaConAlmacen(1);
  assert.equal(resultado.historial[0].manzanasProducidas, 8);
  assert.equal(resultado.historial[0].granjaAlmacenLleno, false);
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarCadenaBombaGranjaConAlmacen(2),
    ejecutarCadenaBombaGranjaConAlmacen(2)
  );
});

test('numTicks no positivo o no entero lanza RangeError', () => {
  assert.throws(() => ejecutarCadenaBombaGranjaConAlmacen(0), RangeError);
  assert.throws(() => ejecutarCadenaBombaGranjaConAlmacen(-1), RangeError);
  assert.throws(() => ejecutarCadenaBombaGranjaConAlmacen(1.5), RangeError);
});
