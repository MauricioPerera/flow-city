const test = require('node:test');
const assert = require('node:assert/strict');
const { registrarCargaTramo } = require('../src/registrarCargaTramo.js');

function tramoAmbos() {
  return { tipoRuta: 'carretera', capacidad: 10, longitud: 5, tipoTrafico: 'ambos' };
}

test('inicializa cargaActual en 0 y suma la cantidad registrada', () => {
  const tramo = tramoAmbos();
  registrarCargaTramo(tramo, 'mercaderia', 5);
  assert.equal(tramo.cargaActual, 5);
});

test('acumula entre llamadas sucesivas', () => {
  const tramo = tramoAmbos();
  registrarCargaTramo(tramo, 'mercaderia', 5);
  registrarCargaTramo(tramo, 'personas', 3);
  assert.equal(tramo.cargaActual, 8);
});

test('devuelve el tramo mutado', () => {
  const tramo = tramoAmbos();
  const resultado = registrarCargaTramo(tramo, 'mercaderia', 4);
  assert.equal(resultado, tramo);
});

test('tramo mercaderia acepta carga de mercaderia', () => {
  const tramo = { tipoRuta: 'ferrocarril', capacidad: 20, longitud: 7, tipoTrafico: 'mercaderia' };
  registrarCargaTramo(tramo, 'mercaderia', 6);
  assert.equal(tramo.cargaActual, 6);
});

test('tramo mercaderia rechaza carga de personas: error de negocio (no RangeError)', () => {
  const tramo = { tipoRuta: 'ferrocarril', capacidad: 20, longitud: 7, tipoTrafico: 'mercaderia' };
  assert.throws(
    () => registrarCargaTramo(tramo, 'personas', 1),
    (err) => err instanceof Error && !(err instanceof RangeError)
  );
  assert.equal(tramo.cargaActual, undefined);
});

test('cantidad no positiva lanza RangeError', () => {
  const tramo = tramoAmbos();
  assert.throws(() => registrarCargaTramo(tramo, 'mercaderia', 0), RangeError);
  assert.throws(() => registrarCargaTramo(tramo, 'mercaderia', -1), RangeError);
});

test('cantidad no entera lanza RangeError', () => {
  const tramo = tramoAmbos();
  assert.throws(() => registrarCargaTramo(tramo, 'mercaderia', 1.5), RangeError);
});

test('tipoTraficoConsulta invalido (incluido ambos) lanza RangeError', () => {
  const tramo = tramoAmbos();
  assert.throws(() => registrarCargaTramo(tramo, 'ambos', 1), RangeError);
  assert.throws(() => registrarCargaTramo(tramo, 'volador', 1), RangeError);
});

test('tramo invalido (null o no objeto) lanza RangeError', () => {
  assert.throws(() => registrarCargaTramo(null, 'mercaderia', 1), RangeError);
  assert.throws(() => registrarCargaTramo('no-es-tramo', 'mercaderia', 1), RangeError);
});
