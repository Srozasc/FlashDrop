-- Seed basic data
-- Users
insert into public.users (id, email, name, phone, role) values
  ('4c0c2e56-45a5-4b4d-9b99-9d2a3ea0d001', 'admin@flashdrop.local', 'Admin', '300000000', 'admin'),
  ('f2f8a4c9-0e69-4f3e-8c0d-3a4c7b2e2002', 'merchant@flashdrop.local', 'Comercio', '300000001', 'merchant'),
  ('3b3f7f5a-3c2a-4a1a-9f8e-7d2c6e3b3003', 'driver@flashdrop.local', 'Repartidor', '300000002', 'driver'),
  ('f6da6b9a-8e19-4dc5-9d9f-123456789004', 'user@flashdrop.local', 'Cliente', '300000003', 'user')
on conflict (id) do nothing;

-- Merchants
insert into public.merchants (id, user_id, business_name, rut, address, is_approved, delivery_fee) values
  ('a1a2a3a4-a5a6-47a7-88a8-a9a0b1b2c003', 'f2f8a4c9-0e69-4f3e-8c0d-3a4c7b2e2002', 'Burger Flash', '76.123.456-7', 'Av Central 123', true, 1500.00)
on conflict (id) do nothing;

-- Products
insert into public.products (id, merchant_id, name, description, price, stock, image_url, category) values
  ('b1b2b3b4-b5b6-47b7-88b8-b9b0c1c2d001', 'a1a2a3a4-a5a6-47a7-88a8-a9a0b1b2c003', 'Hamburguesa de pollo', 'Clásica de pollo', 12990.00, 50, 'https://via.placeholder.com/50', 'hamburguesas'),
  ('b1b2b3b4-b5b6-47b7-88b8-b9b0c1c2d002', 'a1a2a3a4-a5a6-47a7-88a8-a9a0b1b2c003', 'Limonada', 'Bebida refrescante', 2990.00, 100, 'https://via.placeholder.com/50', 'bebidas')
on conflict (id) do nothing;

-- Addresses
insert into public.addresses (id, user_id, street, commune, city, is_default) values
  ('c1c2c3c4-c5c6-47c7-88c8-c9c0d1d2e001', 'f6da6b9a-8e19-4dc5-9d9f-123456789004', 'Cr 5 Calle 20', 'Palermo', 'Pasto', true)
on conflict (id) do nothing;

-- Notifications
insert into public.notifications (id, user_id, title, body, type, is_read) values
  ('d1d2d3d4-d5d6-47d7-88d8-d9d0e1e2f001', 'f6da6b9a-8e19-4dc5-9d9f-123456789004', 'Pedido en camino', 'Tu pedido #20 está en camino', 'status', false)
on conflict (id) do nothing;

-- Drivers
insert into public.drivers (id, user_id, name, phone, is_available) values
  ('e1e2e3e4-e5e6-47e7-88e8-e9e0f1f2a001', '3b3f7f5a-3c2a-4a1a-9f8e-7d2c6e3b3003', 'Alex Smith', '316000000', true)
on conflict (id) do nothing;

-- Deliveries linked to order 20
insert into public.deliveries (id, order_id, driver_id) values
  ('f1f2f3f4-f5f6-47f7-88f8-f9f0a1a2b001', 20, 'e1e2e3e4-e5e6-47e7-88e8-e9e0f1f2a001')
on conflict (id) do nothing;

