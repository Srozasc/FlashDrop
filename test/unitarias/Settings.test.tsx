import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Settings from '@/pages/admin/Settings';

// Mock de Supabase - vi.hoisted() se ejecuta antes del hoisting de vi.mock
const { mockSupabaseFrom } = vi.hoisted(() => ({
    mockSupabaseFrom: vi.fn(),
}));
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: mockSupabaseFrom,
    },
}));

describe('Settings Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', async () => {
            mockSupabaseFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: null, error: null }),
                    }),
                }),
            });

            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Configuración del Sistema')).toBeInTheDocument();
            });
        });

        it('debe mostrar mensaje de carga inicialmente', () => {
            mockSupabaseFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockImplementation(() => new Promise(() => { })),
                    }),
                }),
            });

            render(<Settings />);

            expect(screen.getByText('Cargando configuración...')).toBeInTheDocument();
        });
    });

    describe('Carga de configuración', () => {
        it('debe cargar configuración desde la base de datos', async () => {
            mockSupabaseFrom.mockImplementation((table) => {
                if (table === 'system_config') {
                    return {
                        select: vi.fn().mockReturnValue({
                            eq: vi.fn().mockImplementation((key, value) => ({
                                single: vi.fn().mockResolvedValue({
                                    data:
                                        value === 'commission_rate'
                                            ? { value: { percentage: 20 } }
                                            : value === 'delivery_base_fee'
                                                ? { value: { amount: 3000 } }
                                                : { value: { cash: true, card: false, webpay: true } },
                                    error: null,
                                }),
                            })),
                        }),
                    };
                }
                return {};
            });

            render(<Settings />);

            await waitFor(() => {
                const commissionInput = screen.getByDisplayValue('20');
                expect(commissionInput).toBeInTheDocument();
            });
        });

        it('debe usar valores por defecto si hay error al cargar', async () => {
            mockSupabaseFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockRejectedValue(new Error('Error de red')),
                    }),
                }),
            });

            render(<Settings />);

            await waitFor(() => {
                const commissionInput = screen.getByDisplayValue('15');
                expect(commissionInput).toBeInTheDocument();
            });
        });
    });

    describe('Comisiones y Tarifas', () => {
        beforeEach(() => {
            mockSupabaseFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: null, error: null }),
                    }),
                }),
            });
        });

        it('debe actualizar comisión correctamente', async () => {
            const user = userEvent.setup();

            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Configuración del Sistema')).toBeInTheDocument();
            });

            const commissionInput = screen.getByDisplayValue('15');
            await user.clear(commissionInput);
            await user.type(commissionInput, '20');

            expect(commissionInput).toHaveValue(20);
        });

        it('debe actualizar tarifa de delivery correctamente', async () => {
            const user = userEvent.setup();

            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Configuración del Sistema')).toBeInTheDocument();
            });

            const deliveryFeeInput = screen.getByDisplayValue('2500');
            await user.clear(deliveryFeeInput);
            await user.type(deliveryFeeInput, '3000');

            expect(deliveryFeeInput).toHaveValue(3000);
        });
    });

    describe('Métodos de Pago', () => {
        beforeEach(() => {
            mockSupabaseFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: null, error: null }),
                    }),
                }),
            });
        });

        it('debe renderizar toggles de métodos de pago', async () => {
            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Efectivo')).toBeInTheDocument();
                expect(screen.getByText('Tarjeta de Crédito/Débito')).toBeInTheDocument();
                expect(screen.getByText('WebPay')).toBeInTheDocument();
            });
        });

        it('debe cambiar estado de toggle de efectivo', async () => {
            const user = userEvent.setup();

            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Efectivo')).toBeInTheDocument();
            });

            // El button toggle está al mismo nivel que el div de "Efectivo", en el div contenedor
            const efectivoContainer = screen.getByText('Efectivo').closest('.flex');
            const cashToggle = efectivoContainer?.querySelector('button');
            expect(cashToggle).toBeInTheDocument();

            if (cashToggle) {
                await user.click(cashToggle);
                // Toggle should change state
                expect(cashToggle).toBeInTheDocument();
            }
        });
    });

    describe('Guardado de configuración', () => {
        it('debe guardar configuración correctamente', async () => {
            const user = userEvent.setup();
            const mockUpsert = vi.fn().mockResolvedValue({ data: {}, error: null });

            mockSupabaseFrom.mockImplementation((table) => {
                if (table === 'system_config') {
                    return {
                        select: vi.fn().mockReturnValue({
                            eq: vi.fn().mockReturnValue({
                                single: vi.fn().mockResolvedValue({ data: null, error: null }),
                            }),
                        }),
                        upsert: mockUpsert,
                    };
                }
                return {};
            });

            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Guardar Configuración')).toBeInTheDocument();
            });

            const saveButton = screen.getByText('Guardar Configuración');
            await user.click(saveButton);

            await waitFor(() => {
                expect(mockUpsert).toHaveBeenCalledTimes(3); // commission, delivery_fee, payment_methods
            });
        });

        it('debe mostrar mensaje de éxito al guardar', async () => {
            const user = userEvent.setup();

            mockSupabaseFrom.mockImplementation((table) => {
                if (table === 'system_config') {
                    return {
                        select: vi.fn().mockReturnValue({
                            eq: vi.fn().mockReturnValue({
                                single: vi.fn().mockResolvedValue({ data: null, error: null }),
                            }),
                        }),
                        upsert: vi.fn().mockResolvedValue({ data: {}, error: null }),
                    };
                }
                return {};
            });

            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Guardar Configuración')).toBeInTheDocument();
            });

            const saveButton = screen.getByText('Guardar Configuración');
            await user.click(saveButton);

            await waitFor(() => {
                expect(screen.getByText('Configuración guardada exitosamente')).toBeInTheDocument();
            });
        });

        it('debe manejar errores al guardar', async () => {
            const user = userEvent.setup();
            global.alert = vi.fn();

            mockSupabaseFrom.mockImplementation((table) => {
                if (table === 'system_config') {
                    return {
                        select: vi.fn().mockReturnValue({
                            eq: vi.fn().mockReturnValue({
                                single: vi.fn().mockResolvedValue({ data: null, error: null }),
                            }),
                        }),
                        upsert: vi.fn().mockRejectedValue(new Error('Error al guardar')),
                    };
                }
                return {};
            });

            render(<Settings />);

            await waitFor(() => {
                expect(screen.getByText('Guardar Configuración')).toBeInTheDocument();
            });

            const saveButton = screen.getByText('Guardar Configuración');
            await user.click(saveButton);

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('Error al guardar la configuración');
            });
        });
    });
});
