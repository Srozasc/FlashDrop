-- Development-only insert policies (loosened) for creating orders and items
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists orders_insert_dev on public.orders;
create policy orders_insert_dev on public.orders
for insert
to authenticated
with check (true);

drop policy if exists order_items_insert_dev on public.order_items;
create policy order_items_insert_dev on public.order_items
for insert
to authenticated
with check (true);

