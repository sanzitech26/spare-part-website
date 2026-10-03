import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CartBadge } from "./cart";
import { primary, more } from "./nav";

// Hover/focus-within dropdown: no JS, works with keyboard and tap.
function Menu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 hover:text-white">{label} <span className="text-[10px]">▾</span></button>
      <div className="invisible absolute left-0 top-full z-20 min-w-56 rounded-lg border border-slate-200 bg-white py-2 text-sm font-normal opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}
const item = "block px-4 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-accent";
const label = "px-4 pb-1 pt-3 text-xs font-semibold uppercase text-slate-400";

export default async function Header() {
  const sb = await supabase();
  const [{ data: categories }, { data: models }] = await Promise.all([
    sb.from("categories").select("name, slug").order("sort").order("name"),
    sb.from("models").select("name, slug").order("sort").order("name"),
  ]);
  const cat = categories?.map((c) => <Link key={c.slug} href={`/products?category=${c.slug}`} className={item}>{c.name}</Link>);
  const mod = models?.map((m) => <Link key={m.slug} href={`/products?model=${m.slug}`} className={item}>{m.name}</Link>);

  return (
    <>
      <div className="bg-black py-1.5 text-center text-xs text-slate-400">
        Genuine Mercedes-Benz parts · Fitment help: +91-XXXXXXXXXX · Mon–Sat 10 AM – 7 PM
      </div>
      <header className="sticky top-0 z-30 bg-neutral-900 text-slate-300 shadow-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
            BRAND<span className="font-light text-slate-400">NAME</span>
          </Link>
          <form action="/products" className="order-last w-full md:order-none md:w-auto md:flex-1">
            <input
              name="q"
              placeholder="Search by part, SKU or model…"
              className="w-full rounded-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-slate-400 focus:outline-none"
            />
          </form>
          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <Link href="/cart" className="relative rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-slate-200">
              Cart<CartBadge />
            </Link>
            {/* mobile menu */}
            <details className="relative md:hidden">
              <summary className="cursor-pointer list-none rounded border border-neutral-700 px-3 py-2 text-sm" aria-label="Menu">☰</summary>
              <div className="absolute right-0 top-full z-20 mt-2 max-h-[75vh] w-64 overflow-y-auto rounded-lg border border-slate-200 bg-white py-2 text-sm text-slate-700 shadow-xl">
                <Link href="/products" className={item}>All parts</Link>
                {primary.map((l) => <Link key={l.href} href={l.href} className={item}>{l.label}</Link>)}
                <p className={label}>Categories</p>{cat}
                <p className={label}>Shop by model</p>{mod}
                <p className={label}>More</p>
                {more.map((l) => <Link key={l.href} href={l.href} className={item}>{l.label}</Link>)}
              </div>
            </details>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-6xl items-center gap-7 px-4 pb-3 text-sm font-medium md:flex">
          <Link href="/products" className="text-white">All parts</Link>
          <Menu label="Categories">{cat}</Menu>
          <Menu label="Shop by model">{mod}</Menu>
          {primary.map((l) => <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>)}
          <Menu label="More">{more.map((l) => <Link key={l.href} href={l.href} className={item}>{l.label}</Link>)}</Menu>
        </nav>
      </header>
    </>
  );
}
