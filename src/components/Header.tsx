import Link from "next/link";
import { CartBadge } from "./cart";
import { brands, brandSlug, primary, more } from "./nav";

// Hover/focus-within dropdown: no JS, works with keyboard and tap.
function Menu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 hover:text-brand">{label} <span className="text-[10px]">▾</span></button>
      <div className="invisible absolute left-0 top-full z-20 min-w-48 rounded-lg border border-slate-200 bg-white py-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}
const item = "block px-4 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-brand";

export default function Header() {
  return (
    <>
      <div className="bg-slate-900 py-1.5 text-center text-xs text-slate-300">
        Live support: +91-XXXXXXXXXX · Mon–Sat 10 AM – 7 PM
      </div>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
            BRAND<span className="text-brand">NAME</span>
          </Link>
          <form action="/products" className="order-last w-full md:order-none md:w-auto md:flex-1">
            <input
              name="q"
              placeholder="Search parts, SKU, model…"
              className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </form>
          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-brand">Login</Link>
            <Link href="/cart" className="relative rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Cart<CartBadge />
            </Link>
            {/* mobile menu */}
            <details className="relative md:hidden">
              <summary className="cursor-pointer list-none rounded border border-slate-300 px-3 py-2 text-sm" aria-label="Menu">☰</summary>
              <div className="absolute right-0 top-full z-20 mt-2 max-h-[75vh] w-64 overflow-y-auto rounded-lg border border-slate-200 bg-white py-2 text-sm shadow-lg">
                {primary.map((l) => <Link key={l.href} href={l.href} className={item}>{l.label}</Link>)}
                <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase text-slate-400">Brands</p>
                {brands.map((b) => <Link key={b} href={`/products?brand=${brandSlug(b)}`} className={item}>{b}</Link>)}
                <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase text-slate-400">More</p>
                {more.map((l) => <Link key={l.href} href={l.href} className={item}>{l.label}</Link>)}
              </div>
            </details>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-6xl items-center gap-6 px-4 pb-3 text-sm font-medium text-slate-600 md:flex">
          <Link href="/products" className="hover:text-brand">Products</Link>
          <Menu label="Brands">
            {brands.map((b) => <Link key={b} href={`/products?brand=${brandSlug(b)}`} className={item}>{b}</Link>)}
          </Menu>
          {primary.slice(1).map((l) => <Link key={l.href} href={l.href} className="hover:text-brand">{l.label}</Link>)}
          <Menu label="More">
            {more.map((l) => <Link key={l.href} href={l.href} className={item}>{l.label}</Link>)}
          </Menu>
        </nav>
      </header>
    </>
  );
}
