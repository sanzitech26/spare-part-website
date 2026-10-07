import "server-only";
import { cache } from "react";
import { supabase } from "./supabase";

// Customer-facing contact details, editable in /admin/settings. Falls back to the default email if the row is missing.
export const getSettings = cache(async () => {
  const { data } = await (await supabase()).from("site_settings").select("email, phone").eq("id", 1).maybeSingle();
  return { email: data?.email || "support@mbspareparts.co.uk", phone: data?.phone || "" };
});
