-- Run after schema.sql. Prepares the database for the Mercedes-Benz parts catalog. Safe to re-run.

-- Prices are entered later in the admin; a part with no price is "Price on request".
alter table products alter column price drop not null;
alter table products add column if not exists description text;

-- Ordering for menus / grids
alter table categories add column if not exists sort int not null default 0;
alter table models add column if not exists slug text;
alter table models add column if not exists sort int not null default 0;
create unique index if not exists models_slug_key on models (slug);
create unique index if not exists models_brand_name_key on models (brand_id, name);

-- Single brand: replace the old two-wheeler brands (only if nothing references them).
delete from brands b
where b.slug in ('hero','bajaj','honda','tvs','yamaha','royal-enfield','ktm','suzuki','mahindra')
  and not exists (select 1 from products p where p.brand_id = b.id)
  and not exists (select 1 from models m where m.brand_id = b.id);
insert into brands (name, slug) values ('Mercedes-Benz', 'mercedes-benz') on conflict (slug) do nothing;

-- Checkout must refuse parts that have no price yet.
create or replace function place_order(p_user uuid, p_items jsonb, p_address jsonb, p_free_over numeric, p_flat numeric)
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
    if prod.price is null then raise exception 'Price on request: %', prod.name; end if;
    if prod.stock < r.qty then raise exception 'Not enough stock for %', prod.name; end if;
    update public.products set stock = stock - r.qty where id = r.id;
    insert into public.order_items (order_id, product_id, qty, unit_price) values (v_order, r.id, r.qty, prod.price);
    v_sub := v_sub + prod.price * r.qty;
  end loop;
  v_ship := case when v_sub >= p_free_over then 0 else p_flat end;
  update public.orders set total = v_sub + v_ship, shipping = v_ship where id = v_order;
  return v_order;
end $$;
