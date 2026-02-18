# Changelog

Todas las cambios relevantes de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

---

## [Unreleased] — 2026-02-18

### ✨ Nuevas Funcionalidades

- **Pantalla de Inicio Mobile (HomeScreen)**: Se implementó una nueva pantalla de descubrimiento para la app móvil con diseño premium que incluye:
  - Buscador con placeholder dinámico ("¿Qué se te antoja hoy?")
  - Selector de ubicación con icono de mapa
  - Sección de **Historias/Ofertas** del día con scroll horizontal
  - Grid de **Categorías** (Restaurantes, Mercados, Farmacia, Mascotas, Licores, Tiendas)
  - **Filtros rápidos** (Envío Gratis, Menos de 30m, Mejor Valorados, Nuevos)
  - Sección de **Comercios Cercanos** con tarjetas que muestran rating, tiempo de entrega e imagen

- **Navegación Mobile con Tab Navigator**: Se creó `RootNavigator.tsx` con navegación por pestañas usando `@react-navigation/bottom-tabs`, integrando la nueva HomeScreen como pantalla principal.

- **Entorno de Testing Mobile (TDD)**: Se configuró un entorno de pruebas unitarias completo para la app Expo/React Native:
  - Instalación y configuración de `jest-expo`, `@testing-library/react-native`, `jest@29` y `react-test-renderer@19.1.0`
  - Configuración de `jest.config.js` compatible con **pnpm** (resuelto problema de symlinks con `.pnpm/`)
  - Configuración de `babel.config.js` con `babel-preset-expo`
  - **4 tests unitarios** para `HomeScreen` — todos pasando ✅

- **Task List de Mejoras Mobile** (`mobile/task.md`): Se creó una lista de tareas estructurada para el rediseño de la app con 5 bloques de trabajo pendientes.

### 🐛 Correcciones

- **Error `Property 'name' does not exist on type 'User'` en Dashboard del Comerciante**: El componente `Dashboard.tsx` intentaba acceder a `user.name`, pero el tipo `User` de Supabase Auth no contiene esa propiedad. Se corrigió extrayendo `profile` del hook `useAuth()` y usando `profile?.full_name` con fallback a la primera parte del email.

### 🔧 Mejoras Técnicas

- **Resolución de incompatibilidad Jest 30 ↔ jest-expo 54**: Se descubrió mediante análisis profundo (Sequential Thinking + Context7) que `jest@30.2.0` no es compatible con `jest-expo@54.0.17`. Se downgradeó a `jest@29.7.0`.

- **Resolución de incompatibilidad react-test-renderer**: Se alineó `react-test-renderer@19.1.0` con `react@19.1.0` para evitar el error de versiones no coincidentes.

- **Diagnóstico de caché corrupta de Jest**: Se identificó que Jest cacheaba resultados de transformación incorrectos tras múltiples cambios de configuración. Resuelto con `jest --clearCache` + `--no-cache`.

- **Documentación de patrón pnpm para transformIgnorePatterns**: Se documentó el patrón oficial de Expo para proyectos que usan pnpm:
  ```
  node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|...))
  ```

### 📁 Archivos Nuevos

| Archivo | Descripción |
|---------|-------------|
| `mobile/src/screens/HomeScreen.tsx` | Pantalla principal de descubrimiento con UI premium |
| `mobile/src/screens/__tests__/HomeScreen.test.tsx` | 4 tests unitarios para HomeScreen |
| `mobile/src/navigation/RootNavigator.tsx` | Navegador raíz con tab navigation |
| `mobile/jest.config.js` | Configuración de Jest para Expo + pnpm |
| `mobile/babel.config.js` | Configuración de Babel con preset de Expo |
| `mobile/task.md` | Lista de tareas para el rediseño mobile |
| `mobile/app.config.ts` | Configuración dinámica de Expo (reemplaza `app.json`) |
| `mobile/.env.example` | Variables de entorno de ejemplo para Supabase |
| `CHANGELOG.md` | Este archivo de registro de cambios |

### 📝 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/pages/merchant/Dashboard.tsx` | Usa `profile.full_name` en vez de `user.name` |
| `mobile/App.tsx` | Integra `SafeAreaProvider` y `RootNavigator` |
| `mobile/package.json` | Nuevas dependencias de testing y script `"test": "jest"` |

### 🧪 Estado de Tests

```
PASS src/screens/__tests__/HomeScreen.test.tsx (26.703 s)
  HomeScreen
    ✓ debe renderizar el buscador (18303 ms)
    ✓ debe mostrar las categorías principales (61 ms)
    ✓ debe mostrar la sección de comercios cercanos (51 ms)
    ✓ debe mostrar los filtros rápidos (93 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### 🔍 Análisis Técnico Destacado

**Problema de Jest + pnpm + React Native 0.81.5**: Se realizó un diagnóstico exhaustivo que involucró:

1. **Hipótesis 1** — `transformIgnorePatterns` incorrecto para pnpm → Descartada (el patrón ya incluía `.pnpm`)
2. **Hipótesis 2** — Incompatibilidad de versiones Jest 30 ↔ jest-expo 54 → **Confirmada parcialmente**
3. **Hipótesis 3** — Caché corrupta de Jest → **Confirmada como causa principal**
4. **Validación** — Se comprobó que `babel.transformSync()` podía transformar correctamente los archivos ESM de react-native, lo que descartó problemas de configuración de Babel
5. **Solución final** — Limpiar caché + usar Jest 29 + configuración mínima sin overrides innecesarios

---

*Generado automáticamente el 18 de febrero de 2026*
