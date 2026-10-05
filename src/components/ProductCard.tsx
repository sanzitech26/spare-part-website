/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AddToCart } from "./cart";

type Rel<T> = T | T[] | null;
export type P = {
  id: number; sku: string; name: string; price: number | null; mrp: number | null; stock: number; images: string[] | null;
  specs?: Record<string, string> | null;
  categories?: Rel<{ name: string; slug: string }>;
  product_fitment?: { models: Rel<{ name: string }> }[] | null;
};

// Select string every list query should use so ProductCard has what it needs.
export const CARD_SELECT = "id, sku, name, price, mrp, stock, images, specs, categories(name, slug), product_fitment(models(name))";

export const one = <T,>(v: Rel<T> | undefined): T | null => (Array.isArray(v) ? v[0] ?? null : v ?? null);
export const modelNames = (p: P) => (p.product_fitment ?? []).map((f) => one(f.models)?.name).filter((n): n is string => !!n);
export const discount = (p: { price: number | null; mrp: number | null }) =>
  p.price && p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
export const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

// Placeholder tile colours per category (full class names so Tailwind can see them).
const tints: Record<string, string> = {
  "engine-transmission": "from-slate-600 to-neutral-900",
  "cooling-ac": "from-cyan-800 to-neutral-900",
  "electronics-sensors": "from-indigo-800 to-neutral-900",
  "brakes-suspension": "from-red-900 to-neutral-900",
  "bumpers-front-ends": "from-zinc-600 to-neutral-900",
  grilles: "from-stone-600 to-neutral-900",
  headlights: "from-amber-700 to-neutral-900",
  "tail-lights": "from-rose-800 to-neutral-900",
  "wheels-rims": "from-slate-500 to-neutral-900",
  "body-panels-mirrors": "from-sky-800 to-neutral-900",
  interior: "from-orange-900 to-neutral-900",
};

export function Tile({ p, big = false }: { p: P; big?: boolean }) {
  const cat = one(p.categories);
  if (p.images?.[0]) return <img src={p.images[0]} alt={p.name} className={`${big ? "aspect-square" : "aspect-[4/3]"} w-full object-cover`} />;
  return (
    <div className={`${big ? "aspect-square" : "aspect-[4/3]"} flex w-full flex-col items-center justify-center gap-1 bg-gradient-to-br ${tints[cat?.slug ?? ""] ?? "from-slate-600 to-neutral-900"} text-white/80`}>
      <span className={`${big ? "text-base" : "text-xs"} font-mono font-semibold tracking-[0.25em]`}>{p.sku}</span>
      <span className="text-[10px] uppercase tracking-widest text-white/40">Photo coming soon</span>
    </div>
  );
}

export function Price({ p, big = false }: { p: P; big?: boolean }) {
  if (p.price == null) return <span className={`${big ? "text-2xl" : "text-sm"} font-semibold text-slate-500`}>Price coming soon</span>;
  const off = discount(p);
  return (
    <div className="flex items-baseline gap-2">
      <span className={`${big ? "text-3xl" : "text-lg"} font-bold text-slate-900`}>{fmt(p.price)}</span>
      {off > 0 && p.mrp && <><s className="text-xs text-slate-400">{fmt(p.mrp)}</s><span className="text-xs font-semibold text-green-600">{off}% off</span></>}
    </div>
  );
}

export default function ProductCard({ p }: { p: P }) {
  const cat = one(p.categories);
  const models = modelNames(p);
  const href = `/products/${encodeURIComponent(p.sku)}`;
  const meta = [p.specs?.Position, p.specs?.Chassis].filter(Boolean).join(" · ");
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={href} className="block overflow-hidden"><Tile p={p} /></Link>
      <div className="flex flex-1 flex-col p-4">
        {cat && <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{cat.name}</p>}
        <Link href={href} className="mt-1 line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold leading-snug text-slate-900 hover:text-accent">{p.name}</Link>
        {meta && <p className="mt-1 text-xs text-slate-500">{meta}</p>}
        <div className="mt-2 flex flex-wrap gap-1">
          {models.length
            ? <>
                {models.slice(0, 3).map((m) => <span key={m} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">{m}</span>)}
                {models.length > 3 && <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">+{models.length - 3}</span>}
              </>
            : null}
        </div>
        <div className="mt-auto space-y-3 pt-4">
          <Price p={p} />
          {p.price != null && <AddToCart className="w-full" product={{ id: p.id, sku: p.sku, name: p.name, price: p.price, image: p.images?.[0] }} />}
        </div>
      </div>
    </div>
  );
}
