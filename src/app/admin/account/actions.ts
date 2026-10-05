"use server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { requireAdmin, serviceDb } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export type State = { error?: string } | null;

// Re-checks the current password with a throwaway client (no cookies) so a stolen session can't change credentials.
async function verify(email: string, password: string) {
  const probe = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const { error } = await probe.auth.signInWithPassword({ email, password });
  return !error;
}

async function apply(attrs: { email?: string; password?: string }, current: string): Promise<State> {
  const sb = await requireAdmin();
  const { data: { user } } = await sb.auth.getUser();
  if (!user?.email) return { error: "Not signed in." };
  if (!(await verify(user.email, current))) return { error: "Current password is wrong." };
  const { error } = await serviceDb().auth.admin.updateUserById(user.id, { ...attrs, ...(attrs.email ? { email_confirm: true } : {}) });
  if (error) return { error: error.message };
  await (await supabase()).auth.signOut();
  redirect("/login?msg=updated");
}

export async function changeEmail(_: State, fd: FormData): Promise<State> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  return apply({ email }, String(fd.get("current") ?? ""));
}

export async function changePassword(_: State, fd: FormData): Promise<State> {
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return { error: "New password must be at least 8 characters." };
  if (password !== String(fd.get("confirm") ?? "")) return { error: "Passwords don't match." };
  return apply({ password }, String(fd.get("current") ?? ""));
}
