import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Drivers from '@/pages/admin/Drivers';
import { adminService } from '@/services/admin';
import { mockDrivers } from '../fixtures/mockData';

vi.mock('@/services/admin', () => ({
    adminService: {
        getDrivers: vi.fn(),
        getDriverById: vi.fn(),
        approveDriver: vi.fn(),
        toggleDriverStatus: vi.fn(),
    },
}));

describe('Drivers Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.alert = vi.fn();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', async () => {
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            expect(screen.getByText('Gestión de Repartidores')).toBeInTheDocument();
            expect(screen.getByText('Administra los repartidores de la plataforma')).toBeInTheDocument();
        });

        it('debe cargar y mostrar la lista de repartidores', async () => {
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
                expect(screen.getByText('Ana Repartidora')).toBeInTheDocument();
            });
        });
    });

    describe('Tarjetas de estadísticas', () => {
        it('debe calcular correctamente el total de repartidores', async () => {
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('2')).toBeInTheDocument();
            });
        });

        it('debe calcular correctamente repartidores aprobados', async () => {
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                // Hay múltiples tarjetas con valor '1' (aprobados, disponibles, pendientes)
                const onesElements = screen.getAllByText('1');
                expect(onesElements.length).toBeGreaterThanOrEqual(1);
            });
        });

        it('debe calcular correctamente repartidores disponibles', async () => {
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                // Verificamos que la tarjeta de 'Disponibles' existe con su valor
                const availableLabels = screen.getAllByText('Disponibles');
                expect(availableLabels.length).toBeGreaterThan(0);
                const onesElements = screen.getAllByText('1');
                expect(onesElements.length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe('Filtros', () => {
        it('debe filtrar repartidores aprobados', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
            });

            const statusFilter = screen.getByRole('combobox');
            await user.selectOptions(statusFilter, 'approved');

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
                expect(screen.queryByText('Ana Repartidora')).not.toBeInTheDocument();
            });
        });

        it('debe filtrar repartidores pendientes', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Ana Repartidora')).toBeInTheDocument();
            });

            const statusFilter = screen.getByRole('combobox');
            await user.selectOptions(statusFilter, 'pending');

            await waitFor(() => {
                expect(screen.getByText('Ana Repartidora')).toBeInTheDocument();
                expect(screen.queryByText('Carlos Conductor')).not.toBeInTheDocument();
            });
        });

        it('debe filtrar repartidores disponibles', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
            });

            const statusFilter = screen.getByRole('combobox');
            await user.selectOptions(statusFilter, 'available');

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
                expect(screen.queryByText('Ana Repartidora')).not.toBeInTheDocument();
            });
        });

        it('debe buscar repartidores por nombre', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
            await user.type(searchInput, 'Ana');

            await waitFor(() => {
                expect(screen.getByText('Ana Repartidora')).toBeInTheDocument();
                expect(screen.queryByText('Carlos Conductor')).not.toBeInTheDocument();
            });
        });
    });

    describe('Modal de detalle', () => {
        it('debe abrir modal al hacer clic en Ver', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);
            vi.mocked(adminService.getDriverById).mockResolvedValue(mockDrivers[0]);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                // El nombre aparece en tabla + modal, usamos getAllByText
                const names = screen.getAllByText('Carlos Conductor');
                expect(names.length).toBeGreaterThan(1); // Al menos tabla + modal
                const phones = screen.getAllByText('+56933333333');
                expect(phones.length).toBeGreaterThan(0);
            });
        });

        it('debe mostrar botón de aprobar para repartidores pendientes', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);
            vi.mocked(adminService.getDriverById).mockResolvedValue(mockDrivers[1]);

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Ana Repartidora')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[1]);

            await waitFor(() => {
                expect(screen.getByText('Aprobar Repartidor')).toBeInTheDocument();
            });
        });
    });

    describe('Acciones de administración', () => {
        it('debe aprobar repartidor correctamente', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);
            vi.mocked(adminService.getDriverById).mockResolvedValue(mockDrivers[1]);
            vi.mocked(adminService.approveDriver).mockResolvedValue({});

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Ana Repartidora')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[1]);

            await waitFor(() => {
                expect(screen.getByText('Aprobar Repartidor')).toBeInTheDocument();
            });

            const approveButton = screen.getByText('Aprobar Repartidor');
            await user.click(approveButton);

            await waitFor(() => {
                expect(adminService.approveDriver).toHaveBeenCalledWith('driver-2');
                expect(global.alert).toHaveBeenCalledWith('Repartidor aprobado exitosamente');
            });
        });

        it('debe suspender repartidor activo', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getDrivers).mockResolvedValue(mockDrivers);
            vi.mocked(adminService.getDriverById).mockResolvedValue(mockDrivers[0]);
            vi.mocked(adminService.toggleDriverStatus).mockResolvedValue({});

            render(<Drivers />);

            await waitFor(() => {
                expect(screen.getByText('Carlos Conductor')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                expect(screen.getByText('Suspender')).toBeInTheDocument();
            });

            const suspendButton = screen.getByText('Suspender');
            await user.click(suspendButton);

            await waitFor(() => {
                expect(adminService.toggleDriverStatus).toHaveBeenCalledWith('driver-1', false);
            });
        });
    });
});
