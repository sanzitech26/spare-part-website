/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AddToCart } from "@/components/cart";
import ProductCard, { CARD_SELECT, Price, Tile, modelNames, one, type P } from "@/components/ProductCard";

export default async function Product({ params }: { params: Promise<{ sku: string }> }) {
  const sku = decodeURIComponent((await params).sku);
  const sb = await supabase();
  const { data } = await sb
    .from("products")
    .select(`${CARD_SELECT}, category_id, description, warranty`)
    .eq("sku", sku).eq("active", true).maybeSingle();
  if (!data) notFound();
  const p = data as unknown as P & { category_id: number | null; description: string | null; warranty: string | null };
  const cat = one(p.categories);
  const models = modelNames(p);
  const specs = Object.entries(p.specs ?? {});

  const { data: rel } = p.category_id
    ? await sb.from("products").select(CARD_SELECT).eq("active", true).eq("category_id", p.category_id).neq("id", p.id).order("id").limit(4)
    : { data: [] };
  const related = (rel ?? []) as unknown as P[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-slate-500">
        <Link href="/products" className="hover:text-accent">All parts</Link>
        {cat && <> / <Link href={`/products?category=${cat.slug}`} className="hover:text-accent">{cat.name}</Link></>}
      </p>
      <div className="mt-4 grid gap-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200"><Tile p={p} big /></div>
          {p.images && p.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images.slice(1).map((u) => <img key={u} src={u} alt="" className="aspect-square rounded border border-slate-200 object-cover" />)}
            </div>
          )}
        </div>
        <div>
          {cat && <p className="text-xs font-semibold uppercase tracking-wider text-accent">{cat.name}</p>}
          <h1 className="mt-1 text-3xl font-extrabold leading-tight">{p.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Part ref: {p.sku}</p>

          <div className="mt-5"><Price p={p} big /></div>
          {p.price != null && (
            <div className="mt-5 max-w-sm">
              <AddToCart className="w-full py-3" product={{ id: p.id, sku: p.sku, name: p.name, price: p.price, image: p.images?.[0] }} />
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Fits</h2>
            {models.length ? (
              <div className="flex flex-wrap gap-2">
                {models.map((m) => <span key={m} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">{m}</span>)}
              </div>
            ) : (
              <p className="text-sm text-slate-600">Fitment details not listed for this part yet.</p>
            )}
          </div>

          {p.description && <p className="mt-6 whitespace-pre-line text-slate-700">{p.description}</p>}

          {(specs.length > 0 || p.warranty) && (
            <table className="mt-6 w-full text-sm">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k} className="border-t border-slate-200"><td className="w-40 py-2 pr-4 font-medium text-slate-500">{k}</td><td>{String(v)}</td></tr>
                ))}
                {p.warranty && <tr className="border-t border-slate-200"><td className="py-2 pr-4 font-medium text-slate-500">Warranty</td><td>{p.warranty}</td></tr>}
              </tbody>
            </table>
          )}
          <p className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Always confirm the part number and your car&apos;s VIN before ordering. See our <Link href="/refund-and-return-policy" className="underline">return policy</Link>.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-bold">More in {cat?.name}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </main>
  );
}
