const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarViajesFaseLaboral } = require('../src/ejecutarViajesFaseLaboral.js');

test('la transicion de fase laboral genera viajes reales de ida y vuelta solo en dias laborales', () => {
  const resultado = ejecutarViajesFaseLaboral();
  assert.deepEqual(resultado, {
    personasQueTrabajan: 8,
    historial: [
      { tick: 0, diaDeSemana: 'lunes', esLaboral: true, viajeGenerado: true, personasIda: 8, personasVuelta: 8 },
      { tick: 1, diaDeSemana: 'martes', esLaboral: true, viajeGenerado: true, personasIda: 8, personasVuelta: 8 },
      { tick: 2, diaDeSemana: 'miercoles', esLaboral: true, viajeGenerado: true, personasIda: 8, personasVuelta: 8 },
      { tick: 3, diaDeSemana: 'jueves', esLaboral: true, viajeGenerado: true, personasIda: 8, personasVuelta: 8 },
      { tick: 4, diaDeSemana: 'viernes', esLaboral: true, viajeGenerado: true, personasIda: 8, personasVuelta: 8 },
      { tick: 5, diaDeSemana: 'sabado', esLaboral: false, viajeGenerado: false, personasIda: 0, personasVuelta: 0 },
      { tick: 6, diaDeSemana: 'domingo', esLaboral: false, viajeGenerado: false, personasIda: 0, personasVuelta: 0 },
    ],
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarViajesFaseLaboral(), ejecutarViajesFaseLaboral());
});
