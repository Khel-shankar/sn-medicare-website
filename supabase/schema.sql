-- S.N. Medicare — Admin dashboard + orders
-- Run this once in Supabase → SQL Editor

create extension if not exists "pgcrypto";

-- Paid / verified store orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text unique not null,
  razorpay_payment_id text unique not null,
  status text not null default 'paid'
    check (status in ('paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null default '',
  city text not null default '',
  state text not null default '',
  pincode text not null default '',
  subtotal integer not null default 0,
  discount integer not null default 0,
  total integer not null,
  promo_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  brand text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Short-lived OTPs for admin login (email or phone)
create table if not exists public.admin_otps (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  channel text not null check (channel in ('email', 'phone')),
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists admin_otps_identifier_idx on public.admin_otps (identifier);

-- Lock down: only service role (server) should access these tables
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_otps enable row level security;

-- No anon/authenticated policies → only service_role bypasses RLS
