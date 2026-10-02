import "server-only";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";

// Call at the top of every admin page AND every admin server action (actions are public endpoints).
export async function requireAdmin() {
  const sb = await supabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: p } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (p?.role !== "admin") redirect("/login?error=not-admin");
  return sb; // RLS (is_admin()) still applies to everything done through this client
}

// Service-role client: bypasses RLS. Only use after requireAdmin(), only for storage uploads.
export const serviceDb = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
