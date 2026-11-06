# ADR 0001: Stack tecnológico del MVP

- **Estado:** Aceptado
- **Fecha:** 2026-11-06
- **Decisores:** Andres Felipe Bravo Navarro

## Contexto

El proyecto necesita un editor de código, una escena 3D interactiva y un intérprete de Python que no bloquee la interfaz. El equipo es de una sola persona y el objetivo es publicar un MVP rápido en GitHub Pages.

## Decisión

Usar:

- **Vite + React** para la aplicación.
- **Monaco Editor** para la edición de Python.
- **React Three Fiber + drei + Three.js** para la escena 3D.
- **Pyodide** para ejecutar Python en el navegador.
- **Web Worker** para aislar la ejecución de Pyodide.
- **Vitest** para tests unitarios.
- **GitHub Actions + GitHub Pages** para CI/CD.

## Alternativas consideradas

### Next.js

Descartado para el MVP: no se necesita SSR ni routing, y agrega complejidad de despliegue en Pages.

### CodeMirror

Válido, pero Monaco ofrece una experiencia más cercana a un IDE y ya tiene integración directa con React.

### Skulpt / Brython

Alternativas más ligeras, pero con menor compatibilidad de Python y menos ecosistema para el tipo de ejercicios previstos.

### Three.js puro

Descartado porque R3F simplifica la integración con el estado de React y la composición de la escena.

### Backend para ejecutar Python

Descartado para el MVP: agrega infraestructura, latencia y costos. Pyodide permite ejecución local.

## Consecuencias

### Positivas

- Despliegue estático sencillo y gratuito.
- Ejecución de Python sin backend.
- Ecosistema amplio y documentación abundante.
- El Worker mantiene la UI fluida.

### Negativas

- Pyodide pesa varios MB y depende de un CDN.
- El bundle inicial es grande.
- El código Python no es un sandbox de seguridad completo.

## Criterios de revisión

Revisar esta decisión si:

- Se necesita soporte offline completo.
- Se requiere ejecutar código no confiable de terceros.
- El tamaño del bundle impide una experiencia aceptable en móvil.
