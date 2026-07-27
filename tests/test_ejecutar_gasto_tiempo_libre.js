const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarGastoTiempoLibre } = require('../src/ejecutarGastoTiempoLibre.js');

test('la poblacion gasta dinero en tiempo libre todos los dias, laborales y fin de semana por igual', () => {
  const resultado = ejecutarGastoTiempoLibre();
  assert.deepEqual(resultado, {
    historial: [
      { tick: 0, diaDeSemana: 'lunes', personasQueViajan: 10, personasQueLlegan: 10, ventaResuelta: 6, montoVenta: 18, saldoTesoreria: 18 },
      { tick: 1, diaDeSemana: 'martes', personasQueViajan: 10, personasQueLlegan: 10, ventaResuelta: 6, montoVenta: 18, saldoTesoreria: 36 },
      { tick: 2, diaDeSemana: 'miercoles', personasQueViajan: 10, personasQueLlegan: 10, ventaResuelta: 6, montoVenta: 18, saldoTesoreria: 54 },
      { tick: 3, diaDeSemana: 'jueves', personasQueViajan: 10, personasQueLlegan: 10, ventaResuelta: 6, montoVenta: 18, saldoTesoreria: 72 },
      { tick: 4, diaDeSemana: 'viernes', personasQueViajan: 10, personasQueLlegan: 10, ventaResuelta: 6, montoVenta: 18, saldoTesoreria: 90 },
      { tick: 5, diaDeSemana: 'sabado', personasQueViajan: 10, personasQueLlegan: 10, ventaResuelta: 6, montoVenta: 18, saldoTesoreria: 108 },
      { tick: 6, diaDeSemana: 'domingo', personasQueViajan: 10, personasQueLlegan: 10, ventaResuelta: 6, montoVenta: 18, saldoTesoreria: 126 },
    ],
    tesoreriaFinal: { saldo: 126 },
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarGastoTiempoLibre(), ejecutarGastoTiempoLibre());
});
