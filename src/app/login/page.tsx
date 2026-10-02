import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Only same-site relative paths; "//evil.com" and "/\evil.com" are rejected.
const safe = (n: string) => (/^\/(?![/\\])/.test(n) ? n : "");

async function signIn(fd: FormData) {
  "use server";
  const sb = await supabase();
  const next = safe(String(fd.get("next") ?? ""));
  const { data, error } = await sb.auth.signInWithPassword({
    email: String(fd.get("email")),
    password: String(fd.get("password")),
  });
  if (error) redirect(`/login?error=invalid${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  if (next) redirect(next);
  const { data: p } = await sb.from("profiles").select("role").eq("id", data.user.id).single();
  redirect(p?.role === "admin" ? "/admin" : "/");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; msg?: string }> }) {
  const { error, next = "", msg } = await searchParams;
  const text =
    error === "invalid" ? "Wrong email or password." :
    error === "not-admin" ? "This account is not an admin." :
    msg === "check-email" ? "Account created. Check your email to confirm it, then sign in." : "";
  const isErr = !!error;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form action={signIn} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/" className="text-sm text-slate-500 hover:text-brand">← Back to store</Link>
        <h1 className="text-2xl font-bold">Sign in</h1>
        {text && <p className={`rounded p-2 text-sm ${isErr ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{text}</p>}
        <input type="hidden" name="next" value={next} />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2" />
        <input name="password" type="password" required placeholder="Password" className="w-full rounded border border-slate-300 px-3 py-2" />
        <button className="w-full rounded bg-brand py-2 font-semibold text-white hover:bg-brand-dark">Sign in</button>
        <p className="text-center text-sm text-slate-600">New here? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand underline">Create an account</Link></p>
      </form>
    </main>
  );
}
