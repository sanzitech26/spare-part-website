-- Per-product minimum order quantity + admin-editable contact details. Run after 004. Safe to re-run.

alter table products add column if not exists min_qty int not null default 1 check (min_qty >= 1 and min_qty <= 100);

create table if not exists site_settings (
  id int primary key default 1 check (id = 1), -- single row
  email text,
  phone text
);
insert into site_settings (id, email, phone) values (1, 'info@mbspareparts.co.uk', null) on conflict (id) do nothing;
alter table site_settings enable row level security;
drop policy if exists "public read" on site_settings;
drop policy if exists "admin write" on site_settings;
create policy "public read" on site_settings for select using (true);
create policy "admin write" on site_settings for all using (is_admin()) with check (is_admin());

-- Same as 004, plus: quantity must be at least the product's minimum.
create or replace function place_order(p_user uuid, p_items jsonb, p_address jsonb, p_free_over numeric, p_flat numeric)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_order uuid; v_sub numeric := 0; v_ship numeric; r record; prod record;
begin
  if jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;
  if jsonb_array_length(p_items) > 50 then raise exception 'Too many items'; end if;
  insert into public.orders (user_id, total, shipping, address) values (p_user, 0, 0, p_address) returning id into v_order;
  for r in select (e->>'id')::int as id, (e->>'qty')::int as qty from jsonb_array_elements(p_items) e order by 1 loop
    if r.qty < 1 or r.qty > 100 then raise exception 'Invalid quantity'; end if;
    select * into prod from public.products where id = r.id and active;
    if not found then raise exception 'Product no longer available'; end if;
    if prod.price is null then raise exception 'Price not available yet: %', prod.name; end if;
    if r.qty < prod.min_qty then raise exception 'Minimum order for % is % units', prod.name, prod.min_qty; end if;
    insert into public.order_items (order_id, product_id, qty, unit_price) values (v_order, r.id, r.qty, prod.price);
    v_sub := v_sub + prod.price * r.qty;
  end loop;
  v_ship := case when v_sub >= p_free_over then 0 else p_flat end;
  update public.orders set total = v_sub + v_ship, shipping = v_ship where id = v_order;
  return v_order;
end $$;
