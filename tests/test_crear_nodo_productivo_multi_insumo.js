const test = require('node:test');
const assert = require('node:assert/strict');
const {
  crearNodoProductivoMultiInsumo,
} = require('../src/crearNodoProductivoMultiInsumo.js');

test('crea un nodo con receta de 2 insumos', () => {
  const receta = [
    { nombre: 'agua', ratioEntrada: 1 },
    { nombre: 'comida', ratioEntrada: 1 },
  ];
  assert.deepEqual(crearNodoProductivoMultiInsumo('taller-tala', receta, 1), {
    categoria: 'taller-tala',
    receta,
    ratioSalida: 1,
  });
});

test('crea un nodo con receta de 3 insumos y ratios distintos', () => {
  const receta = [
    { nombre: 'agua', ratioEntrada: 1 },
    { nombre: 'comida', ratioEntrada: 1 },
    { nombre: 'personas', ratioEntrada: 2 },
  ];
  const nodo = crearNodoProductivoMultiInsumo('taller-tala', receta, 1);
  assert.equal(nodo.receta.length, 3);
  assert.equal(nodo.receta[2].ratioEntrada, 2);
});

test('categoria vacia o no string lanza RangeError', () => {
  const receta = [{ nombre: 'agua', ratioEntrada: 1 }, { nombre: 'comida', ratioEntrada: 1 }];
  assert.throws(() => crearNodoProductivoMultiInsumo('', receta, 1), RangeError);
  assert.throws(() => crearNodoProductivoMultiInsumo(null, receta, 1), RangeError);
});

test('receta con menos de 2 insumos lanza RangeError', () => {
  assert.throws(
    () => crearNodoProductivoMultiInsumo('x', [{ nombre: 'agua', ratioEntrada: 1 }], 1),
    RangeError
  );
  assert.throws(() => crearNodoProductivoMultiInsumo('x', [], 1), RangeError);
});

test('receta no array lanza RangeError', () => {
  assert.throws(() => crearNodoProductivoMultiInsumo('x', 'no-es-array', 1), RangeError);
});

test('un insumo con nombre vacio o ratioEntrada invalido lanza RangeError', () => {
  assert.throws(
    () =>
      crearNodoProductivoMultiInsumo(
        'x',
        [{ nombre: '', ratioEntrada: 1 }, { nombre: 'comida', ratioEntrada: 1 }],
        1
      ),
    RangeError
  );
  assert.throws(
    () =>
      crearNodoProductivoMultiInsumo(
        'x',
        [{ nombre: 'agua', ratioEntrada: 0 }, { nombre: 'comida', ratioEntrada: 1 }],
        1
      ),
    RangeError
  );
});

test('nombres de insumo duplicados lanza RangeError', () => {
  assert.throws(
    () =>
      crearNodoProductivoMultiInsumo(
        'x',
        [{ nombre: 'agua', ratioEntrada: 1 }, { nombre: 'agua', ratioEntrada: 2 }],
        1
      ),
    RangeError
  );
});

test('ratioSalida no positivo o no entero lanza RangeError', () => {
  const receta = [{ nombre: 'agua', ratioEntrada: 1 }, { nombre: 'comida', ratioEntrada: 1 }];
  assert.throws(() => crearNodoProductivoMultiInsumo('x', receta, 0), RangeError);
  assert.throws(() => crearNodoProductivoMultiInsumo('x', receta, -1), RangeError);
  assert.throws(() => crearNodoProductivoMultiInsumo('x', receta, 1.5), RangeError);
});
