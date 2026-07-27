const DIAS_SEMANA = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
];
const ESTACIONES = ['otono', 'invierno', 'primavera', 'verano'];

const DIAS_POR_SEMANA = 7;
const SEMANAS_POR_MES = 4;
const DIAS_POR_MES = DIAS_POR_SEMANA * SEMANAS_POR_MES;
const MESES_POR_ESTACION = 3;
const ESTACIONES_POR_ANIO = 4;
const DIAS_POR_ANIO = DIAS_POR_MES * MESES_POR_ESTACION * ESTACIONES_POR_ANIO;

function calendarioDeTick(numeroTick) {
  if (!Number.isInteger(numeroTick) || numeroTick < 0) {
    throw new RangeError('numeroTick debe ser un entero no negativo');
  }

  const anio = Math.floor(numeroTick / DIAS_POR_ANIO);
  const diaDelAnio = numeroTick % DIAS_POR_ANIO;
  const mesDelAnio = Math.floor(diaDelAnio / DIAS_POR_MES);
  const semanaDelMes = Math.floor((diaDelAnio % DIAS_POR_MES) / DIAS_POR_SEMANA);
  const diaDeSemanaIndex = diaDelAnio % DIAS_POR_SEMANA;
  const estacionIndex = Math.floor(mesDelAnio / MESES_POR_ESTACION);

  return {
    dia: numeroTick,
    anio,
    mesDelAnio,
    semanaDelMes,
    diaDeSemana: DIAS_SEMANA[diaDeSemanaIndex],
    esLaboral: diaDeSemanaIndex < 5,
    estacion: ESTACIONES[estacionIndex],
  };
}

module.exports = { calendarioDeTick };
