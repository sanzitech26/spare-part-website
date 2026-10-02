import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

const safe = (n: string) => (/^\/(?![/\\])/.test(n) ? n : "");

async function signUp(fd: FormData) {
  "use server";
  const next = safe(String(fd.get("next") ?? ""));
  const origin = (await headers()).get("origin") ?? "";
  const password = String(fd.get("password"));
  if (password.length < 8) redirect("/signup?error=short");
  const { error } = await (await supabase()).auth.signUp({
    email: String(fd.get("email")),
    password,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next || "/")}`, data: { full_name: String(fd.get("name") ?? "") } },
  });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/login?msg=check-email");
}

export default async function Signup({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next = "" } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form action={signUp} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/" className="text-sm text-slate-500 hover:text-brand">← Back to store</Link>
        <h1 className="text-2xl font-bold">Create account</h1>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error === "short" ? "Password must be at least 8 characters." : error}</p>}
        <input type="hidden" name="next" value={next} />
        <input name="name" required placeholder="Full name" className="w-full rounded border border-slate-300 px-3 py-2" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2" />
        <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className="w-full rounded border border-slate-300 px-3 py-2" />
        <button className="w-full rounded bg-brand py-2 font-semibold text-white hover:bg-brand-dark">Sign up</button>
        <p className="text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="text-brand underline">Sign in</Link></p>
      </form>
    </main>
  );
}
