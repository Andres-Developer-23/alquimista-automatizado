# Catálogo de Assets 3D para El Alquimista Automatizado

Última revisión: **2026-11-06**.
Criterio: priorizar modelos **Low Poly**, **GLB/GLTF/FBX**, y licencias **CC0** para el MVP. Los recursos **CC-BY** solo deben usarse si se incluye atribución en `CREDITS.md` o en los créditos del juego.

> Estado del catálogo: candidatos verificados para selección. Ningún asset ha sido descargado o integrado todavía en `public/` o `src/`.

## Recomendación ejecutiva

Para el MVP usa solo **CC0**:

1. Quaternius — Cauldron
2. Armory_3D — Magic Cauldron
3. Quaternius — Open Book
4. Quaternius — Potion Bottle
5. MiniPoly — Witch Broom
6. Kenney — Nature Kit
7. Kenney — Mini Characters

Deja los assets CC-BY para una segunda iteración, salvo que aporten algo imprescindible.

---

## 1. Assets CC0 recomendados

| Prioridad | Asset | Uso propuesto | Licencia y formato | Verificación |
|---:|---|---|---|---|
| 1 | [Quaternius — Cauldron](https://poly.pizza/m/QaWJOPa6Gt) | Caldero central del taller | Public Domain (CC0) · FBX/GLTF · 2022-07-11 | Página abierta y revisada |
| 1 | [Armory_3D — Magic Cauldron](https://poly.pizza/m/wKZzOYUXDM) | Caldero alternativo con estética mágica | Public Domain (CC0) · FBX/GLTF · 2023-03-13 | Página abierta y revisada |
| 1 | [Quaternius — Open Book](https://poly.pizza/m/FsCIGEfTEs) | Libro de recetas / objetivo de “leer” | Public Domain (CC0) · FBX/GLTF · 2021-08-26 · `Ultimate RPG Items Bundle` | Página abierta y revisada |
| 1 | [Quaternius — Potion Bottle](https://poly.pizza/m/7qbuf1TS8C) | Poción recolectable / entregable | Public Domain (CC0) · FBX/GLTF · 2021-08-26 · `Ultimate RPG Items Bundle` | Página abierta y revisada |
| 1 | [MiniPoly — Witch Broom](https://poly.pizza/m/gwE8397gO3) | Escoba del taller / decoración | Public Domain (CC0) · FBX/GLTF · 2024-05-25 | Página abierta y revisada |
| 2 | [Kenney — Nature Kit](https://kenney.nl/assets/nature-kit) | Árboles, rocas, arbustos, parcelas | CC0 · 330 archivos · categoría 3D · tags: nature, tree, rock, foliage | Página abierta y revisada |
| 2 | [Kenney — Mini Characters](https://kenney.nl/assets/mini-characters) | Personajes base / variantes de Gólem | CC0 · 25 archivos · animaciones · categoría 3D / Mini | Página abierta y revisada |
| 3 | [Kenney — Mini Dungeon](https://kenney.nl/assets/mini-dungeon) | Ambientación más oscura o mazmorra | CC0 · 30 archivos · animaciones · variación(es) | Página abierta y revisada |
| 4 | [Kenney — Modular Cave Kit](https://kenney.nl/assets/modular-cave-kit) | Cueva modular, poco alineado con el taller | CC0 · 40 archivos · variación(es) · tags: tiles, modular, cave | Página abierta y revisada |
| 4 | [Kenney — Mini Forest](https://kenney.nl/assets/mini-forest) | Área exterior o zona de prueba | CC0 · 20 archivos · animaciones · tags: forest, archer, tent, base | Página abierta y revisada |

### Bundle útil

- **Quaternius — Ultimate RPG Items Bundle**: incluye Open Book y Potion Bottle. Sirve como fuente de más objetos Low Poly (frascos, libros, herramientas, props mágicos), siempre que se revise cada archivo concreto antes de integrarlo.

## 2. Assets CC-BY usables con atribución

Estos assets pueden usarse si el proyecto incluye créditos visibles o en la documentación.

| Asset | Uso propuesto | Licencia y formato | Verificación |
|---|---|---|---|
| [Viktor_ — Low-poly cauldron](https://sketchfab.com/3d-models/low-poly-cauldron-9f79eddc955c418db77013370dcec099) | Caldero alternativo | CC Attribution · 2.9k triángulos · 1.5k vértices | Página abierta y revisada |
| [Poly by Google — Broom](https://poly.pizza/m/bzCi_ZLQPN4) | Escoba | CC Attribution · OBJ/GLTF · 2017-10-22 | Página abierta y revisada |
| [Poly by Google — Broom](https://poly.pizza/m/3CZnTJZTcRO) | Escoba variante | CC Attribution · OBJ/GLTF · 2017-10-22 | Página abierta y revisada |
| [Georg Bossenz — Spellbook](https://poly.pizza/m/bOlaFwTEGfX) | Libro de hechizos | CC Attribution · OBJ/GLTF · 2018-09-02 | Página abierta y revisada |

## 3. Assets descartados

| Asset | Motivo |
|---|---|
| [RachelC — Smoking Cauldron](https://sketchfab.com/3d-models/smoking-cauldron-56216e7ae645454ca2061c017d9678f5) | CC Attribution-NonCommercial. No apto para un MVP con uso comercial abierto o seguridad legal amplia. |

## 4. Decisión de uso por rol

### Gólem
- **MVP**: mantener o mejorar el Gólem cúbico actual con recolores/geometría simple.
- **Asset pack candidato**: Kenney — Mini Characters si se quiere silueta humanoide completa con animaciones.
- **Pendiente**: revisar escala, orientación, materiales y si el rig es compatible con R3F.

### Caldero
- Primera opción: **Quaternius — Cauldron**.
- Alternativa: **Armory_3D — Magic Cauldron**.
- Si se acepta atribución: **Viktor_ — Low-poly cauldron**.

### Ingredientes / recolectables
- **Quaternius — Potion Bottle**.
- Otros objetos del Ultimate RPG Items Bundle, revisados individualmente.

### Decoración del taller
- **Quaternius — Open Book**.
- **MiniPoly — Witch Broom**.
- **Kenney — Nature Kit** para rocas/plantas si hay exterior.
- **Kenney — Mini Dungeon** solo si el tono visual cambia hacia mazmorra.

## 5. Requisitos técnicos antes de integrar

1. Preferir **GLB/GLTF**. Si el pack viene en FBX/OBJ, convertir con Blender o usar un GLB ya incluido.
2. Mantener la escala del tablero lógico: coordenadas `x/y` de `-2..2` y rejilla visual 5×5.
3. Evitar assets con texturas pesadas o polígonos excesivos.
4. Usar `useGLTF` de `@react-three/drei` o `<primitive>` con un `Object3D` cargado con `GLTFLoader`.
5. Guardar assets en `public/models/` (o `src/assets/` si se desea fingerprinting con Vite) y referenciar rutas relativas compatibles con `base: '/alquimista-automatizado/'`.
6. Optimizar materiales y desactivar sombras costosas en objetos decorativos si el rendimiento sufre.
7. Toda licencia CC-BY debe figurar en `CREDITS.md` y, si aplica, en pantalla o documentación pública.

## 6. Proceso de verificación de licencia

Antes de integrar o distribuir:

1. Abrir la página del asset.
2. Confirmar autor, formato, licencia y fecha.
3. Si es **CC0**: usable sin atribución; igualmente listarlo en `CREDITS.md` como buena práctica.
4. Si es **CC-BY**: copiar autor y enlace exacto; añadir atribución obligatoria.
5. Si es **CC-BY-NC**, **Editorial Uses**, o “downloadable sin licencia clara”: no usar.
6. Registrar el resultado en `CREDITS.md`.
7. Si el asset se modifica, indicarlo no reemplaza la atribución; la licencia original sigue aplicando.

## 7. Catálogo recomendado para el próximo PR

```text
Gólem     -> Kenney Mini Characters o Gólem cúbico actual
Caldero   -> Quaternius Cauldron
Libro     -> Quaternius Open Book
Poción    -> Quaternius Potion Bottle
Escoba    -> MiniPoly Witch Broom
Decor     -> Kenney Nature Kit
```

## 8. Qué no asumir

- No todos los resultados de búsqueda con “downloadable” son descargables con uso comercial.
- No todos los CC-BY son equivalentes; revisar si piden enlace, nombre completo, licencia y enlace a licencia.
- No asumir que un bundle completo es CC0 solo porque un item lo es; verificar cada archivo.
- No mezclar Sketchfab sin revisar cada página.

## Referencias

- Kenney: <https://kenney.nl/assets>
- Poly.pizza: <https://poly.pizza/>
- Sketchfab: <https://sketchfab.com/>
- Licencias Creative Commons: <https://creativecommons.org/licenses/>