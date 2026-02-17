import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { StatusBadge } from '@/components/StatusBadge';

describe('StatusBadge Component', () => {
    describe('Renderizado de estados', () => {
        it('debe renderizar badge para estado pending', () => {
            render(<StatusBadge status="pending" />);

            const badge = screen.getByText('Pendiente');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
        });

        it('debe renderizar badge para estado preparing', () => {
            render(<StatusBadge status="preparing" />);

            const badge = screen.getByText('Preparando');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
        });

        it('debe renderizar badge para estado ready', () => {
            render(<StatusBadge status="ready" />);

            const badge = screen.getByText('Listo');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-purple-100', 'text-purple-800');
        });

        it('debe renderizar badge para estado in_transit', () => {
            render(<StatusBadge status="in_transit" />);

            const badge = screen.getByText('En Camino');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-indigo-100', 'text-indigo-800');
        });

        it('debe renderizar badge para estado delivered', () => {
            render(<StatusBadge status="delivered" />);

            const badge = screen.getByText('Entregado');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-green-100', 'text-green-800');
        });

        it('debe renderizar badge para estado cancelled', () => {
            render(<StatusBadge status="cancelled" />);

            const badge = screen.getByText('Cancelado');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-red-100', 'text-red-800');
        });
    });

    describe('Clases personalizadas', () => {
        it('debe aplicar className adicional cuando se proporciona', () => {
            render(<StatusBadge status="pending" className="custom-class" />);

            const badge = screen.getByText('Pendiente');
            expect(badge).toHaveClass('custom-class');
        });

        it('debe mantener clases base con className adicional', () => {
            render(<StatusBadge status="delivered" className="mt-4" />);

            const badge = screen.getByText('Entregado');
            expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'mt-4');
        });
    });

    describe('Estados desconocidos', () => {
        it('debe manejar estados desconocidos con estilo por defecto', () => {
            // @ts-expect-error Testing unknown status
            render(<StatusBadge status="unknown" />);

            // Should render with default styling
            const badge = screen.getByText('unknown');
            expect(badge).toBeInTheDocument();
        });
    });

    describe('Estructura del componente', () => {
        it('debe tener la estructura HTML correcta', () => {
            const { container } = render(<StatusBadge status="pending" />);

            const badge = container.querySelector('span');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full');
        });

        it('debe tener el tamaño de texto correcto', () => {
            render(<StatusBadge status="pending" />);

            const badge = screen.getByText('Pendiente');
            expect(badge).toHaveClass('text-xs', 'font-medium');
        });

        it('debe tener borde', () => {
            render(<StatusBadge status="pending" />);

            const badge = screen.getByText('Pendiente');
            expect(badge).toHaveClass('border', 'border-yellow-200');
        });
    });
});
