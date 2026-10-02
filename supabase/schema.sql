-- Run in the Supabase SQL editor (or as a migration) once the project exists.
create table brands (id serial primary key, name text unique not null, slug text unique not null, logo_url text);
create table models (id serial primary key, brand_id int references brands on delete cascade, name text not null, year_from int, year_to int);
create table categories (id serial primary key, name text unique not null, slug text unique not null);

create table products (
  id serial primary key,
  sku text unique not null,
  name text not null,
  category_id int references categories,
  price numeric(10,2) not null,
  mrp numeric(10,2),
  stock int not null default 0 check (stock >= 0),
  images text[] default '{}',
  specs jsonb default '{}',
  warranty text,
  active boolean default true,
  fts tsvector generated always as (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(sku,''))) stored
);
create index products_fts on products using gin (fts);
create table product_fitment (product_id int references products on delete cascade, model_id int references models on delete cascade, primary key (product_id, model_id));

create table profiles (id uuid primary key references auth.users on delete cascade, full_name text, phone text, role text not null default 'customer' check (role in ('customer','admin')));
create table wishlist_items (user_id uuid references auth.users on delete cascade, product_id int references products on delete cascade, primary key (user_id, product_id));
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  total numeric(10,2) not null,
  address jsonb not null,
  payment_ref text,
  created_at timestamptz default now()
);
create table order_items (order_id uuid references orders on delete cascade, product_id int references products, qty int not null check (qty > 0), unit_price numeric(10,2) not null, primary key (order_id, product_id));

-- new auth user -> profile
create function handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles (id) values (new.id); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

-- RLS
alter table brands enable row level security; alter table models enable row level security; alter table categories enable row level security;
alter table products enable row level security; alter table product_fitment enable row level security;
alter table profiles enable row level security; alter table wishlist_items enable row level security;
alter table orders enable row level security; alter table order_items enable row level security;

create policy "public read" on brands for select using (true);
create policy "public read" on models for select using (true);
create policy "public read" on categories for select using (true);
create policy "public read" on products for select using (active or is_admin());
create policy "public read" on product_fitment for select using (true);
create policy "admin write" on brands for all using (is_admin()) with check (is_admin());
create policy "admin write" on models for all using (is_admin()) with check (is_admin());
create policy "admin write" on categories for all using (is_admin()) with check (is_admin());
create policy "admin write" on products for all using (is_admin()) with check (is_admin());
create policy "admin write" on product_fitment for all using (is_admin()) with check (is_admin());

-- role is not user-editable: users may read their row; only admins update (promote admins via SQL editor)
create policy "own profile read" on profiles for select using (id = auth.uid() or is_admin());
create policy "admin profile update" on profiles for update using (is_admin());
create policy "own wishlist" on wishlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own orders read" on orders for select using (user_id = auth.uid() or is_admin());
create policy "admin orders update" on orders for update using (is_admin());
create policy "own order items read" on order_items for select using (exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin())));
-- order creation + payment confirmation go through server routes using the service-role key.
