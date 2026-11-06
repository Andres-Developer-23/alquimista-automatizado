# ADR 0003: Cola de acciones y ticks

- **Estado:** Aceptado
- **Fecha:** 2026-11-06
- **Decisores:** Andres Felipe Bravo Navarro

## Contexto

El código Python no debe controlar directamente la animación ni el tiempo. Si el código del jugador pudiera dormir o mover el Gólem de inmediato, la UI se bloquearía y el juego sería impredecible.

## Decisión

El código Python solo **describe** acciones. React las recibe, las valida y las ejecuta una por una en un ciclo de ticks de 500 ms.

```text
Python -> acciones JSON -> cola -> tick -> estado -> escena
```

Reglas:

- Cada tick consume una sola acción.
- La animación se interpola durante el intervalo del tick.
- Una nueva ejecución cancela la cola anterior.
- El motor de juego es una función pura; el scheduler se inyecta para poder testearlo.
- Los errores de Python detienen la ejecución y se muestran en la UI.

## Alternativas consideradas

### Animar directamente en el Worker

Descartado: el Worker no tiene acceso al DOM ni a R3F, y mezclaría responsabilidades.

### Usar `setTimeout` dentro de Python

Descartado: Pyodide no debe manejar el tiempo de la UI y complica la cancelación.

### Ejecutar todas las acciones en un solo frame

Descartado: el jugador no podría ver la secuencia y se perdería el valor educativo.

## Consecuencias

### Positivas

- Comportamiento determinista y fácil de testear.
- La UI y la escena permanecen fluidas.
- El ritmo es visible para el jugador.
- La cancelación es explícita.

### Negativas

- Una acción por tick puede sentirse lenta si hay muchas acciones.
- Requiere gestionar estado de cola, cancelación y errores.
- La animación debe coordinarse con el intervalo.

## Implementación prevista

```js
const tickEngine = createTickEngine({
  intervalMs: 500,
  scheduler: window.setInterval,
  onTick: (action) => dispatch(action),
})
```

En tests se inyecta un scheduler falso para avanzar el tiempo de forma controlada.

## Criterios de revisión

Revisar si:

- El juego necesita animaciones simultáneas.
- Se requiere velocidad ajustable por el jugador.
- El número de acciones por nivel crece demasiado.
