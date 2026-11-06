# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

### Added

- Pendiente de cambios post-v1.0.0.

## [1.0.0] - 2026-11-06

### Added

- Scaffolding de Vite + React.
- Layout dividido con Monaco Editor y escena 3D.
- Tablero de 5x5 con `GridHelper` y Gólem dummy azul.
- Web Worker con Pyodide cargado desde CDN.
- Función Python `mover(x, y)` que genera acciones JSON.
- Botón Ejecutar y registro de la respuesta en consola.
- Validación y normalización de acciones en el cliente.
- Cola FIFO de acciones con cancelación de ejecuciones anteriores.
- Motor de ticks de 500 ms con scheduler inyectable.
- Estado de posición del Gólem sincronizado con la escena.
- Movimiento del Gólem interpolado entre celdas y limitado al tablero.
- Errores de Python clasificados y renderizados en un panel legible.
- Comandos Python `girar(grados)` y `recoger()` con validación y rotación/inventario en el motor.
- Ayuda de comandos y contador de inventario visibles.
- Tests unitarios de acciones, cola, ticks, estado del juego, animación, errores e inventario.
- Configuración de GitHub Pages.
- CI con lint, tests y build.
- Documentación de arquitectura, setup, roadmap y contribución.
- Catálogo de assets 3D y créditos con licencias verificadas.
- Plantillas de issues, pull request y Dependabot.
- Selector de niveles y progreso persistente en `localStorage`.
- Nivel 2 y condición de victoria con caldero y obstáculos.
- Accesibilidad: foco visible, `aria-label`, `role="status"` y `role="alert"`, `prefers-reduced-motion`.

[Unreleased]: https://github.com/Andres-Developer-23/alquimista-automatizado/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Andres-Developer-23/alquimista-automatizado/releases/tag/v1.0.0
[0.1.0]: https://github.com/Andres-Developer-23/alquimista-automatizado/releases/tag/v0.1.0
