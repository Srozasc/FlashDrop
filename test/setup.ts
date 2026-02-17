import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(),
                    order: vi.fn(),
                })),
                order: vi.fn(() => ({
                    eq: vi.fn(),
                })),
                single: vi.fn(),
            })),
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(),
                })),
            })),
            update: vi.fn(() => ({
                eq: vi.fn(() => ({
                    select: vi.fn(() => ({
                        single: vi.fn(),
                    })),
                })),
            })),
            upsert: vi.fn(() => ({
                select: vi.fn(),
            })),
        })),
        auth: {
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            getSession: vi.fn(),
        },
    },
}));

// Mock de React Router
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ pathname: '/' }),
    };
});
