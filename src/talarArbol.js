function talarArbol(estadoArboles, x, y) {
  const clave = `${x},${y}`;
  const entrada = estadoArboles.get(clave) || { estado: 'arbol', ticksEnEstado: 0 };

  if (entrada.estado !== 'arbol') {
    throw new Error(`La celda (${x},${y}) no esta en estado arbol`);
  }

  estadoArboles.set(clave, { estado: 'tocon', ticksEnEstado: 0 });
}

module.exports = { talarArbol };
