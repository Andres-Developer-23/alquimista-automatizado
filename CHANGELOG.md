# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

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
- Tests unitarios de acciones, cola, ticks, estado del juego, animación y errores.
- Configuración de GitHub Pages.
- CI con lint, tests y build.
- Documentación de arquitectura, setup, roadmap y contribución.
- Plantillas de issues, pull request y Dependabot.

## [0.1.0] - 2026-11-06

### Added

- Versión inicial del MVP de El Alquimista Automatizado.

[Unreleased]: https://github.com/Andres-Developer-23/alquimista-automatizado/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Andres-Developer-23/alquimista-automatizado/releases/tag/v0.1.0
