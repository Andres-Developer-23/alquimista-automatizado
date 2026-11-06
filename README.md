# El Alquimista Automatizado

Juego educativo de programación y lógica. El jugador escribe Python para controlar a un Gólem en un taller 3D.

[![CI](https://github.com/Andres-Developer-23/alquimista-automatizado/actions/workflows/ci.yml/badge.svg)](https://github.com/Andres-Developer-23/alquimista-automatizado/actions/workflows/ci.yml)
[![Deploy](https://github.com/Andres-Developer-23/alquimista-automatizado/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Andres-Developer-23/alquimista-automatizado/actions/workflows/deploy-pages.yml)

**Demo:** https://andres-developer-23.github.io/alquimista-automatizado/

![Captura de la interfaz](docs/assets/screenshot.png)

## Qué incluye el MVP

- Editor Monaco configurado para Python.
- Escena 3D con React Three Fiber: tablero de 5x5 y Gólem azul.
- Pyodide ejecutándose dentro de un Web Worker.
- Funciones Python inyectadas (`mover(x, y)`) que generan un arreglo JSON de acciones.
- Botón **Ejecutar** que envía el código al Worker y muestra la respuesta en la consola.
- Base configurada para publicar en GitHub Pages.

## Stack

| Capa | Tecnología |
| --- | --- |
| Build | Vite |
| UI | React |
| Editor | `@monaco-editor/react` |
| 3D | `@react-three/fiber`, `@react-three/drei`, Three.js |
| Python | Pyodide 0.25.0 desde CDN |
| Aislamiento | Web Worker clásico |
| Tests | Vitest + Testing Library |
| CI/CD | GitHub Actions + GitHub Pages |

## Inicio rápido

Requisitos: Node.js 22+ y npm 10+.

```bash
git clone https://github.com/Andres-Developer-23/alquimista-automatizado.git
cd alquimista-automatizado
npm ci
npm run dev
```

Abrir la URL que imprime Vite. En desarrollo la app vive bajo el `base` configurado:

```text
http://localhost:5173/alquimista-automatizado/
```

## Scripts

```bash
npm run dev        # servidor local
npm run build      # build de producción
npm run preview    # previsualizar el build
npm run lint       # ESLint
npm test           # tests una vez
npm run test:watch # tests en modo watch
```

## Cómo funciona

```text
Editor Python
    │  postMessage({ type: 'run', code })
    ▼
Web Worker
    │  Pyodide evalúa el código con mover() inyectado
    │  json.dumps(actions)
    ▼
React
    │  normalizeActions()
    │  console.log(acciones)
    ▼
(fase 2) cola de acciones + ticks de 500 ms + animación 3D
```

Regla crítica: el código del jugador **nunca** debe bloquear la UI. No se usa `time.sleep`; cada comando se transforma en un dato que React procesa después, tick a tick.

Contrato actual del Worker:

```json
{
  "type": "result",
  "actions": [{ "action": "MOVER", "x": 1, "y": 2 }]
}
```

## Estructura del proyecto

```text
src/
├── app/                 # composición de la aplicación y estilos de pantalla
├── components/
│   ├── editor/          # Monaco
│   ├── scene/           # Canvas R3F, grid y Gólem
│   └── ui/              # controles reutilizables
├── engine/
│   ├── actions/         # contrato y validación de acciones
│   └── python/          # puente con el Web Worker
├── hooks/               # estado de React y ciclo de vida del Worker
├── styles/              # estilos globales y tokens
└── workers/             # Pyodide + intérprete Python
```

Más detalle en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Setup y despliegue](docs/SETUP.md)
- [Guía de contribución](CONTRIBUTING.md)
- [Decisiones de arquitectura](docs/adr/)
- [Changelog](CHANGELOG.md)
- [Seguridad](SECURITY.md)

## Despliegue

El workflow `deploy-pages.yml` publica `dist/` en GitHub Pages al hacer push a `main`. La base de Vite debe coincidir con el nombre del repositorio:

```js
base: '/alquimista-automatizado/'
```

Pasos completos en [docs/SETUP.md](docs/SETUP.md).

## Roadmap resumido

1. **Fase 1:** scaffolding, editor, escena, Worker y conexión UI.
2. **Fase 2:** cola de acciones, ticks de 500 ms y movimiento animado.
3. **Fase 3:** niveles, objetivos y validación.
4. **Fase 4:** pulido visual, accesibilidad, sonido y release.

Ver [docs/ROADMAP.md](docs/ROADMAP.md).

## Contribuir

Se aceptan issues y pull requests. Antes de abrir un PR, revisar [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

[MIT](LICENSE) © 2026 Andres Felipe Bravo Navarro
