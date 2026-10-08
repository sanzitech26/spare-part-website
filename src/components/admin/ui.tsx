// Shared look for the admin (light theme): class constants + a few tiny components. Plain Tailwind, no UI library.
import Link from "next/link";

// fieldBase has no width so call sites can size it (w-24, w-40); field is the full-width default.
export const fieldBase =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
export const field = `w-full ${fieldBase}`;
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:brightness-110 disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50";
export const btnDanger = "text-sm font-medium text-rose-600 transition hover:text-rose-700";
export const labelCls = "block text-xs font-medium uppercase tracking-wider text-slate-500";

const paths: Record<string, string> = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  box: "M21 8l-9-5-9 5v8l9 5 9-5zM3.3 7.5L12 12.5l8.7-5M12 22V12.5",
  tag: "M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01",
  car: "M3 13l2-6h14l2 6v4h-2a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H3zM3 13h18",
  cart: "M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20.5h.01M18 20.5h.01",
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  plus: "M12 5v14M5 12h14",
  menu: "M3 6h18M3 12h18M3 18h18",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  alert: "M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  coin: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM14.8 9a3 3 0 0 0-2.8-1.5c-1.7 0-3 .9-3 2.2 0 3 6 1.5 6 4.3 0 1.3-1.3 2-3 2a3.2 3.2 0 0 1-3-1.5M12 6v1.5M12 17v1.5",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeOff: "M17.9 17.9A10.9 10.9 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2M1 1l22 22",
};
export function Icon({ name, className = "h-5 w-5" }: { name: keyof typeof paths | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name] ?? paths.box} />
    </svg>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="adm-in mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const tones = {
  indigo: { glow: "from-indigo-300/40", icon: "text-indigo-600 bg-indigo-50 ring-indigo-200" },
  violet: { glow: "from-violet-300/40", icon: "text-violet-600 bg-violet-50 ring-violet-200" },
  amber: { glow: "from-amber-300/40", icon: "text-amber-600 bg-amber-50 ring-amber-200" },
  emerald: { glow: "from-emerald-300/40", icon: "text-emerald-600 bg-emerald-50 ring-emerald-200" },
  rose: { glow: "from-rose-300/40", icon: "text-rose-600 bg-rose-50 ring-rose-200" },
};
type Tone = keyof typeof tones;

export function StatCard({ label, value, hint, icon, tone = "indigo", href }: { label: string; value: React.ReactNode; hint?: string; icon: string; tone?: Tone | "cyan"; href?: string }) {
  const t = tones[tone === "cyan" ? "indigo" : tone];
  const body = (
    <div className="adm-in group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:border-slate-300 hover:shadow-md">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl transition group-hover:scale-125`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <span className={`rounded-xl p-2.5 ring-1 ${t.icon}`}><Icon name={icon} /></span>
      </div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

const badgeTones: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  cyan: "bg-sky-50 text-sky-700 ring-sky-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};
export function Badge({ tone = "slate", children }: { tone?: keyof typeof badgeTones; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${badgeTones[tone]}`}>{children}</span>;
}
export const statusTone: Record<string, keyof typeof badgeTones> = { pending: "amber", paid: "cyan", shipped: "violet", delivered: "emerald", cancelled: "rose" };

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
