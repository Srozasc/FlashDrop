create policy orders_select_all on public.orders
for select
to public
using (true);

create policy order_items_select_all on public.order_items
for select
to public
using (true);

