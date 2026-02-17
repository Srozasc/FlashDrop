# Pruebas Unitarias - Panel de Administración FlashDrop

## 📋 Descripción

Este directorio contiene un conjunto completo de pruebas unitarias para todas las secciones del panel de administración de FlashDrop, implementadas con **Vitest** y **React Testing Library**.

## 🚀 Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
pnpm install
```

## 🧪 Ejecutar Pruebas

### Modo Watch (Desarrollo)
Ejecuta las pruebas en modo watch, re-ejecutándolas automáticamente cuando cambies archivos:

```bash
pnpm test
```

### Ejecutar Una Vez
Ejecuta todas las pruebas una sola vez:

```bash
pnpm test:run
```

### Interfaz Visual
Abre una interfaz web interactiva para ver y ejecutar pruebas:

```bash
pnpm test:ui
```

### Cobertura de Código
Genera un reporte de cobertura de código:

```bash
pnpm test:coverage
```

El reporte se generará en `coverage/index.html`

## 📁 Estructura de Archivos

```
test/
├── setup.ts                      # Configuración global de Vitest
├── fixtures/
│   └── mockData.ts              # Datos de prueba (fixtures)
├── utils/
│   └── test-utils.tsx           # Utilidades de testing
└── unitarias/
    ├── Orders.test.tsx          # Pruebas de Gestión de Pedidos
    ├── Merchants.test.tsx       # Pruebas de Gestión de Comercios
    ├── Drivers.test.tsx         # Pruebas de Gestión de Repartidores
    ├── Users.test.tsx           # Pruebas de Gestión de Usuarios
    ├── Settings.test.tsx        # Pruebas de Configuración
    └── StatusBadge.test.tsx     # Pruebas del componente StatusBadge
```

## ✅ Cobertura de Pruebas

### Orders.test.tsx (30+ pruebas)
- ✓ Renderizado inicial y carga de datos
- ✓ Tarjetas de estadísticas (total, pendientes, en tránsito, entregados)
- ✓ Filtros por estado
- ✓ Búsqueda por ID, cliente y comercio
- ✓ Modal de detalle con información completa
- ✓ Manejo de errores

### Merchants.test.tsx (20+ pruebas)
- ✓ Renderizado y carga de comercios
- ✓ Estadísticas (total, aprobados, pendientes)
- ✓ Filtros por estado de aprobación
- ✓ Búsqueda por nombre y RUT
- ✓ Modal de detalle con estadísticas
- ✓ Aprobación de comercios

### Drivers.test.tsx (20+ pruebas)
- ✓ Renderizado y carga de repartidores
- ✓ Estadísticas (total, aprobados, disponibles)
- ✓ Filtros múltiples (aprobados, pendientes, disponibles)
- ✓ Búsqueda por nombre, teléfono y email
- ✓ Modal de detalle
- ✓ Aprobación y suspensión de repartidores

### Users.test.tsx (15+ pruebas)
- ✓ Renderizado y carga de usuarios
- ✓ Estadísticas (total, activos, nuevos del mes)
- ✓ Búsqueda por nombre, email y teléfono
- ✓ Modal con historial de pedidos
- ✓ Cálculo de total gastado
- ✓ Activar/desactivar usuarios

### Settings.test.tsx (15+ pruebas)
- ✓ Renderizado y carga de configuración
- ✓ Actualización de comisión
- ✓ Actualización de tarifa de delivery
- ✓ Toggles de métodos de pago
- ✓ Guardado de configuración
- ✓ Mensajes de éxito y error

### StatusBadge.test.tsx (15+ pruebas)
- ✓ Renderizado de todos los estados
- ✓ Colores correctos para cada estado
- ✓ Clases personalizadas
- ✓ Estructura HTML correcta

## 🛠️ Tecnologías Utilizadas

- **Vitest**: Framework de testing rápido y compatible con Vite
- **React Testing Library**: Utilidades para testing de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para aserciones DOM
- **@testing-library/user-event**: Simulación de interacciones de usuario
- **happy-dom**: Entorno DOM ligero para Node.js

## 📝 Escribir Nuevas Pruebas

### Ejemplo Básico

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import MiComponente from '@/pages/admin/MiComponente';

describe('MiComponente', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText('Título')).toBeInTheDocument();
  });

  it('debe manejar clics', async () => {
    const user = userEvent.setup();
    render(<MiComponente />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Clickeado')).toBeInTheDocument();
  });
});
```

### Mockear Servicios

```typescript
vi.mock('@/services/admin', () => ({
  adminService: {
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
  },
}));

// En la prueba
vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);
```

## 🎯 Objetivos de Cobertura

- **Líneas**: > 80%
- **Funciones**: > 80%
- **Ramas**: > 70%
- **Statements**: > 80%

## 🐛 Debugging

### Ver Output Detallado
```bash
pnpm test --reporter=verbose
```

### Ejecutar Prueba Específica
```bash
pnpm test Orders.test
```

### Modo Debug
```bash
pnpm test --inspect-brk
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)

## ⚠️ Notas Importantes

1. **Mocks de Supabase**: Todos los tests usan mocks de Supabase definidos en `test/setup.ts`
2. **Datos de Prueba**: Los fixtures están en `test/fixtures/mockData.ts`
3. **Utilidades**: Usa `render` de `@/test/utils/test-utils` para incluir providers automáticamente
4. **Async/Await**: Siempre usa `waitFor` para operaciones asíncronas

## 🔧 Solución de Problemas

### Error: "Cannot find module '@/...'"
- Verifica que `tsconfig.json` incluya el directorio `test`
- Asegúrate de que `vitest.config.ts` tenga el alias `@` configurado

### Tests Fallan con Timeout
- Aumenta el timeout en `vitest.config.ts`:
  ```typescript
  test: {
    testTimeout: 10000
  }
  ```

### Mocks No Funcionan
- Asegúrate de llamar `vi.clearAllMocks()` en `beforeEach`
- Verifica que el mock esté definido antes del import del componente
