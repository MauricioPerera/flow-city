const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaMantenimientoCalendario } = require('../src/ejecutarCadenaMantenimientoCalendario.js');

test('el mantenimiento solo se cobra en dias laborales; el fin de semana lo salta y la tesoreria crece mas rapido', () => {
  const resultado = ejecutarCadenaMantenimientoCalendario();
  assert.deepEqual(resultado, {
    historial: [
      { tick: 0, diaDeSemana: 'lunes', esLaboral: true, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: true, saldoTesoreria: 13 },
      { tick: 1, diaDeSemana: 'martes', esLaboral: true, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: true, saldoTesoreria: 26 },
      { tick: 2, diaDeSemana: 'miercoles', esLaboral: true, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: true, saldoTesoreria: 39 },
      { tick: 3, diaDeSemana: 'jueves', esLaboral: true, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: true, saldoTesoreria: 52 },
      { tick: 4, diaDeSemana: 'viernes', esLaboral: true, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: true, saldoTesoreria: 65 },
      { tick: 5, diaDeSemana: 'sabado', esLaboral: false, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: false, saldoTesoreria: 81 },
      { tick: 6, diaDeSemana: 'domingo', esLaboral: false, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: false, saldoTesoreria: 97 },
      { tick: 7, diaDeSemana: 'lunes', esLaboral: true, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4, manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, mantenimientoCobrado: true, saldoTesoreria: 110 },
    ],
    almacenBombaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 10, stockMateriaPrima: 0, stockProducto: 0 },
    almacenGranjaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 20, stockMateriaPrima: 0, stockProducto: 0 },
    tesoreriaFinal: { saldo: 110 },
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarCadenaMantenimientoCalendario(),
    ejecutarCadenaMantenimientoCalendario()
  );
});
