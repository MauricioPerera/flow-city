const test = require('node:test');
const assert = require('node:assert/strict');
const {
  crearNodoProductivoMultiInsumo,
} = require('../src/crearNodoProductivoMultiInsumo.js');
const {
  producirTickNodoMultiInsumo,
} = require('../src/producirTickNodoMultiInsumo.js');

function nodoTallerTala() {
  return crearNodoProductivoMultiInsumo(
    'taller-tala',
    [
      { nombre: 'agua', ratioEntrada: 1 },
      { nombre: 'comida', ratioEntrada: 1 },
      { nombre: 'personas', ratioEntrada: 2 },
    ],
    1
  );
}

test('cuando todos los insumos alcanzan igual, produce segun las tandas completas', () => {
  const nodo = nodoTallerTala();
  assert.equal(producirTickNodoMultiInsumo(nodo, { agua: 5, comida: 5, personas: 6 }), 3);
});

test('el insumo mas escaso limita la produccion (cuello de botella)', () => {
  const nodo = nodoTallerTala();
  assert.equal(producirTickNodoMultiInsumo(nodo, { agua: 5, comida: 2, personas: 10 }), 2);
});

test('un insumo en 0 lleva la produccion a 0', () => {
  const nodo = nodoTallerTala();
  assert.equal(producirTickNodoMultiInsumo(nodo, { agua: 0, comida: 5, personas: 5 }), 0);
});

test('un insumo ausente en entradasRecibidas se trata como 0', () => {
  const nodo = nodoTallerTala();
  assert.equal(producirTickNodoMultiInsumo(nodo, { agua: 5, comida: 5 }), 0);
});

test('la produccion multiplica las tandas por ratioSalida', () => {
  const nodo = crearNodoProductivoMultiInsumo(
    'x',
    [{ nombre: 'a', ratioEntrada: 1 }, { nombre: 'b', ratioEntrada: 1 }],
    3
  );
  assert.equal(producirTickNodoMultiInsumo(nodo, { a: 4, b: 4 }), 12);
});

test('entradasRecibidas no es un objeto plano lanza RangeError', () => {
  const nodo = nodoTallerTala();
  assert.throws(() => producirTickNodoMultiInsumo(nodo, null), RangeError);
  assert.throws(() => producirTickNodoMultiInsumo(nodo, 'no-es-objeto'), RangeError);
  assert.throws(() => producirTickNodoMultiInsumo(nodo, [5, 5, 5]), RangeError);
});

test('un valor negativo o no finito en entradasRecibidas lanza RangeError', () => {
  const nodo = nodoTallerTala();
  assert.throws(() => producirTickNodoMultiInsumo(nodo, { agua: -1, comida: 5, personas: 5 }), RangeError);
  assert.throws(() => producirTickNodoMultiInsumo(nodo, { agua: NaN, comida: 5, personas: 5 }), RangeError);
});

test('nodo invalido (no objeto o receta invalida) lanza RangeError', () => {
  assert.throws(() => producirTickNodoMultiInsumo(null, { agua: 1 }), RangeError);
  assert.throws(
    () => producirTickNodoMultiInsumo({ categoria: 'x', receta: [{ nombre: 'a', ratioEntrada: 1 }], ratioSalida: 1 }, { a: 1 }),
    RangeError
  );
});
