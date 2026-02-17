import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    preparing: { label: 'Preparando', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    ready: { label: 'Listo', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    in_transit: { label: 'En Camino', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800 border-green-200' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                config.color,
                className
            )}
        >
            {config.label}
        </span>
    );
}
