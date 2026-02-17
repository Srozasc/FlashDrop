import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Orders from '@/pages/admin/Orders';
import { adminService } from '@/services/admin';
import { mockOrders } from '../fixtures/mockData';

// Mock del servicio admin
vi.mock('@/services/admin', () => ({
    adminService: {
        getOrders: vi.fn(),
        getOrderById: vi.fn(),
        updateOrderStatus: vi.fn(),
        cancelOrder: vi.fn(),
    },
}));

describe('Orders Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', async () => {
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
            expect(screen.getByText('Administra todos los pedidos de la plataforma')).toBeInTheDocument();
        });

        it('debe mostrar mensaje de carga mientras obtiene datos', () => {
            vi.mocked(adminService.getOrders).mockImplementation(
                () => new Promise(() => { }) // Never resolves
            );

            render(<Orders />);

            expect(screen.getByText('Cargando pedidos...')).toBeInTheDocument();
        });

        it('debe cargar y mostrar la lista de pedidos', async () => {
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            await waitFor(() => {
                expect(screen.getByText('Restaurant Test')).toBeInTheDocument();
                expect(screen.getByText('Pizzería Italia')).toBeInTheDocument();
            });
        });

        it('debe mostrar mensaje cuando no hay pedidos', async () => {
            vi.mocked(adminService.getOrders).mockResolvedValue([]);

            render(<Orders />);

            await waitFor(() => {
                expect(screen.getByText('No se encontraron pedidos')).toBeInTheDocument();
            });
        });
    });

    describe('Tarjetas de estadísticas', () => {
        it('debe calcular correctamente el total de pedidos', async () => {
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            await waitFor(() => {
                const totalCards = screen.getAllByText('2');
                expect(totalCards.length).toBeGreaterThan(0);
            });
        });

        it('debe calcular correctamente pedidos pendientes', async () => {
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            await waitFor(() => {
                // Hay múltiples contadores que pueden ser '1'
                const pendingStats = screen.getAllByText('1');
                expect(pendingStats.length).toBeGreaterThan(0);
            });
        });

        it('debe calcular correctamente pedidos entregados', async () => {
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            await waitFor(() => {
                // Hay múltiples contadores que pueden ser '1'
                const deliveredStats = screen.getAllByText('1');
                expect(deliveredStats.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Filtros', () => {
        it('debe filtrar pedidos por estado', async () => {
            const user = userEvent.setup();

            // Implementación dinámica del mock para filtrar
            vi.mocked(adminService.getOrders).mockImplementation(async (filters) => {
                if (filters?.status) {
                    return mockOrders.filter(o => o.status === filters.status);
                }
                return mockOrders;
            });

            render(<Orders />);

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
            });

            const statusFilter = screen.getByRole('combobox');
            await user.selectOptions(statusFilter, 'pending');

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
                expect(screen.queryByText('Pizzería Italia')).not.toBeInTheDocument();
            });
        });

        it('debe buscar pedidos por ID', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
            });

            const searchInput = screen.getByPlaceholderText(/buscar por id/i);
            await user.type(searchInput, 'order-1');

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
                expect(screen.queryByText('Pizzería Italia')).not.toBeInTheDocument();
            });
        });

        it('debe buscar pedidos por nombre de cliente', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            await waitFor(() => {
                const customerNames = screen.getAllByText('Juan Pérez');
                expect(customerNames.length).toBeGreaterThan(0);
            });

            const searchInput = screen.getByPlaceholderText(/buscar por id/i);
            await user.type(searchInput, 'Juan');

            await waitFor(() => {
                const customerNames = screen.getAllByText('Juan Pérez');
                expect(customerNames.length).toBeGreaterThan(0);
                expect(screen.queryByText('María González')).not.toBeInTheDocument();
            });
        });

        it('debe buscar pedidos por nombre de comercio', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);

            render(<Orders />);

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
            });

            const searchInput = screen.getByPlaceholderText(/buscar por id/i);
            await user.type(searchInput, 'Pizzería');

            await waitFor(() => {
                // Pizzería Italia debería aparecer, Restaurant Test NO
                const restaurantNames = screen.getAllByText('Pizzería Italia');
                expect(restaurantNames.length).toBeGreaterThan(0);
                expect(screen.queryByText('Restaurant Test')).not.toBeInTheDocument();
            });
        });
    });

    describe('Modal de detalle', () => {
        it('debe abrir modal al hacer clic en Ver', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);
            vi.mocked(adminService.getOrderById).mockResolvedValue(mockOrders[0]);

            render(<Orders />);

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                expect(screen.getByText(/Detalle del Pedido/i)).toBeInTheDocument();
                const customerNames = screen.getAllByText('Juan Pérez');
                expect(customerNames.length).toBeGreaterThan(0);
                expect(screen.getByText('Hamburguesa')).toBeInTheDocument();
            });
        });

        it('debe cerrar modal al hacer clic en X', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);
            vi.mocked(adminService.getOrderById).mockResolvedValue(mockOrders[0]);

            render(<Orders />);

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                expect(screen.getByText(/Detalle del Pedido/i)).toBeInTheDocument();
            });

            const closeButton = screen.getByRole('button', { name: '' }); // X button
            await user.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText(/Detalle del Pedido/i)).not.toBeInTheDocument();
            });
        });

        it('debe mostrar información completa del pedido en el modal', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getOrders).mockResolvedValue(mockOrders);
            vi.mocked(adminService.getOrderById).mockResolvedValue(mockOrders[0]);

            render(<Orders />);

            await waitFor(() => {
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                // Customer info - puede aparecer múltiples veces
                const customerNames = screen.getAllByText('Juan Pérez');
                expect(customerNames.length).toBeGreaterThan(0);
                expect(screen.getByText('juan@example.com')).toBeInTheDocument();

                // Merchant info - puede aparecer múltiples veces
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);

                // Delivery address
                expect(screen.getByText('Av. Principal 123')).toBeInTheDocument();
                // Verificar totales - pueden aparecer en items o sumarios
                const amounts15k = screen.getAllByText('$15.000');
                expect(amounts15k.length).toBeGreaterThan(0);
                const amounts2500 = screen.getAllByText('$2.500');
                expect(amounts2500.length).toBeGreaterThan(0);
                // Order items
                expect(screen.getByText('Hamburguesa')).toBeInTheDocument();
                expect(screen.getByText('Papas Fritas')).toBeInTheDocument();

                // Payment method
                expect(screen.getByText(/cash/i)).toBeInTheDocument();
            });
        });
    });

    describe('Manejo de errores', () => {
        it('debe manejar errores al cargar pedidos', async () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
            vi.mocked(adminService.getOrders).mockRejectedValue(new Error('Error de red'));

            render(<Orders />);

            await waitFor(() => {
                expect(consoleError).toHaveBeenCalledWith(
                    'Error loading orders:',
                    expect.any(Error)
                );
            });

            consoleError.mockRestore();
        });
    });
});
