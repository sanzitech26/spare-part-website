import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

async function signIn(fd: FormData) {
  "use server";
  const sb = await supabase();
  const { error } = await sb.auth.signInWithPassword({
    email: String(fd.get("email")),
    password: String(fd.get("password")),
  });
  if (error) redirect("/login?error=invalid");
  redirect("/admin"); // ponytail: customers land here too until storefront accounts exist; requireAdmin bounces non-admins
}

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const msg = error === "invalid" ? "Wrong email or password." : error === "not-admin" ? "This account is not an admin." : "";
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form action={signIn} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Sign in</h1>
        {msg && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{msg}</p>}
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2" />
        <input name="password" type="password" required placeholder="Password" className="w-full rounded border border-slate-300 px-3 py-2" />
        <button className="w-full rounded bg-brand py-2 font-semibold text-white hover:bg-brand-dark">Sign in</button>
      </form>
    </main>
  );
}
