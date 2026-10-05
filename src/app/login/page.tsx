import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SubmitButton from "@/components/admin/SubmitButton";
import PasswordField from "@/components/admin/PasswordField";
import { Icon } from "@/components/admin/ui";

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

export const metadata = { title: "Admin sign in" };

const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20";
const features = [["box", "Catalog"], ["cart", "Orders"], ["coin", "Pricing"], ["pen", "Blog"], ["help", "FAQ"], ["star", "Reviews"]];

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; msg?: string }> }) {
  const { error, next = "", msg } = await searchParams;
  const text = error === "invalid" ? "Wrong email or password." : error === "not-admin" ? "This account is not an admin." : "";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ececf0] p-4 sm:p-8 [color-scheme:light]">
      <div className="adm-in grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white p-3 shadow-2xl shadow-slate-400/30 lg:grid-cols-2">
        {/* gradient panel */}
        <div className="relative isolate flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a1fd0] via-[#3b34e0] to-[#2a6cf0] p-7 text-white lg:min-h-[560px] lg:p-10">
          <div className="absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-cyan-400/50 blur-3xl" />
          <div className="absolute -right-20 -top-16 -z-10 h-72 w-72 rounded-full bg-violet-400/60 blur-3xl" />
          <div className="absolute bottom-10 right-0 -z-10 h-64 w-64 rounded-full bg-blue-300/40 blur-3xl" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_70%,rgba(255,255,255,0.12),transparent_60%)]" />
          <div>
            <p className="text-sm text-white/80">You can easily</p>
            <h2 className="mt-1 max-w-xs text-2xl font-medium leading-tight sm:text-3xl lg:text-[34px] lg:leading-[1.15]">Manage your parts store with ease</h2>
          </div>
          <div className="hidden lg:block">
            <p className="mb-3 text-center text-xs text-white/70">Everything in one place</p>
            <div className="flex justify-between gap-3 overflow-hidden text-white/85 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              {features.map(([icon, label]) => (
                <span key={label} className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium"><Icon name={icon} className="h-4 w-4" /> {label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* form */}
        <div className="flex flex-col justify-center px-4 py-8 sm:px-10 lg:px-14">
          <form action={signIn} className="mx-auto w-full max-w-sm space-y-4">
            <div className="mb-2">
              <h1 className="text-3xl font-medium tracking-tight text-slate-900">Welcome back</h1>
              <p className="mt-1.5 text-sm text-slate-500">Please log in to your account to continue.</p>
            </div>
            {text && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{text}</p>}
            {msg === "updated" && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Your details were updated. Please sign in again.</p>}
            <input type="hidden" name="next" value={next} />
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-900">Email address</span>
              <input name="email" type="email" required autoComplete="username" placeholder="you@company.com" className={input} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-900">Password</span>
              <PasswordField name="password" autoComplete="current-password" placeholder="Enter your password" className={input} />
            </label>
            <SubmitButton className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3a2fd8] py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-[#2f25bd] disabled:opacity-60" pendingText="Signing in…">Log in</SubmitButton>
            <p className="pt-2 text-center text-xs text-slate-500">
              Not an admin? <Link href="/" className="font-semibold text-[#3a2fd8] hover:underline">Back to the store</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
