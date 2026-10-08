import "server-only";
import { cache } from "react";
import { supabase } from "./supabase";

// Customer-facing contact details, editable in /admin/settings. Falls back to the default email if the row is missing.
export const getSettings = cache(async () => {
  const { data } = await (await supabase()).from("site_settings").select("email, phone, whatsapp").eq("id", 1).maybeSingle();
  return { email: data?.email || "info@mbspareparts.co.uk", phone: data?.phone || "", whatsapp: data?.whatsapp || "" };
});

// wa.me wants digits only in international format; a UK "07..." / "+44 (0)7..." number is converted to 44...
export const whatsappDigits = (n: string) => {
  const d = n.replace(/\(0\)/g, "").replace(/\D/g, ""); // "+44 (0)7..." writes the trunk 0 in brackets
  return d.startsWith("00") ? d.slice(2) : d.startsWith("0") ? `44${d.slice(1)}` : d;
};
