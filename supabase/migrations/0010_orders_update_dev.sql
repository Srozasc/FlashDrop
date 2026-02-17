-- Development-only update policy for orders
alter table public.orders enable row level security;

drop policy if exists orders_update_dev on public.orders;
create policy orders_update_dev on public.orders
for update
to authenticated
using (true)
with check (true);

