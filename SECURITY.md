# Política de seguridad

## Versiones soportadas

El proyecto está en fase MVP. Solo la rama `main` recibe correcciones de seguridad.

| Versión | Soportada |
| --- | --- |
| `main` | Sí |
| Releases anteriores | No |

## Cómo reportar una vulnerabilidad

No abras un issue público para vulnerabilidades.

Usa **GitHub Security Advisories**:

1. Ir a la pestaña **Security** del repositorio.
2. Seleccionar **Report a vulnerability**.
3. Describir el problema, el impacto y los pasos para reproducirlo.

Si no puedes usar Security Advisories, contacta al mantenedor mediante el correo público del perfil de GitHub.

Incluye:

- Versión o commit afectado.
- Navegador y sistema operativo.
- Pasos para reproducir.
- Impacto esperado.
- Posible mitigación.

## Alcance

Se consideran vulnerabilidades:

- Ejecución de código fuera del contexto esperado del jugador.
- Exposición de secretos o datos personales.
- XSS en la interfaz.
- Manipulación de dependencias.
- Denegación de servicio trivial desde la UI.

## Consideraciones sobre Pyodide

Pyodide se ejecuta en un Web Worker para evitar bloquear la UI, **no** como un sandbox de seguridad completo. El código Python del jugador se ejecuta con los privilegios del navegador dentro del worker.

Por eso:

- No se debe cargar código de terceros no confiables.
- No se deben exponer APIs privilegiadas al entorno Python.
- En el futuro se debe evaluar un timeout y un reinicio del Worker para código que consuma CPU de forma excesiva.

## Tiempos de respuesta

- Confirmación de recepción: 7 días.
- Evaluación inicial: 14 días.
- Corrección o mitigación: según severidad, con objetivo de 30 días para problemas críticos.

## Buenas prácticas para contribuidores

- No commitear tokens, claves ni archivos `.env`.
- Revisar `npm audit` antes de releases.
- No agregar dependencias sin justificar su necesidad.
- Mantener actualizado Dependabot.
