-- Development-only insert/update policies for deliveries
alter table public.deliveries enable row level security;

drop policy if exists deliveries_insert_dev on public.deliveries;
create policy deliveries_insert_dev on public.deliveries
for insert
to authenticated
with check (true);

drop policy if exists deliveries_update_dev on public.deliveries;
create policy deliveries_update_dev on public.deliveries
for update
to authenticated
using (true)
with check (true);

