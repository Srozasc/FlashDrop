export const mockOrders = [
    {
        id: 'order-1',
        merchant_id: 'merchant-1',
        user_id: 'user-1',
        status: 'pending',
        total_amount: 15000,
        delivery_fee: 2500,
        payment_method: 'cash',
        delivery_address: {
            street: 'Av. Principal 123',
            number: '123',
            city: 'Santiago'
        },
        created_at: '2024-01-15T10:00:00Z',
        merchant: {
            business_name: 'Restaurant Test',
            address: 'Calle Comercio 456',
            phone: '+56912345678',
        },
        user: {
            name: 'Juan Pérez',
            phone: '+56987654321',
            email: 'juan@example.com',
        },
        items: [
            {
                id: 'item-1',
                order_id: 'order-1',
                product_id: 'prod-1',
                quantity: 2,
                unit_price: 5000,
                subtotal: 10000,
                product: {
                    name: 'Hamburguesa',
                    image_url: 'https://example.com/burger.jpg',
                    price: 5000,
                },
            },
            {
                id: 'item-2',
                order_id: 'order-1',
                product_id: 'prod-2',
                quantity: 1,
                unit_price: 5000,
                subtotal: 5000,
                product: {
                    name: 'Papas Fritas',
                    image_url: 'https://example.com/fries.jpg',
                    price: 5000,
                },
            },
        ],
    },
    {
        id: 'order-2',
        merchant_id: 'merchant-2',
        user_id: 'user-2',
        status: 'delivered',
        total_amount: 20000,
        delivery_fee: 2500,
        payment_method: 'card',
        delivery_address: {
            street: 'Calle Secundaria 789',
            number: '789',
            city: 'Santiago'
        },
        created_at: '2024-01-14T15:30:00Z',
        merchant: {
            business_name: 'Pizzería Italia',
            address: 'Av. Italia 100',
            phone: '+56911111111',
        },
        user: {
            name: 'María González',
            phone: '+56922222222',
            email: 'maria@example.com',
        },
        items: [
            {
                id: 'item-3',
                order_id: 'order-2',
                product_id: 'prod-3',
                quantity: 1,
                unit_price: 17500,
                subtotal: 17500,
                product: {
                    name: 'Pizza Familiar',
                    image_url: 'https://example.com/pizza.jpg',
                    price: 17500,
                },
            },
        ],
    },
];

export const mockMerchants = [
    {
        id: 'merchant-1',
        business_name: 'Restaurant Test',
        rut: '12345678-9',
        address: 'Calle Comercio 456',
        phone: '+56912345678',
        email: 'restaurant@test.com',
        is_approved: true,
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 'merchant-2',
        business_name: 'Pizzería Italia',
        rut: '98765432-1',
        address: 'Av. Italia 100',
        phone: '+56911111111',
        email: 'pizzeria@test.com',
        is_approved: false,
        created_at: '2024-01-10T00:00:00Z',
    },
];

export const mockDrivers = [
    {
        id: 'driver-1',
        name: 'Carlos Conductor',
        phone: '+56933333333',
        is_available: true,
        is_approved: true,
        is_active: true,
        created_at: '2024-01-05T00:00:00Z',
        user: {
            email: 'carlos@driver.com',
        },
    },
    {
        id: 'driver-2',
        name: 'Ana Repartidora',
        phone: '+56944444444',
        is_available: false,
        is_approved: false,
        is_active: true,
        created_at: '2024-01-12T00:00:00Z',
        user: {
            email: 'ana@driver.com',
        },
    },
];

export const mockUsers = [
    {
        id: 'user-1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+56987654321',
        role: 'customer',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 'user-2',
        name: 'María González',
        email: 'maria@example.com',
        phone: '+56922222222',
        role: 'customer',
        is_active: false,
        created_at: '2024-01-15T00:00:00Z',
    },
];
