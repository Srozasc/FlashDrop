# Changelog

Todas las cambios relevantes de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

---

## [Unreleased] — 2026-02-18

### ✨ Nuevas Funcionalidades

- **Dark Mode Nativo OLED (Bloque 4)**: Soporte completo para tema oscuro implementado con TDD:
  - Hook `useTheme`: detecta automáticamente la preferencia del sistema (`light`/`dark`) y expone `{ theme, colors, isDark }`.
  - Componente `ThemedText`: texto que adapta su color al tema activo sin configuración adicional.
  - Componente `ThemedView`: contenedor con fondo adaptativo — usa **negro puro `#000000`** en modo oscuro para optimizar el consumo de batería en pantallas OLED.
  - Soporte para colores personalizados por tema mediante props `lightColor` / `darkColor`.

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

- **Deduplicación de Datos con React Query (Bloque 5)**: Integración de `@tanstack/react-query` para navegación instantánea:
  - Hook `useMerchants` con caché inteligente (`staleTime: 5min`, `gcTime: 30min`).
  - `HomeScreen` sincronizada con datos reales de Supabase.
  - Resolución de conflictos de versiones forzando React 19 vía `pnpm overrides`.

- **Carga Progresiva de Imágenes (Bloque 5)**: Componente `BlurImage` con efecto fade:
  - Elimina el parpadeo de imágenes al navegar entre pantallas.
  - Mejora el LCP (Largest Contentful Paint) percibido.

- **Pantalla de Inicio Mobile (HomeScreen)**: Pantalla de descubrimiento con diseño premium:
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

### 🐛 Correcciones

- **Sincronización Crítica de Base de Datos**: Ejecución de migraciones para alinear el esquema de Supabase con el código de la App:
  - Añadidas columnas `points` y `level` a la tabla `users` para el sistema de fidelización.
  - Añadida columna `image_url` a `merchants` para visualización de logotipos.
  - Creada tabla `payment_methods` con soporte RLS (corrigiendo error 404/400 en Checkout).
  - Corregida discrepancia de nombres en `addresses` (de `location_type` a `type`).
- **Error JSON / HTML (SyntaxError: Unexpected token '<')**: Resuelto creando el archivo `.env` en la carpeta `mobile` con las credenciales de Supabase, evitando peticiones a URLs vacías que devolvían el `index.html`.
- **Placeholder IMGs (DNS Error)**: Se reemplazaron todas las llamadas a `via.placeholder.com` (fuera de servicio) por URLs de **Unsplash** de alta resolución en `HomeScreen`, `ProductsScreen` y `SmartCartModal`.
- **Rutas de importación en Metro**: Corregidos errores "Unable to resolve" en las pantallas del conductor (`DashboardScreen.tsx`, `OrdersScreen.tsx`, `DeliveryDetailScreen.tsx`) ajustando los niveles de profundidad en los imports de `Colors` y `AuthContext`.
- **Error `Property 'name' does not exist on type 'User'` en Dashboard del Comerciante**: Corregido usando `profile?.full_name`.
- **Solapamiento de UI con TabBar Flotante**: Corregido el problema donde la barra de navegación inferior tapaba botones y contenido esencial:
  - Implementación de `paddingBottom` dinámico usando `useSafeAreaInsets` en las pantallas `HomeScreen`, `ProfileScreen`, `AddressesScreen`, `CheckoutScreen`, `DashboardScreen` y `OrdersScreen`.
  - Resolución de `ReferenceError: insets is not defined` en `DashboardScreen.tsx` moviendo los estilos dinámicos al cuerpo del componente.

### 🔧 Mejoras Técnicas

- **Resolución de incompatibilidad Jest 30 ↔ jest-expo 54**: Downgrade a `jest@29.7.0` tras análisis sistemático.
- **Limpieza de Caché de Metro**: Implementada rutina `npx expo start --web --clear` para asegurar la carga de nuevas variables de entorno.

### 📁 Archivos Nuevos

| Archivo | Descripción |
|---------|-------------|
| `mobile/.env` | Configuración de variables de entorno para el proyecto móvil |
| `mobile/src/hooks/useTheme.ts` | Hook centralizado para detección de tema del sistema |
| `mobile/src/components/common/ThemedText.tsx` | Texto adaptativo al tema activo |
| `mobile/src/components/common/ThemedView.tsx` | Contenedor adaptativo con fondo OLED |
| `mobile/src/hooks/useMerchants.ts` | Hook React Query para obtener comercios con caché |
| `mobile/src/components/common/BlurImage.tsx` | Imagen con carga progresiva y efecto fade |

### 🧪 Estado de Tests FINAL

```
PASS  src/components/common/__tests__/ThemedText.test.tsx
PASS  src/components/common/__tests__/ThemedView.test.tsx
PASS  src/hooks/__tests__/useTheme.test.tsx
PASS  src/hooks/__tests__/useMerchants.test.tsx
PASS  src/screens/__tests__/HomeScreen.test.tsx
PASS  src/components/profile/__tests__/GamificationCard.test.tsx
PASS  src/components/cart/__tests__/SmartCartModal.test.tsx
PASS  src/components/cart/__tests__/Upselling.test.tsx
PASS  src/screens/__tests__/CheckoutScreen.test.tsx

Test Suites: 9 passed, 9 total
Tests:       23 passed, 23 total
```

---

*Generado automáticamente el 18 de febrero de 2026*
