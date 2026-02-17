insert into public.orders (id, status, courier_name, address, total) overriding system value
values 
  (20, 'EN CAMINO', 'Alex Smith', 'Cr 5 Calle 20', 129000.00),
  (19, 'ENTREGADO', 'John Doe', 'Av Siempre Viva 123', 90500.00)
on conflict (id) do nothing;

insert into public.order_items (order_id, name, quantity, image_url)
values
  (20, 'Hamburguesa de pollo', 2, 'https://via.placeholder.com/50'),
  (20, 'Limonada', 1, 'https://via.placeholder.com/50'),
  (20, 'Hamburguesa Sencilla', 2, 'https://via.placeholder.com/50'),
  (20, 'Margarita', 5, 'https://via.placeholder.com/50'),
  (19, 'Hamburguesa de pollo', 1, 'https://via.placeholder.com/50'),
  (19, 'Gaseosa', 2, 'https://via.placeholder.com/50');
