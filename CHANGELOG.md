# Changelog

Todas las cambios relevantes de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

---

## [Unreleased] — 2026-02-18

### ✨ Nuevas Funcionalidades

- **One-Tap Checkout (Bloque 2)**: Implementación de una experiencia de pago ultra-rápida:
  - Selección de direcciones de entrega preexistentes.
  - Gestión y selección de métodos de pago (Tarjetas, Efectivo).
  - Integración con `api.createOrder` y `api.createOrderItems` para procesamiento completo.
  - Pantalla de éxito premium con feedback visual claro.

- **Upselling Sugerido (Bloque 2)**: Algoritmo de recomendaciones inteligentes:
  - Sugerencias de productos del mismo comercio basados en popularidad.
  - Interfaz de carrusel horizontal con micro-interacciones para añadir al carrito.

- **Timeline Interactivo (Bloque 3)**: Seguimiento de pedido en tiempo real con estética premium:
  - Estados dinámicos: Pedido Recibido, En Preparación, En Camino, Entregado.
  - Sistema de *polling* automático cada 30 segundos para actualización de estado sin recarga.
  - Feedback visual del repartidor asignado con botón de contacto rápido.

- **Mapa 2.0 (Bloque 3)**: Rediseño completo del núcleo cartográfico:
  - Implementación de **Dark Mode Custom Map Style** para una estética moderna OLED.
  - Polilínea de ruta suavizada con curvaturas estéticas.
  - Marcadores personalizados (Comercio y Cliente) con iconos de Lucide.

- **Gamificación & Fidelización (Bloque 4)**: Nuevo sistema de niveles para el usuario:
  - Pantalla de perfil rediseñada con `GamificationCard`.
  - Niveles: **Bronce, Plata y Oro** con progresión visual.
  - Barra de progreso dinámica basada en puntos acumulados.

- **Gestión de Direcciones PRO (Bloque 4)**: Mejora en la administración de ubicaciones:
  - Soporte para **Alias Personalizados** (Casa, Trabajo, Gimnasio, etc.).
  - Selector de tipos de ubicación con iconos específicos.
  - Persistencia en Supabase mediante actualización de esquema.

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
| `mobile/src/screens/OrderDetailScreen.tsx` | Pantalla de seguimiento con Timeline Interactivo |
| `mobile/src/screens/__tests__/OrderDetailScreen.test.tsx` | Test unitarios para el seguimiento de pedido |
| `mobile/src/components/profile/GamificationCard.tsx` | Card de fidelización con niveles y puntos |
| `mobile/src/components/profile/__tests__/GamificationCard.test.tsx` | Test para el sistema de niveles |
| `mobile/src/components/profile/AddressItem.tsx` | Item de dirección con alias e iconos |
| `mobile/src/components/profile/__tests__/AddressItem.test.tsx` | Test para la gestión de direcciones |
| `mobile/src/components/UnifiedMap.native.tsx` | Actualización a Mapa 2.0 con Dark Mode |
| `mobile/task.md` | Lista de tareas actualizada al Bloque 4 |

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
