# Changelog

Todas las cambios relevantes de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

---

## [Unreleased] — 2026-02-18

### ✨ Nuevas Funcionalidades

- **Skeleton Loaders Premium (Bloque 2)**: Se implementó un sistema de carga progresiva para mejorar el performance percibido:
  - Componente base `Skeleton.tsx` con animación pulsante de opacidad.
  - Componente `MerchantCardSkeleton.tsx` que replica la estructura de las tarjetas de comercios.
  - Integración en `HomeScreen` con estado de carga simulado (2s).

- **Smart Cart Modal (Bloque 2)**: Implementación de un gestor de carrito tipo Bottom Sheet:
  - Diseño premium con áreas de descarte y micro-animaciones nativas.
  - Integración con `CartContext` para listado, modificación de cantidades y eliminación de productos.
  - Botón flotante inteligente en la `HomeScreen` con contador en tiempo real y acceso rápido.

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
  - **11 tests unitarios** totales para `HomeScreen`, `Skeleton` y `SmartCartModal` — todos pasando ✅

- **Task List de Mejoras Mobile** (`mobile/task.md`): Se creó una lista de tareas estructurada para el rediseño de la app con 5 bloques de trabajo. Los bloques 1 y 2 están actualmente en progreso/completado parcial.

### 🐛 Correcciones

- **Error `Property 'name' does not exist on type 'User'` en Dashboard del Comerciante**: El componente `Dashboard.tsx` intentaba acceder a `user.name`, pero el tipo `User` de Supabase Auth no contiene esa propiedad. Se corrigió extrayendo `profile` del hook `useAuth()` y usando `profile?.full_name` con fallback a la primera parte del email.
- **Ruta de importación en SmartCartModal**: Se corrigió la ruta de `../../constants/Colors` a `../../../constants/Colors`.

### 🔧 Mejoras Técnicas

- **Resolución de incompatibilidad Jest 30 ↔ jest-expo 54**: Se descubrió mediante análisis profundo (Sequential Thinking + Context7) que `jest@30.2.0` no es compatible con `jest-expo@54.0.17`. Se downgradeó a `jest@29.7.0`.
- **Refactor de Tests**: Se actualizó el uso de `toContainEqual` por `toMatchObject` en los tests de componentes para mayor robustez ante objetos de estilo aplanados.

### 📁 Archivos Nuevos

| Archivo | Descripción |
|---------|-------------|
| `mobile/src/components/common/Skeleton.tsx` | Componente base de skeleton animado |
| `mobile/src/components/common/MerchantCardSkeleton.tsx` | Placeholder para tarjetas de comercios |
| `mobile/src/components/cart/SmartCartModal.tsx` | Modal Bottom-Sheet para gestión de carrito |
| `mobile/src/components/cart/__tests__/SmartCartModal.test.tsx` | 4 tests para el modal del carrito |
| `mobile/src/components/common/__tests__/Skeleton.test.tsx` | 3 tests para el sistema de skeletons |
| `mobile/src/screens/HomeScreen.tsx` | Pantalla principal con integración de skeletons y carrito |
| `mobile/src/navigation/RootNavigator.tsx` | Navegador raíz con tab navigation |
| `mobile/task.md` | Lista de tareas para el rediseño mobile |

### 📝 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `mobile/src/screens/HomeScreen.tsx` | Integra skeletons, carga simulada y botón de carrito |
| `mobile/task.md` | Actualizado estado de tareas completadas |
| `src/pages/merchant/Dashboard.tsx` | Usa `profile.full_name` en vez de `user.name` |
| `mobile/App.tsx` | Integra `SafeAreaProvider` y `RootNavigator` |

### 🧪 Estado de Tests

```
PASS  mobile/src/screens/__tests__/HomeScreen.test.tsx
  HomeScreen
    ✓ debe renderizar el buscador
    ✓ debe mostrar las categorías principales
    ✓ debe mostrar la sección de comercios cercanos
    ✓ debe mostrar los filtros rápidos

PASS  mobile/src/components/common/__tests__/Skeleton.test.tsx
  Skeleton Component
    ✓ debe renderizar con las dimensiones proporcionadas
    ✓ debe soportar la variante circular
    ✓ debe aplicar un color de fondo por defecto

PASS  mobile/src/components/cart/__tests__/SmartCartModal.test.tsx
  SmartCartModal Component
    ✓ debe mostrar la lista de productos y el total
    ✓ debe llamar a changeQty al presionar botones de cantidad
    ✓ debe llamar a remove al presionar el icono de basura
    ✓ debe mostrar mensaje de carrito vacio

Test Suites: 3 passed, 3 total
Tests:       11 passed, 11 total
```

---

*Generado automáticamente el 18 de febrero de 2026*
