# ADR 0002: Pyodide en un Web Worker

- **Estado:** Aceptado
- **Fecha:** 2026-11-06
- **Decisores:** Andres Felipe Bravo Navarro

## Contexto

El código Python del jugador puede tardar o contener bucles largos. Ejecutarlo en el hilo principal congelaría la UI, incluyendo el editor y la escena 3D.

## Decisión

Cargar Pyodide dentro de un Web Worker clásico usando `importScripts()` desde el CDN oficial, y comunicar React con el Worker mediante `postMessage`.

El Worker:

1. Carga Pyodide una sola vez.
2. Inyecta las funciones del juego (`mover`, etc.).
3. Ejecuta el código del jugador de forma asíncrona.
4. Serializa las acciones a JSON.
5. Devuelve un mensaje estructurado.

## Alternativas consideradas

### Pyodide en el hilo principal

Descartado: bloquea la UI y produce una experiencia inaceptable.

### iframe con Pyodide

Mayor aislamiento, pero más complejo de comunicar y de empaquetar con Vite. Se puede reconsiderar si se ejecuta código de terceros.

### Backend con Python

Descartado para el MVP por costo y latencia.

## Consecuencias

### Positivas

- La UI sigue respondiendo durante la ejecución.
- El código de Python queda separado del DOM.
- El contrato de mensajes es explícito y testeable.

### Negativas

- No hay acceso directo al DOM desde el Worker.
- La carga inicial de Pyodide tarda.
- Un Worker no impone límites de CPU ni memoria.
- Los errores deben serializarse manualmente.

## Reglas

- No usar `time.sleep` ni esperas bloqueantes en Python.
- No exponer APIs privilegiadas al entorno Python.
- Mantener el Worker libre de lógica de juego; solo traduce código a acciones.
- En fase 2, agregar timeout y reinicio del Worker para ejecuciones largas.

## Criterios de revisión

Revisar si:

- Se necesita ejecutar código de usuarios desconocidos.
- Se requiere limitar recursos de forma estricta.
- Pyodide deja de ser viable por tamaño o compatibilidad.
