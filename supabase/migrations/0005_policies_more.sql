-- Enable RLS
alter table public.users enable row level security;
alter table public.merchants enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.notifications enable row level security;
alter table public.drivers enable row level security;
alter table public.deliveries enable row level security;

-- Drop if exists then create for idempotency
drop policy if exists users_select_all on public.users;
create policy users_select_all on public.users for select to public using (true);

drop policy if exists merchants_select_all on public.merchants;
create policy merchants_select_all on public.merchants for select to public using (true);

drop policy if exists products_select_all on public.products;
create policy products_select_all on public.products for select to public using (true);

drop policy if exists addresses_select_all on public.addresses;
create policy addresses_select_all on public.addresses for select to public using (true);

drop policy if exists notifications_select_all on public.notifications;
create policy notifications_select_all on public.notifications for select to public using (true);

drop policy if exists drivers_select_all on public.drivers;
create policy drivers_select_all on public.drivers for select to public using (true);

drop policy if exists deliveries_select_all on public.deliveries;
create policy deliveries_select_all on public.deliveries for select to public using (true);

