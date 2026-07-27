const TIPOS_TRAMO_VALIDOS = ['mercaderia', 'personas', 'ambos'];
const TIPOS_CONSULTA_VALIDOS = ['mercaderia', 'personas'];

function tramoAdmiteTrafico(tramo, tipoTraficoConsulta) {
  if (!TIPOS_TRAMO_VALIDOS.includes(tramo.tipoTrafico)) {
    throw new RangeError(`tramo.tipoTrafico desconocido: ${tramo.tipoTrafico}`);
  }
  if (!TIPOS_CONSULTA_VALIDOS.includes(tipoTraficoConsulta)) {
    throw new RangeError(`tipoTraficoConsulta desconocido: ${tipoTraficoConsulta}`);
  }
  if (tramo.tipoTrafico === 'ambos') {
    return true;
  }
  return tramo.tipoTrafico === tipoTraficoConsulta;
}

module.exports = { tramoAdmiteTrafico };
