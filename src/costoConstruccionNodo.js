function costoConstruccionNodo(categoria) {
  const tabla = {
    'extraccion-agua': 50,
    'agricultura': 30,
  };

  if (Object.prototype.hasOwnProperty.call(tabla, categoria)) {
    return tabla[categoria];
  }

  throw new RangeError(`Categoria no registrada: ${categoria}`);
}

module.exports = { costoConstruccionNodo };