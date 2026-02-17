import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Users from '@/pages/admin/Users';
import { adminService } from '@/services/admin';
import { mockUsers, mockOrders } from '../fixtures/mockData';

// Mock del servicio admin
vi.mock('@/services/admin', () => ({
    adminService: {
        getUsers: vi.fn(),
        getUserById: vi.fn(),
        getUserOrders: vi.fn(),
        toggleUserStatus: vi.fn(),
    },
}));

describe('Users Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.alert = vi.fn();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', async () => {
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            render(<Users />);

            expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
            expect(screen.getByText('Administra los clientes de la plataforma')).toBeInTheDocument();
        });

        it('debe cargar y mostrar la lista de usuarios', async () => {
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
                expect(screen.getByText('María González')).toBeInTheDocument();
            });
        });
    });

    describe('Tarjetas de estadísticas', () => {
        it('debe calcular correctamente el total de usuarios', async () => {
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            render(<Users />);

            await waitFor(() => {
                const totalCards = screen.getAllByText('2');
                expect(totalCards.length).toBeGreaterThan(0);
            });
        });

        it('debe calcular correctamente usuarios activos', async () => {
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument(); // 1 active user
            });
        });
    });

    describe('Búsqueda', () => {
        it('debe buscar usuarios por nombre', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
            await user.type(searchInput, 'Juan');

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
                expect(screen.queryByText('María González')).not.toBeInTheDocument();
            });
        });

        it('debe buscar usuarios por email', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
            await user.type(searchInput, 'maria@example');

            await waitFor(() => {
                expect(screen.getByText('María González')).toBeInTheDocument();
                expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
            });
        });

        it('debe buscar usuarios por teléfono', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
            await user.type(searchInput, '56987654321');

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
                expect(screen.queryByText('María González')).not.toBeInTheDocument();
            });
        });
    });

    describe('Modal de detalle', () => {
        it('debe abrir modal al hacer clic en Ver', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);
            vi.mocked(adminService.getUserById).mockResolvedValue(mockUsers[0]);
            vi.mocked(adminService.getUserOrders).mockResolvedValue(mockOrders as any);

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                const emails = screen.getAllByText('juan@example.com');
                expect(emails.length).toBeGreaterThan(0);
            });
        });

        it('debe mostrar historial de pedidos en el modal', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);
            vi.mocked(adminService.getUserById).mockResolvedValue(mockUsers[0]);
            vi.mocked(adminService.getUserOrders).mockResolvedValue(mockOrders as any);

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                expect(screen.getByText('Últimos Pedidos')).toBeInTheDocument();
                const restaurantNames = screen.getAllByText('Restaurant Test');
                expect(restaurantNames.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Acciones de administración', () => {
        it('debe desactivar usuario activo', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);
            vi.mocked(adminService.getUserById).mockResolvedValue(mockUsers[0]);
            vi.mocked(adminService.getUserOrders).mockResolvedValue([]);
            vi.mocked(adminService.toggleUserStatus).mockResolvedValue({});

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                expect(screen.getByText('Desactivar Usuario')).toBeInTheDocument();
            });

            const deactivateButton = screen.getByText('Desactivar Usuario');
            await user.click(deactivateButton);

            await waitFor(() => {
                expect(adminService.toggleUserStatus).toHaveBeenCalledWith('user-1', false);
                expect(global.alert).toHaveBeenCalledWith('Usuario desactivado exitosamente');
            });
        });

        it('debe activar usuario inactivo', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);
            vi.mocked(adminService.getUserById).mockResolvedValue(mockUsers[1]);
            vi.mocked(adminService.getUserOrders).mockResolvedValue([]);
            vi.mocked(adminService.toggleUserStatus).mockResolvedValue({});

            render(<Users />);

            await waitFor(() => {
                expect(screen.getByText('María González')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[1]);

            await waitFor(() => {
                expect(screen.getByText('Activar Usuario')).toBeInTheDocument();
            });

            const activateButton = screen.getByText('Activar Usuario');
            await user.click(activateButton);

            await waitFor(() => {
                expect(adminService.toggleUserStatus).toHaveBeenCalledWith('user-2', true);
                expect(global.alert).toHaveBeenCalledWith('Usuario activado exitosamente');
            });
        });
    });
});
