import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "Admin" };

async function signOut() {
  "use server";
  await (await supabase()).auth.signOut();
  redirect("/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await requireAdmin();
  const { data: { user } } = await sb.auth.getUser();
  return <AdminShell email={user?.email ?? "admin"} signOutAction={signOut}>{children}</AdminShell>;
}
