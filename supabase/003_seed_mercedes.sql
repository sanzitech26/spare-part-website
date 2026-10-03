-- Seeds categories, models and the 53 Mercedes-Benz parts. Prices are left empty (set them in /admin/products).
-- Idempotent: existing SKUs are never touched, so re-running will not overwrite prices or edits made in the admin.

insert into categories (name, slug, sort) values
  ('Engine & Transmission', 'engine-transmission', 1),
  ('Cooling & A/C', 'cooling-ac', 2),
  ('Electronics & Sensors', 'electronics-sensors', 3),
  ('Brakes & Suspension', 'brakes-suspension', 4),
  ('Bumpers & Front-Ends', 'bumpers-front-ends', 5),
  ('Grilles', 'grilles', 6),
  ('Headlights', 'headlights', 7),
  ('Tail Lights', 'tail-lights', 8),
  ('Wheels & Rims', 'wheels-rims', 9),
  ('Body Panels & Mirrors', 'body-panels-mirrors', 10),
  ('Interior', 'interior', 11)
on conflict (slug) do nothing;

insert into models (brand_id, name, slug, sort)
select b.id, v.name, v.slug, v.sort from brands b,
  (values ('A-Class','a-class',1),('C-Class','c-class',2),('E-Class','e-class',3),('S-Class','s-class',4),
          ('GLC','glc',5),('GLE','gle',6),('GLS','gls',7),('Sprinter','sprinter',8)) as v(name, slug, sort)
where b.slug = 'mercedes-benz'
on conflict (slug) do nothing;

with data(sku, name, cat, models, specs) as (values
  -- Engine & Transmission
  ('MB-003','Alternator','engine-transmission',array['A-Class','C-Class','E-Class'],'{}'::jsonb),
  ('MB-004','Starter Motor','engine-transmission',array['C-Class','E-Class','Sprinter'],'{}'::jsonb),
  ('MB-005','Automatic Transmission Assembly','engine-transmission',array['C-Class','E-Class','GLC'],'{}'::jsonb),
  ('MB-006','Complete Engine Assembly','engine-transmission',array['C-Class','E-Class','Sprinter'],'{}'::jsonb),
  ('MB-007','Diesel Fuel Injector','engine-transmission',array['C-Class','E-Class','Sprinter'],'{"Fuel":"Diesel"}'::jsonb),
  ('MB-011','Intercooler','engine-transmission',array['C-Class','E-Class','Sprinter'],'{}'::jsonb),
  -- Cooling & A/C
  ('MB-009','Air Conditioning Compressor','cooling-ac',array['A-Class','C-Class','E-Class'],'{}'::jsonb),
  ('MB-010','Radiator Assembly','cooling-ac',array['C-Class','E-Class','GLC'],'{}'::jsonb),
  -- Electronics & Sensors
  ('MB-008','NOx Sensor','electronics-sensors',array['C-Class','E-Class','GLC'],'{}'::jsonb),
  ('MB-012','Engine ECU','electronics-sensors',array['A-Class','C-Class','E-Class'],'{}'::jsonb),
  ('MB-013','Automatic Gearbox Control Module','electronics-sensors',array['C-Class','E-Class','GLC'],'{}'::jsonb),
  ('MB-014','ABS/ESP Control Module','electronics-sensors',array['A-Class','C-Class','E-Class'],'{}'::jsonb),
  -- Brakes & Suspension
  ('MB-001','Front Brake Pad Set','brakes-suspension',array['GLE'],'{"Position":"Front"}'::jsonb),
  ('MB-002','Airmatic Suspension Strut','brakes-suspension',array['E-Class','S-Class','GLE'],'{"Type":"Airmatic air suspension"}'::jsonb),
  -- Bumpers & Front-Ends
  ('MB-015','AMG Front Bumper Cover','bumpers-front-ends',array['GLC'],'{"Position":"Front","Style":"AMG","Type":"OEM"}'::jsonb),
  ('MB-016','AMG Front-End Assembly','bumpers-front-ends',array['GLC'],'{"Position":"Front","Style":"AMG","Variant":"GLC 43","Chassis":"X253","Type":"OEM"}'::jsonb),
  ('MB-017','GLC 63 AMG (C253)','bumpers-front-ends',array['GLC'],'{"Style":"AMG","Variant":"GLC 63","Chassis":"C253"}'::jsonb),
  ('MB-018','Front Bumper Cover with Grille & Emblem','bumpers-front-ends',array['GLC'],'{"Position":"Front","Variant":"GLC 300","Chassis":"X253","Type":"OEM"}'::jsonb),
  ('MB-019','Front-End Assembly with Bumper','bumpers-front-ends',array['GLC'],'{"Position":"Front","Chassis":"X254","Type":"OEM"}'::jsonb),
  ('MB-020','Front Bumper Cover with Grille','bumpers-front-ends',array['GLC'],'{"Position":"Front","Chassis":"X253"}'::jsonb),
  ('MB-021','AMG Front Bumper (Facelift)','bumpers-front-ends',array['C-Class'],'{"Position":"Front","Style":"AMG","Variant":"C 63 AMG 6.3","Type":"OEM"}'::jsonb),
  ('MB-022','Front Bumper Cover','bumpers-front-ends',array['GLC'],'{"Position":"Front"}'::jsonb),
  ('MB-023','AMG Rear Bumper Cover Panel Assembly','bumpers-front-ends',array['GLC'],'{"Position":"Rear","Style":"AMG","Variant":"GLC 63","Chassis":"X253"}'::jsonb),
  ('MB-024','AMG Sport Rear Bumper Cover','bumpers-front-ends',array['GLC'],'{"Position":"Rear","Style":"AMG Sport","Variant":"GLC 300"}'::jsonb),
  ('MB-025','AMG Rear Bumper','bumpers-front-ends',array['GLC'],'{"Position":"Rear","Style":"AMG","Variant":"GLC 63 S","Chassis":"C253"}'::jsonb),
  -- Grilles
  ('MB-026','AMG Grille Trim Molding','grilles',array['GLE'],'{"Style":"AMG","Type":"Genuine OEM"}'::jsonb),
  ('MB-027','Front Vent Mesh Grille','grilles',array['GLE'],'{"Position":"Front","Chassis":"W166"}'::jsonb),
  ('MB-028','Front Grille & Side Grille','grilles',array['GLE'],'{"Chassis":"W167","Type":"OEM"}'::jsonb),
  ('MB-029','GLS 63 Grille','grilles',array['GLS'],'{"Variant":"GLS 63"}'::jsonb),
  -- Headlights
  ('MB-030','Adaptive Full LED Headlight (Left)','headlights',array['GLC'],'{"Position":"Left","Technology":"Adaptive full LED"}'::jsonb),
  ('MB-031','LED Headlight (Left, A253)','headlights',array['GLC'],'{"Position":"Left","Technology":"LED","Variant":"GLC 300 / GLC 43","Chassis":"A253"}'::jsonb),
  ('MB-032','LED Headlight (Left, W253)','headlights',array['GLC'],'{"Position":"Left","Technology":"LED","Variant":"GLC 300 / GLC 63","Chassis":"W253"}'::jsonb),
  ('MB-033','High-Performance LED Headlight (Left)','headlights',array['GLC'],'{"Position":"Left","Technology":"High-performance LED","Chassis":"X253 / W253","Type":"Genuine OEM"}'::jsonb),
  ('MB-034','LED Headlight (Right, OEM)','headlights','{}','{"Position":"Right","Technology":"LED","Type":"OEM"}'::jsonb),
  ('MB-035','LED Headlight (Right)','headlights','{}','{"Position":"Right","Technology":"LED"}'::jsonb),
  ('MB-036','Genuine OEM Headlight (Right)','headlights','{}','{"Position":"Right","Type":"Genuine OEM"}'::jsonb),
  -- Tail Lights
  ('MB-037','LED Tail Light (Rear Left, Driver Side)','tail-lights','{}','{"Position":"Rear left (driver side)","Technology":"LED"}'::jsonb),
  ('MB-038','LED Tail Light (Driver Left, OEM)','tail-lights','{}','{"Position":"Left (driver side)","Technology":"LED","Type":"OEM"}'::jsonb),
  ('MB-039','LED Tail Light (Driver Left)','tail-lights','{}','{"Position":"Left (driver side)","Technology":"LED"}'::jsonb),
  ('MB-040','Outer Tail Light (Left, Coupe)','tail-lights','{}','{"Position":"Left (driver side), outer","Body":"Coupe","Type":"OEM"}'::jsonb),
  ('MB-041','LED Tail Light (Rear Right, Passenger Side)','tail-lights','{}','{"Position":"Rear right (passenger side)","Technology":"LED"}'::jsonb),
  ('MB-042','Tail Light (Right Side, OEM)','tail-lights','{}','{"Position":"Right","Type":"OEM"}'::jsonb),
  -- Wheels & Rims
  ('MB-043','AMG Wheel Set 19" (8.5J / 9.5J)','wheels-rims',array['GLE'],'{"Style":"AMG","Wheel size":"19 in, front 8.5J / rear 9.5J","Variant":"GLE 350 / GLE 550","Condition":"New"}'::jsonb),
  ('MB-044','Genuine 19" Wheel Set','wheels-rims',array['C-Class'],'{"Wheel size":"19 in","Variant":"C 43 AMG","Chassis":"W205","Type":"Genuine"}'::jsonb),
  ('MB-045','Gloss Black Wheel Set of 4 (19")','wheels-rims','{}','{"Wheel size":"19 in, front 8.5J / rear 9.5J","Finish":"Gloss black","Quantity":"Set of 4","Condition":"New"}'::jsonb),
  ('MB-046','Black Alloy Wheel (Diamond Cut)','wheels-rims','{}','{"Finish":"Black, diamond cut"}'::jsonb),
  ('MB-047','AMG Staggered Rim 19" (Gloss Black)','wheels-rims','{}','{"Style":"AMG","Wheel size":"19 in, staggered","Finish":"Gloss black"}'::jsonb),
  ('MB-048','19" Rims for GLC 43 AMG','wheels-rims',array['GLC'],'{"Style":"AMG","Wheel size":"19 in","Variant":"GLC 43"}'::jsonb),
  -- Body Panels & Mirrors
  ('MB-049','Front Hood (Bonnet)','body-panels-mirrors',array['E-Class'],'{"Position":"Front","Variant":"E 450","Chassis":"A238","Type":"OEM"}'::jsonb),
  ('MB-050','Front Bonnet / Engine Hood Cover','body-panels-mirrors',array['E-Class'],'{"Position":"Front","Chassis":"W213","Material":"Steel"}'::jsonb),
  ('MB-051','Front Fender Wing (Left)','body-panels-mirrors','{}','{"Position":"Left front"}'::jsonb),
  ('MB-052','Side Mirror','body-panels-mirrors',array['GLC'],'{"Variant":"GLC 350 / GLC 300","Chassis":"X254"}'::jsonb),
  -- Interior
  ('MB-053','Complete Front Seat Assembly Set (Driver & Passenger)','interior',array['GLC'],'{"Position":"Front","Variant":"GLC 300","Chassis":"X253"}'::jsonb)
),
ins as (
  insert into products (sku, name, category_id, brand_id, specs, stock, active)
  select d.sku, d.name, c.id, (select id from brands where slug = 'mercedes-benz'), d.specs, 0, true
  from data d join categories c on c.slug = d.cat
  on conflict (sku) do nothing
  returning id, sku
)
insert into product_fitment (product_id, model_id)
select ins.id, m.id
from ins
join data d on d.sku = ins.sku
cross join lateral unnest(d.models) as mn
join models m on m.name = mn
on conflict do nothing;
