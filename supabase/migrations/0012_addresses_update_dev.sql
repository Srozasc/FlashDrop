alter table public.addresses enable row level security;

drop policy if exists addresses_update_self on public.addresses;
create policy addresses_update_self on public.addresses
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

