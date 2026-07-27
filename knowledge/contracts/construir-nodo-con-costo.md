---
type: 'Task Contract'
title: 'Construcción de un nodo con costo de tesorería'
description: 'Funcion que coloca un nodo en el grid y, solo si eso no falla, gasta su costo de construccion de la tesoreria.'
tags: ['motor-economia', 'motor-integracion', 'flow-city', 'construccion', 'grid']

task: construir-nodo-con-costo
intent: "Colocar un nodo en el grid y, solo si la colocacion no falla, gastar su costo de construccion de la tesoreria."
target: src/construirNodoConCosto.js
signature: "function construirNodoConCosto(grid, tesoreria, x, y, categoriaTerreno, categoriaCosto, nodo)"
test_command: "node tests/test_construir_nodo_con_costo.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_construir_nodo_con_costo.js"
tests_sha256: "60ad246b9ec456c928b6e1522bba40151ba12c395c976f3962ec3c558575d04e"
touch_only: ['src/construirNodoConCosto.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Construcción de un nodo con costo de tesorería

## Intent
Tercera pieza del [Contrato 14](../../specs/CONTRACT-14-gasto-tesoreria-construccion.md):
compone [`colocarNodo`](./colocar-nodo.md) (Contrato 01) con
[`costoConstruccionNodo`](./costo-construccion-nodo.md) (T1) y
[`registrarGasto`](./registrar-gasto.md) (Contrato 05). `categoriaTerreno` es la categoría de
emplazamiento que valida `colocarNodo` (ej. `'agricultura'`, `'no_extractiva'`);
`categoriaCosto` es la categoría de producción del nodo que usa `costoConstruccionNodo` (ej.
`'extraccion-agua'`) — pueden coincidir (como en la granja) o no (como en la bomba, cuyo
emplazamiento es `'no_extractiva'` pero su costo es el de `'extraccion-agua'`).

Orden de ejecución deliberado (evita efectos secundarios parciales): primero se calcula el
costo (`costoConstruccionNodo`, puro, sin mutar nada — si `categoriaCosto` es desconocida,
lanza `RangeError` ANTES de tocar el grid); luego se coloca el nodo (`colocarNodo` — si el
terreno no admite la categoría o la celda ya está ocupada, lanza `Error` de negocio, sin haber
gastado nada); solo si ambos pasos anteriores tuvieron éxito se gasta el costo
(`registrarGasto`).

## Interface
```
function construirNodoConCosto(grid, tesoreria, x, y, categoriaTerreno, categoriaCosto, nodo)
```
Devuelve la celda actualizada (misma forma que `colocarNodo`). Muta `grid` y `tesoreria.saldo`.

## Invariants
- Si `categoriaCosto` es desconocida (fuera de la tabla de `costoConstruccionNodo`): lanza
  `RangeError`, sin mutar `grid` ni `tesoreria`.
- Si `colocarNodo` falla (terreno incompatible o celda ocupada): el error de negocio se
  propaga tal cual, sin mutar `tesoreria` (el costo NO se descuenta).
- Si ambos pasos anteriores tienen éxito: `tesoreria.saldo` disminuye exactamente en
  `costoConstruccionNodo(categoriaCosto)`, y `grid` refleja el nodo colocado.
- Dos construcciones sucesivas exitosas descuentan cumulativamente (no se resetea el saldo
  entre llamadas).

## Examples
- `construirNodoConCosto(grid, tesoreria(100), 0, 0, 'agricultura', 'agricultura',
  'granja-1')` -> celda con `nodo: 'granja-1'`, `tesoreria.saldo === 70`.
- Sobre celda `'neutra'`: `construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura',
  'agricultura', 'granja-1')` -> lanza `Error` ("terreno..."), `tesoreria.saldo` sin cambios.
- `construirNodoConCosto(grid, tesoreria, 0, 0, 'agricultura', 'mineria', 'granja-1')` -> lanza
  `RangeError` (costo desconocido), celda y tesorería sin cambios.

## Do / Don't
- DO: calcular el costo ANTES de llamar a `colocarNodo` (falla más barata primero, sin efectos
  secundarios).
- DO: reusar `colocarNodo`, `costoConstruccionNodo` y `registrarGasto` sin reimplementar su
  lógica.
- DON'T: usar red, `require` de paquetes externos (salvo los tres módulos hermanos ya
  listados), ni acceso a estado global.
- DON'T: gastar el costo si `colocarNodo` falla, ni colocar el nodo si el costo es desconocido.

## Tests
(Los tests están en `tests/test_construir_nodo_con_costo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
