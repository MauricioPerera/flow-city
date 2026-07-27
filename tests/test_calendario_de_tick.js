const test = require('node:test');
const assert = require('node:assert/strict');
const { calendarioDeTick } = require('../src/calendarioDeTick.js');

test('tick 0 es lunes, laboral, semana 0, mes 0, otono, anio 0', () => {
  assert.deepEqual(calendarioDeTick(0), {
    dia: 0,
    anio: 0,
    mesDelAnio: 0,
    semanaDelMes: 0,
    diaDeSemana: 'lunes',
    esLaboral: true,
    estacion: 'otono',
  });
});

test('tick 4 es viernes, laboral', () => {
  const info = calendarioDeTick(4);
  assert.equal(info.diaDeSemana, 'viernes');
  assert.equal(info.esLaboral, true);
});

test('tick 5 es sabado, descanso', () => {
  const info = calendarioDeTick(5);
  assert.equal(info.diaDeSemana, 'sabado');
  assert.equal(info.esLaboral, false);
});

test('tick 6 es domingo, descanso', () => {
  const info = calendarioDeTick(6);
  assert.equal(info.diaDeSemana, 'domingo');
  assert.equal(info.esLaboral, false);
});

test('tick 7 vuelve a lunes y pasa a la semana 1', () => {
  const info = calendarioDeTick(7);
  assert.equal(info.diaDeSemana, 'lunes');
  assert.equal(info.semanaDelMes, 1);
});

test('tick 28 (4 semanas) pasa al mes 1', () => {
  const info = calendarioDeTick(28);
  assert.equal(info.mesDelAnio, 1);
  assert.equal(info.semanaDelMes, 0);
  assert.equal(info.diaDeSemana, 'lunes');
});

test('tick 84 (3 meses) pasa a la estacion invierno', () => {
  const info = calendarioDeTick(84);
  assert.equal(info.mesDelAnio, 3);
  assert.equal(info.estacion, 'invierno');
});

test('tick 168 (6 meses) es primavera', () => {
  assert.equal(calendarioDeTick(168).estacion, 'primavera');
});

test('tick 252 (9 meses) es verano', () => {
  assert.equal(calendarioDeTick(252).estacion, 'verano');
});

test('tick 336 (12 meses) vuelve a otono y pasa al anio 1', () => {
  const info = calendarioDeTick(336);
  assert.equal(info.estacion, 'otono');
  assert.equal(info.anio, 1);
  assert.equal(info.mesDelAnio, 0);
  assert.equal(info.diaDeSemana, 'lunes');
});

test('numeroTick negativo lanza RangeError', () => {
  assert.throws(() => calendarioDeTick(-1), RangeError);
});

test('numeroTick no entero lanza RangeError', () => {
  assert.throws(() => calendarioDeTick(1.5), RangeError);
});
