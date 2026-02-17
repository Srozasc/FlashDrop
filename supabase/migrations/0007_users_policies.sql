-- RLS policies to allow authenticated users to manage their own profile row
alter table public.users enable row level security;

drop policy if exists users_insert_self on public.users;
create policy users_insert_self on public.users
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

