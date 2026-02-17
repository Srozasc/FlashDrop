-- USERS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  name text,
  phone text,
  role text,
  is_active boolean default true not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MERCHANTS
create table if not exists public.merchants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  business_name text not null,
  rut text,
  address text,
  coordinates jsonb,
  is_approved boolean default false not null,
  delivery_fee numeric(12,2) default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid references public.merchants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null,
  stock integer default 0 not null,
  image_url text,
  category text,
  is_active boolean default true not null
);

-- ADDRESSES
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  street text,
  commune text,
  city text,
  coordinates jsonb,
  is_default boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text,
  body text,
  type text,
  data jsonb,
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DRIVERS
create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  name text,
  phone text,
  is_available boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DELIVERIES
create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id bigint references public.orders(id) on delete cascade,
  driver_id uuid references public.drivers(id) on delete set null,
  pickup_coordinates jsonb,
  delivery_coordinates jsonb,
  assigned_at timestamp with time zone,
  picked_up_at timestamp with time zone,
  delivered_at timestamp with time zone
);

-- Optional: extend existing orders for merchant linkage and payment metadata
alter table public.orders
  add column if not exists merchant_id uuid references public.merchants(id),
  add column if not exists payment_method text,
  add column if not exists payment_status text,
  add column if not exists webpay_token text,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

