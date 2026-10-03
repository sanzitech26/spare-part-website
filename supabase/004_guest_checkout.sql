-- Guest checkout: customers do not need an account, and stock is not tracked.
-- Run after 002_mercedes_migration.sql. Safe to re-run.

alter table orders alter column user_id drop not null;

-- Same as before, minus the stock check/decrement. Still rejects parts with no price and prices everything from the DB.
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
    insert into public.order_items (order_id, product_id, qty, unit_price) values (v_order, r.id, r.qty, prod.price);
    v_sub := v_sub + prod.price * r.qty;
  end loop;
  v_ship := case when v_sub >= p_free_over then 0 else p_flat end;
  update public.orders set total = v_sub + v_ship, shipping = v_ship where id = v_order;
  return v_order;
end $$;
