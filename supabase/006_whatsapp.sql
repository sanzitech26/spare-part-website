-- Admin-editable WhatsApp number (shown as the floating chat button) and the new public email. Safe to re-run.
alter table site_settings add column if not exists whatsapp text;
update site_settings set email = 'info@mbspareparts.co.uk' where id = 1;
