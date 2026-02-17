import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Merchants from '@/pages/admin/Merchants';
import { adminService } from '@/services/admin';
import { mockMerchants } from '../fixtures/mockData';

vi.mock('@/services/admin', () => ({
    adminService: {
        getMerchants: vi.fn(),
        getMerchantById: vi.fn(),
        getMerchantStats: vi.fn(),
        approveMerchant: vi.fn(),
    },
}));

describe('Merchants Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.alert = vi.fn();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', async () => {
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            expect(screen.getByText('Gestión de Comercios')).toBeInTheDocument();
            expect(screen.getByText('Administra los comercios de la plataforma')).toBeInTheDocument();
        });

        it('debe cargar y mostrar la lista de comercios', async () => {
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('Restaurant Test')).toBeInTheDocument();
                expect(screen.getByText('Pizzería Italia')).toBeInTheDocument();
            });
        });

        it('debe mostrar mensaje cuando no hay comercios', async () => {
            vi.mocked(adminService.getMerchants).mockResolvedValue([]);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('No se encontraron comercios')).toBeInTheDocument();
            });
        });
    });

    describe('Tarjetas de estadísticas', () => {
        it('debe calcular correctamente el total de comercios', async () => {
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('2')).toBeInTheDocument();
            });
        });

        it('debe calcular correctamente comercios aprobados', async () => {
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                const approvedStats = screen.getAllByText('1');
                expect(approvedStats.length).toBeGreaterThan(0); // 1 approved
            });
        });

        it('debe calcular correctamente comercios pendientes', async () => {
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                const pendingStats = screen.getAllByText('1');
                expect(pendingStats.length).toBeGreaterThan(0); // 1 pending
            });
        });
    });

    describe('Filtros', () => {
        it('debe filtrar comercios aprobados', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('Restaurant Test')).toBeInTheDocument();
            });

            const statusFilter = screen.getByRole('combobox');
            await user.selectOptions(statusFilter, 'approved');

            await waitFor(() => {
                expect(screen.getByText('Restaurant Test')).toBeInTheDocument();
                expect(screen.queryByText('Pizzería Italia')).not.toBeInTheDocument();
            });
        });

        it('debe filtrar comercios pendientes', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('Pizzería Italia')).toBeInTheDocument();
            });

            const statusFilter = screen.getByRole('combobox');
            await user.selectOptions(statusFilter, 'pending');

            await waitFor(() => {
                expect(screen.getByText('Pizzería Italia')).toBeInTheDocument();
                expect(screen.queryByText('Restaurant Test')).not.toBeInTheDocument();
            });
        });

        it('debe buscar comercios por nombre', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('Restaurant Test')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
            await user.type(searchInput, 'Pizzería');

            await waitFor(() => {
                expect(screen.getByText('Pizzería Italia')).toBeInTheDocument();
                expect(screen.queryByText('Restaurant Test')).not.toBeInTheDocument();
            });
        });

        it('debe buscar comercios por RUT', async () => {
            const user = userEvent.setup();
            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('12345678-9')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
            await user.type(searchInput, '12345678');

            await waitFor(() => {
                expect(screen.getByText('Restaurant Test')).toBeInTheDocument();
                expect(screen.queryByText('Pizzería Italia')).not.toBeInTheDocument();
            });
        });
    });

    describe('Modal de detalle', () => {
        it('debe abrir modal al hacer clic en Ver', async () => {
            const user = userEvent.setup();
            const mockStats = {
                totalOrders: 50,
                deliveredOrders: 45,
                totalRevenue: 500000,
            };

            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);
            vi.mocked(adminService.getMerchantById).mockResolvedValue(mockMerchants[0]);
            vi.mocked(adminService.getMerchantStats).mockResolvedValue(mockStats);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('Restaurant Test')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[0]);

            await waitFor(() => {
                // Elementos duplicados en tabla y modal
                const names = screen.getAllByText('Restaurant Test');
                expect(names.length).toBeGreaterThan(0);
                const orders = screen.getAllByText('50');
                expect(orders.length).toBeGreaterThan(0); // totalOrders
            });
        });

        it('debe mostrar botón de aprobar para comercios pendientes', async () => {
            const user = userEvent.setup();
            const mockStats = {
                totalOrders: 0,
                deliveredOrders: 0,
                totalRevenue: 0,
            };

            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);
            vi.mocked(adminService.getMerchantById).mockResolvedValue(mockMerchants[1]);
            vi.mocked(adminService.getMerchantStats).mockResolvedValue(mockStats);

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('Pizzería Italia')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[1]);

            await waitFor(() => {
                expect(screen.getByText('Aprobar Comercio')).toBeInTheDocument();
            });
        });
    });

    describe('Aprobación de comercios', () => {
        it('debe aprobar comercio correctamente', async () => {
            const user = userEvent.setup();
            const mockStats = {
                totalOrders: 0,
                deliveredOrders: 0,
                totalRevenue: 0,
            };

            vi.mocked(adminService.getMerchants).mockResolvedValue(mockMerchants);
            vi.mocked(adminService.getMerchantById).mockResolvedValue(mockMerchants[1]);
            vi.mocked(adminService.getMerchantStats).mockResolvedValue(mockStats);
            vi.mocked(adminService.approveMerchant).mockResolvedValue({});

            render(<Merchants />);

            await waitFor(() => {
                expect(screen.getByText('Pizzería Italia')).toBeInTheDocument();
            });

            const viewButtons = screen.getAllByText('Ver');
            await user.click(viewButtons[1]);

            await waitFor(() => {
                expect(screen.getByText('Aprobar Comercio')).toBeInTheDocument();
            });

            const approveButton = screen.getByText('Aprobar Comercio');
            await user.click(approveButton);

            await waitFor(() => {
                expect(adminService.approveMerchant).toHaveBeenCalledWith('merchant-2');
                expect(global.alert).toHaveBeenCalledWith('Comercio aprobado exitosamente');
            });
        });
    });
});
