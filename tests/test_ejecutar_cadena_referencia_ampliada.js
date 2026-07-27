const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaReferenciaAmpliada } = require('../src/ejecutarCadenaReferenciaAmpliada.js');

test('poblacion, degradacion, mantenimiento por calendario y clima estacional interactuan: la poblacion se estabiliza en un equilibrio de cobertura 0.5, no 1', () => {
  const resultado = ejecutarCadenaReferenciaAmpliada();
  assert.deepEqual(resultado, {
    historial: [
      {
        tick: 80, diaDeSemana: 'jueves', esLaboral: true, estacion: 'otono', degradado: false,
        aguaProducida: 4, aguaParaPoblacion: 2, coberturaAgua: 1, aguaRestante: 2, aguaRecibidaGranja: 2,
        manzanasConDegradacion: 4, multiplicadorClima: 1, manzanasProducidas: 4, comidaParaPoblacion: 2,
        coberturaComida: 1, manzanasRestantes: 2, manzanasVendidas: 2, montoVenta: 4,
        mantenimientoCobrado: true, indiceCobertura: 1, saldoTesoreria: -29, contadorQuiebra: 1,
        poblacionInicioTick: 10, cambioPoblacion: 1, poblacionFinTick: 11,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 81, diaDeSemana: 'viernes', esLaboral: true, estacion: 'otono', degradado: false,
        aguaProducida: 4, aguaParaPoblacion: 2.2, coberturaAgua: 1, aguaRestante: 1, aguaRecibidaGranja: 1,
        manzanasConDegradacion: 2, multiplicadorClima: 1, manzanasProducidas: 2, comidaParaPoblacion: 2,
        coberturaComida: 0.9090909090909091, manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0,
        mantenimientoCobrado: true, indiceCobertura: 0.9090909090909091, saldoTesoreria: -32,
        contadorQuiebra: 2, poblacionInicioTick: 11, cambioPoblacion: 0, poblacionFinTick: 11,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 82, diaDeSemana: 'sabado', esLaboral: false, estacion: 'otono', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 2, coberturaAgua: 0.9090909090909091, aguaRestante: 0,
        aguaRecibidaGranja: 0, manzanasConDegradacion: 0, multiplicadorClima: 1, manzanasProducidas: 0,
        comidaParaPoblacion: 0, coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: false, indiceCobertura: 0, saldoTesoreria: -32,
        contadorQuiebra: 3, poblacionInicioTick: 11, cambioPoblacion: -2, poblacionFinTick: 9,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 83, diaDeSemana: 'domingo', esLaboral: false, estacion: 'otono', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 1.8, coberturaAgua: 1, aguaRestante: 0,
        aguaRecibidaGranja: 0, manzanasConDegradacion: 0, multiplicadorClima: 1, manzanasProducidas: 0,
        comidaParaPoblacion: 0, coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: false, indiceCobertura: 0, saldoTesoreria: -32,
        contadorQuiebra: 4, poblacionInicioTick: 9, cambioPoblacion: -1, poblacionFinTick: 8,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 84, diaDeSemana: 'lunes', esLaboral: true, estacion: 'invierno', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 1.6, coberturaAgua: 1, aguaRestante: 0,
        aguaRecibidaGranja: 0, manzanasConDegradacion: 0, multiplicadorClima: 0.5, manzanasProducidas: 0,
        comidaParaPoblacion: 0, coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: true, indiceCobertura: 0, saldoTesoreria: -35,
        contadorQuiebra: 5, poblacionInicioTick: 8, cambioPoblacion: -1, poblacionFinTick: 7,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 85, diaDeSemana: 'martes', esLaboral: true, estacion: 'invierno', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 1.4000000000000001, coberturaAgua: 1, aguaRestante: 0,
        aguaRecibidaGranja: 0, manzanasConDegradacion: 0, multiplicadorClima: 0.5, manzanasProducidas: 0,
        comidaParaPoblacion: 0, coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: true, indiceCobertura: 0, saldoTesoreria: -38,
        contadorQuiebra: 6, poblacionInicioTick: 7, cambioPoblacion: -1, poblacionFinTick: 6,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 86, diaDeSemana: 'miercoles', esLaboral: true, estacion: 'invierno', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 1.2000000000000002, coberturaAgua: 1, aguaRestante: 0,
        aguaRecibidaGranja: 0, manzanasConDegradacion: 0, multiplicadorClima: 0.5, manzanasProducidas: 0,
        comidaParaPoblacion: 0, coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: true, indiceCobertura: 0, saldoTesoreria: -41,
        contadorQuiebra: 7, poblacionInicioTick: 6, cambioPoblacion: -1, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 87, diaDeSemana: 'jueves', esLaboral: true, estacion: 'invierno', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 1, coberturaAgua: 1, aguaRestante: 1,
        aguaRecibidaGranja: 1, manzanasConDegradacion: 1, multiplicadorClima: 0.5, manzanasProducidas: 0.5,
        comidaParaPoblacion: 0.5, coberturaComida: 0.5, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: true, indiceCobertura: 0.5, saldoTesoreria: -44,
        contadorQuiebra: 8, poblacionInicioTick: 5, cambioPoblacion: 0, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 88, diaDeSemana: 'viernes', esLaboral: true, estacion: 'invierno', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 1, coberturaAgua: 1, aguaRestante: 1,
        aguaRecibidaGranja: 1, manzanasConDegradacion: 1, multiplicadorClima: 0.5, manzanasProducidas: 0.5,
        comidaParaPoblacion: 0.5, coberturaComida: 0.5, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: true, indiceCobertura: 0.5, saldoTesoreria: -47,
        contadorQuiebra: 9, poblacionInicioTick: 5, cambioPoblacion: 0, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 89, diaDeSemana: 'sabado', esLaboral: false, estacion: 'invierno', degradado: true,
        aguaProducida: 2, aguaParaPoblacion: 1, coberturaAgua: 1, aguaRestante: 1,
        aguaRecibidaGranja: 1, manzanasConDegradacion: 1, multiplicadorClima: 0.5, manzanasProducidas: 0.5,
        comidaParaPoblacion: 0.5, coberturaComida: 0.5, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, mantenimientoCobrado: false, indiceCobertura: 0.5, saldoTesoreria: -47,
        contadorQuiebra: 10, poblacionInicioTick: 5, cambioPoblacion: 0, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
    ],
    almacenBombaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 10, stockMateriaPrima: 0, stockProducto: 0 },
    almacenGranjaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 20, stockMateriaPrima: 0, stockProducto: 0 },
    tesoreriaFinal: { saldo: -47 },
    poblacionInicial: 10,
    poblacionFinal: 5,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarCadenaReferenciaAmpliada(),
    ejecutarCadenaReferenciaAmpliada()
  );
});
