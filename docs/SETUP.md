# Setup y despliegue

## Requisitos

- Node.js 22 o superior.
- npm 10 o superior.
- Conexión a internet para cargar Pyodide desde el CDN.
- Git y, opcionalmente, GitHub CLI (`gh`).

## Instalación local

```bash
git clone https://github.com/Andres-Developer-23/alquimista-automatizado.git
cd alquimista-automatizado
npm ci
npm run dev
```

La aplicación se sirve bajo el `base` configurado:

```text
http://localhost:5173/alquimista-automatizado/
```

Si se cambia el nombre del repositorio, actualizar `base` en `vite.config.js` y `homepage` en `package.json`.

## Variables de entorno

El MVP no requiere variables de entorno. Si en el futuro se agregan, usar `.env.local` y documentar las claves en `.env.example`. Nunca commitear secretos.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | ESLint sobre todo el proyecto |
| `npm test` | Tests con Vitest |
| `npm run test:watch` | Tests en modo interactivo |

## Validación antes de un PR

```bash
npm run lint
npm test
npm run build
```

El CI ejecuta exactamente estos tres pasos.

## Despliegue en GitHub Pages

### 1. Configurar el repositorio

En GitHub:

1. Ir a **Settings → Pages**.
2. En **Build and deployment**, seleccionar **GitHub Actions**.

El workflow `.github/workflows/deploy-pages.yml` se encarga del resto al hacer push a `main`.

### 2. Verificar la base de Vite

`vite.config.js` debe tener:

```js
base: '/alquimista-automatizado/'
```

La URL resultante será:

```text
https://<usuario>.github.io/alquimista-automatizado/
```

### 3. Hacer push a main

```bash
git checkout main
git pull
git push origin main
```

Consultar el progreso en la pestaña **Actions**.

## Solución de problemas

### El Worker no inicializa

- Verificar que el CDN de Pyodide sea accesible: `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js`.
- Revisar la consola del navegador y la pestaña Network.
- Confirmar que `pythonWorker.js` se está empaquetando (debe aparecer un asset `pythonWorker-*.js` en `dist/assets/`).

### La app carga en blanco en GitHub Pages

- Revisar que `base` coincida exactamente con el nombre del repositorio.
- Confirmar que el workflow de Pages terminó correctamente.
- Probar `npm run build && npm run preview`.

### Monaco no aparece

- Monaco se carga mediante el loader de `@monaco-editor/react`; requiere red.
- Revisar bloqueos de CDN o extensiones del navegador.

### Error de Pyodide por versión

La versión está fijada en `src/workers/pythonWorker.js`. Si se actualiza, cambiar también la URL del CDN y probar:

```text
https://cdn.jsdelivr.net/pyodide/vX.Y.Z/full/pyodide.js
```

### Tests fallan por `matchMedia` o WebGL

Los tests actuales solo cubren lógica pura. Para tests de componentes 3D se necesitará mockear `Canvas` o usar `@react-three/test-renderer` en una fase posterior.

## Estructura de ramas

- `main`: siempre desplegable.
- `feat/<issue>-<slug>`: funcionalidades.
- `fix/<issue>-<slug>`: correcciones.
- `docs/<slug>`: documentación.
- `chore/<slug>`: mantenimiento.

Ver [CONTRIBUTING.md](../CONTRIBUTING.md).
