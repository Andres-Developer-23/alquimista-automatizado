# Roadmap

## Visión

Convertir a El Alquimista Automatizado en un juego educativo donde cualquier persona pueda aprender los fundamentos de Python resolviendo retos con un Gólem en un taller 3D.

## Principios de priorización

1. Primero un ciclo jugable completo, después contenido.
2. Primero claridad y feedback, después efectos visuales.
3. Primero tests del motor, después optimizaciones prematuras.
4. Cada fase debe terminar con una demo desplegada.

## Fase 1 — Scaffolding

**Objetivo:** demostrar el flujo editor → Python → Worker → JSON → React sin bloquear la UI.

- [x] Proyecto Vite + React.
- [x] Layout dividido editor/escena.
- [x] Monaco Editor para Python.
- [x] Escena R3F con grid 5x5.
- [x] Gólem dummy azul.
- [x] Worker con Pyodide desde CDN.
- [x] Función `mover(x, y)` inyectada.
- [x] Botón Ejecutar y `console.log` de la respuesta.
- [x] Base para GitHub Pages.
- [x] CI con lint, tests y build.
- [x] Documentación base y plantillas de GitHub.

**Criterio de salida:** al ejecutar `mover(1, 2)` la consola muestra un arreglo JSON con una acción `MOVER`.

## Fase 2 — Motor de acciones

**Objetivo:** que el Gólem se mueva de verdad, una acción por tick.

- [ ] Definir el estado del juego (`position`, `rotation`, `inventory`).
- [ ] Implementar cola de acciones.
- [ ] Implementar `tickEngine` con intervalo de 500 ms.
- [ ] Cancelar ejecuciones anteriores al volver a presionar Ejecutar.
- [ ] Animar el Gólem entre celdas.
- [ ] Sincronizar la escena con el estado del juego.
- [ ] Mostrar errores de Python en la UI.
- [ ] Tests del motor con scheduler inyectado.
- [ ] Tests de integración del protocolo Worker.

**Criterio de salida:** `mover(1, 2)` desplaza visualmente al Gólem a la celda `(1, 2)` en un tick.

## Fase 3 — Niveles y validación

**Objetivo:** convertir la demo en un juego con objetivos.

- [ ] Formato de nivel en JSON.
- [ ] Cargador de niveles.
- [ ] Objetivo del nivel y condición de victoria.
- [ ] Validación de colisiones y límites del tablero.
- [ ] Comandos `girar(grados)` y `recoger()`.
- [ ] Inventario y objetos recolectables.
- [ ] Mensajes de éxito/fracaso.
- [ ] Selector de niveles.
- [ ] Tests de reglas y niveles.

**Criterio de salida:** un nivel completo se puede resolver escribiendo Python y el juego detecta la victoria.

## Fase 4 — Pulido y release

**Objetivo:** experiencia usable, accesible y presentable.

- [ ] Animaciones de cámara y Gólem.
- [ ] Feedback sonoro opcional.
- [ ] Accesibilidad: teclado, foco visible, contraste, ARIA.
- [ ] Responsive en tablets y móviles.
- [ ] Persistencia de progreso en `localStorage`.
- [ ] Pantalla de bienvenida y tutorial.
- [ ] Manejo de Pyodide sin conexión.
- [ ] Optimización del bundle.
- [ ] Release `v1.0.0`.

**Criterio de salida:** un usuario nuevo completa el primer nivel sin ayuda externa.

## Backlog no priorizado

- Editor de niveles.
- Compartir soluciones por URL.
- Ranking local.
- Más entidades (cofres, portales, obstáculos).
- Traducción a inglés.
- Modo docente con retos personalizados.
- Telemetría anónima opt-in.

## Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Pyodide tarda en cargar | Mala primera impresión | Estado de carga claro y caché del navegador |
| Código del jugador bloquea el worker | Acciones no llegan | Timeout y reinicio del Worker en fase 2 |
| CDN no disponible | Juego inutilizable | Mensaje de error y fallback documentado |
| Bundle grande | Carga lenta | Code splitting y carga diferida de la escena |
| Reglas complejas en React | Difícil de testear | Motor de juego puro y separado |

## Métricas de éxito del MVP

- El flujo de ejecución funciona en Chrome, Firefox y Edge modernos.
- Un PR puede validarse con lint, tests y build en menos de 5 minutos.
- El primer nivel se completa en menos de 10 minutos.
- No hay errores de consola en el flujo feliz.
