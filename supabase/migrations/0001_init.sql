create table if not exists public.orders (
  id bigint generated always as identity primary key,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  courier_name text,
  address text,
  total numeric(12,2) default 0 not null
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  name text not null,
  quantity integer not null,
  image_url text
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

