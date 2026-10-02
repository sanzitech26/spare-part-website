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

-- ===== Phase 2: content tables, product brand =====
alter table products add column brand_id int references brands;

create table faqs (id serial primary key, question text not null, answer text not null, sort int not null default 0, active boolean not null default true);
create table testimonials (id serial primary key, name text not null, text text not null, rating int not null default 5 check (rating between 1 and 5), active boolean not null default true, created_at timestamptz default now());
create table posts (id serial primary key, slug text unique not null, title text not null, excerpt text, body text not null, cover_url text, published boolean not null default false, created_at timestamptz default now());

alter table faqs enable row level security; alter table testimonials enable row level security; alter table posts enable row level security;
create policy "public read" on faqs for select using (active or is_admin());
create policy "public read" on testimonials for select using (active or is_admin());
create policy "public read" on posts for select using (published or is_admin());
create policy "admin write" on faqs for all using (is_admin()) with check (is_admin());
create policy "admin write" on testimonials for all using (is_admin()) with check (is_admin());
create policy "admin write" on posts for all using (is_admin()) with check (is_admin());

insert into brands (name, slug) values ('Hero','hero'),('Bajaj','bajaj'),('Honda','honda'),('TVS','tvs'),('Yamaha','yamaha'),('Royal Enfield','royal-enfield'),('KTM','ktm'),('Suzuki','suzuki'),('Mahindra','mahindra') on conflict do nothing;

-- ===== Phase 2b: checkout =====
alter table orders add column shipping numeric(10,2) not null default 0;

-- Atomic: locks product rows, checks stock, prices from DB, creates order + items, reserves stock.
-- Called only by the server (service role); not callable by anon/authenticated.
create function place_order(p_user uuid, p_items jsonb, p_address jsonb, p_free_over numeric, p_flat numeric)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_order uuid; v_sub numeric := 0; v_ship numeric; r record; prod record;
begin
  if jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;
  insert into public.orders (user_id, total, shipping, address) values (p_user, 0, 0, p_address) returning id into v_order;
  for r in select (e->>'id')::int as id, (e->>'qty')::int as qty from jsonb_array_elements(p_items) e order by 1 loop
    if r.qty < 1 or r.qty > 100 then raise exception 'Invalid quantity'; end if;
    select * into prod from public.products where id = r.id and active for update;
    if not found then raise exception 'Product no longer available'; end if;
    if prod.stock < r.qty then raise exception 'Not enough stock for %', prod.name; end if;
    update public.products set stock = stock - r.qty where id = r.id;
    insert into public.order_items (order_id, product_id, qty, unit_price) values (v_order, r.id, r.qty, prod.price);
    v_sub := v_sub + prod.price * r.qty;
  end loop;
  v_ship := case when v_sub >= p_free_over then 0 else p_flat end;
  update public.orders set total = v_sub + v_ship, shipping = v_ship where id = v_order;
  return v_order;
end $$;
revoke execute on function place_order(uuid, jsonb, jsonb, numeric, numeric) from public, anon, authenticated;
grant execute on function place_order(uuid, jsonb, jsonb, numeric, numeric) to service_role;
