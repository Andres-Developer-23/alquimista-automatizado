# Guía de contribución

Gracias por querer mejorar El Alquimista Automatizado. Esta guía describe el flujo de trabajo para mantener el repositorio ordenado y fácil de revisar.

## Código de conducta

Todas las contribuciones deben respetar [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Antes de empezar

1. Revisar los issues abiertos y el [roadmap](docs/ROADMAP.md).
2. Si el cambio es grande, abrir un issue o comentar el existente antes de escribir código.
3. Confirmar que el cambio entra en el alcance del MVP o de la fase actual.

## Configuración del entorno

```bash
git clone https://github.com/Andres-Developer-23/alquimista-automatizado.git
cd alquimista-automatizado
npm ci
npm run dev
```

Validar antes de abrir un PR:

```bash
npm run lint
npm test
npm run build
```

## Estrategia de ramas

Se usa **GitHub Flow**: `main` siempre debe estar desplegable.

| Tipo | Patrón | Ejemplo |
| --- | --- | --- |
| Funcionalidad | `feat/<issue>-<slug>` | `feat/12-tick-engine` |
| Corrección | `fix/<issue>-<slug>` | `fix/18-worker-error` |
| Documentación | `docs/<slug>` | `docs/architecture` |
| Mantenimiento | `chore/<slug>` | `chore/update-deps` |

Reglas:

- Crear la rama desde `main` actualizado.
- Mantener la rama enfocada en un solo cambio.
- No hacer merge commits locales innecesarios; el merge final se hace por squash.
- Eliminar la rama remota después del merge.

## Commits

Se usa [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(<alcance>): <descripción>
```

Tipos permitidos:

- `feat`: nueva funcionalidad.
- `fix`: corrección de bug.
- `docs`: documentación.
- `test`: tests.
- `chore`: mantenimiento, dependencias, configuración.
- `refactor`: cambio interno sin alterar comportamiento.
- `perf`: mejora de rendimiento.
- `ci`: workflows.

Ejemplos:

```text
feat(scene): add 5x5 grid and golem placeholder
fix(worker): return structured errors from pyodide
docs(architecture): document action queue contract
ci(pages): deploy dist on main
```

## Pull requests

Antes de abrir un PR:

- [ ] La rama sigue la convención.
- [ ] Los commits son convencionales.
- [ ] El PR explica el problema y la solución.
- [ ] Se actualizaron docs si cambió el comportamiento.
- [ ] Se agregaron o actualizaron tests.
- [ ] `npm run lint` pasa.
- [ ] `npm test` pasa.
- [ ] `npm run build` pasa.
- [ ] No se agregaron dependencias innecesarias.
- [ ] No se incluyeron secretos ni datos personales.

El PR debe incluir:

- Contexto del cambio.
- Cómo probarlo.
- Capturas si afecta la UI.
- Issues relacionadas (`Closes #123`).

## Definition of Done

Una tarea está terminada cuando:

1. El comportamiento está implementado.
2. Tiene tests o una justificación explícita de por qué no los necesita.
3. No rompe lint ni build.
4. Está documentado si cambia el contrato o la arquitectura.
5. Fue revisado en un PR.
6. Está desplegado en `main` si aplica.

## Estilo de código

- JavaScript moderno con módulos ES.
- Componentes React en PascalCase.
- Hooks con prefijo `use`.
- Archivos de lógica en camelCase.
- Evitar lógica de negocio dentro de componentes visuales.
- Preferir funciones puras para el motor del juego.
- No usar `time.sleep` ni esperas bloqueantes en Python.
- Comentarios solo para explicar decisiones no evidentes.

## Tests

- Unitarios: `tests/engine/`.
- Componentes: futuros `tests/components/`.
- Integración: futuros `tests/integration/`.

Se usa Vitest. Los tests no deben depender de red ni de WebGL.

## Documentación

Actualizar según el cambio:

- `README.md` para cambios visibles al usuario.
- `docs/ARCHITECTURE.md` para cambios de flujo o contrato.
- `docs/ROADMAP.md` para cambios de alcance.
- `CHANGELOG.md` para cambios relevantes.
- Un ADR nuevo en `docs/adr/` para decisiones arquitectónicas importantes.

## Reportar bugs

Usar la plantilla de bug report e incluir:

- Pasos para reproducir.
- Resultado esperado y actual.
- Navegador y sistema operativo.
- Capturas o errores de consola.
- Versión del proyecto.

## Seguridad

No abrir issues públicos para vulnerabilidades. Seguir [SECURITY.md](SECURITY.md).
