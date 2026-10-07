"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./ui";

const groups = [
  { title: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }] },
  { title: "Catalog", items: [
    { href: "/admin/products", label: "Products", icon: "box" },
    { href: "/admin/categories", label: "Categories", icon: "tag" },
    { href: "/admin/models", label: "Car models", icon: "car" },
  ] },
  { title: "Sales", items: [{ href: "/admin/orders", label: "Orders", icon: "cart" }] },
  { title: "Content", items: [
    { href: "/admin/posts", label: "Blog", icon: "pen" },
    { href: "/admin/faqs", label: "FAQ", icon: "help" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "star" },
  ] },
  { title: "Settings", items: [{ href: "/admin/settings", label: "Contact details", icon: "mail" }, { href: "/admin/account", label: "My account", icon: "user" }] },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-sm font-black text-white shadow-md shadow-indigo-600/30">M</span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-slate-900">MBSpareParts.co.uk</p>
        <p className="text-[11px] uppercase tracking-widest text-slate-400">Admin</p>
      </div>
    </div>
  );
}

function Sidebar({ email, signOutAction, onNavigate }: { email: string; signOutAction: () => void | Promise<void>; onNavigate?: () => void }) {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5"><Brand /></div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{g.title}</p>
            {g.items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={onNavigate}
                className={`group relative mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active(i.href) ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {active(i.href) && <span className="absolute -left-3 h-5 w-1 rounded-r-full bg-indigo-600" />}
                <Icon name={i.icon} className={`h-[18px] w-[18px] ${active(i.href) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                {i.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="space-y-2 border-t border-slate-200 p-4">
        <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Icon name="external" className="h-4 w-4" /> View site</Link>
        <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-xs font-bold text-white">{email.slice(0, 1).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-800">{email}</p>
            <p className="text-[11px] text-slate-500">Administrator</p>
          </div>
          <form action={signOutAction}><button title="Sign out" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-rose-600"><Icon name="logout" className="h-4 w-4" /></button></form>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ email, signOutAction, children }: { email: string; signOutAction: () => void | Promise<void>; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-ink-950 text-slate-700 [color-scheme:light]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <Sidebar email={email} signOutAction={signOutAction} />
      </aside>

      {/* mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"><Icon name="menu" /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="adm-in absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-slate-200 bg-white shadow-xl">
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><Icon name="x" className="h-5 w-5" /></button>
            <Sidebar email={email} signOutAction={signOutAction} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="relative lg:pl-64">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.10),transparent_60%),radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_55%)]" />
        <main className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
