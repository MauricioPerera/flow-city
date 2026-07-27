const { crearNodoProductivoMultiInsumo } = require('./crearNodoProductivoMultiInsumo.js');
const { producirTickNodoMultiInsumo } = require('./producirTickNodoMultiInsumo.js');

function ejecutarTallerDeTala() {
  // a. cantidades fijadas del taller de tala real (DEFINITION.md)
  const agua = 10;
  const comida = 10;
  const personas = 6;

  // b. nodo productivo multi-insumo: agua(1) + comida(1) + personas(2) -> madera(1)
  const nodo = crearNodoProductivoMultiInsumo(
    'taller-tala',
    [
      { nombre: 'agua', ratioEntrada: 1 },
      { nombre: 'comida', ratioEntrada: 1 },
      { nombre: 'personas', ratioEntrada: 2 },
    ],
    1
  );

  // c. tandas individuales de cada insumo (reportables)
  const tandasAgua = Math.floor(agua / 1);
  const tandasComida = Math.floor(comida / 1);
  const tandasPersonas = Math.floor(personas / 2);

  // d. cuello de botella: el minimo de las tandas individuales
  const tandasProducidas = Math.min(tandasAgua, tandasComida, tandasPersonas);

  // e. produccion final delegada al motor del nodo (tandasProducidas * ratioSalida)
  const maderaProducida = producirTickNodoMultiInsumo(nodo, { agua, comida, personas });

  // f. resultado determinista entre corridas
  return {
    agua,
    comida,
    personas,
    tandasAgua,
    tandasComida,
    tandasPersonas,
    tandasProducidas,
    maderaProducida,
  };
}

module.exports = { ejecutarTallerDeTala };
