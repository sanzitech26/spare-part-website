/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AddToCart } from "@/components/cart";
import { discount } from "@/components/ProductCard";

export default async function Product({ params }: { params: Promise<{ sku: string }> }) {
  const sku = decodeURIComponent((await params).sku);
  const sb = await supabase();
  const { data: p } = await sb
    .from("products")
    .select("id, sku, name, price, mrp, stock, images, specs, warranty, brands(name, slug), categories(name, slug)")
    .eq("sku", sku).eq("active", true).maybeSingle();
  if (!p) notFound();

  const one = <T,>(v: T | T[] | null) => (Array.isArray(v) ? v[0] : v);
  const brand = one(p.brands), cat = one(p.categories);
  const off = discount(p);
  const specs = Object.entries((p.specs ?? {}) as Record<string, unknown>);

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div>
        {p.images?.[0]
          ? <img src={p.images[0]} alt={p.name} className="aspect-square w-full rounded-xl border border-slate-200 object-cover" />
          : <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">No image</div>}
        {p.images?.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {p.images.slice(1).map((u: string) => <img key={u} src={u} alt="" className="aspect-square rounded border border-slate-200 object-cover" />)}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-500">
          <Link href="/products" className="hover:text-brand">Products</Link>
          {brand && <> / <Link href={`/products?brand=${brand.slug}`} className="hover:text-brand">{brand.name}</Link></>}
          {cat && <> / <Link href={`/products?category=${cat.slug}`} className="hover:text-brand">{cat.name}</Link></>}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">{p.name}</h1>
        <p className="mt-1 text-sm text-slate-500">SKU: {p.sku}</p>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold">₹{p.price}</span>
          {off > 0 && <><s className="text-slate-400">₹{p.mrp}</s><span className="font-semibold text-green-600">{off}% off</span></>}
        </div>
        <p className={`mt-2 text-sm font-semibold ${p.stock > 0 ? "text-green-700" : "text-red-600"}`}>
          {p.stock === 0 ? "Out of stock" : p.stock <= 5 ? `Only ${p.stock} left` : "In stock"}
        </p>
        {p.stock > 0 && (
          <AddToCart className="mt-5 w-full max-w-xs py-3" product={{ id: p.id, sku: p.sku, name: p.name, price: p.price, image: p.images?.[0] }} />
        )}
        {p.warranty && <p className="mt-4 text-sm text-slate-600">Warranty: {p.warranty}</p>}
        {specs.length > 0 && (
          <table className="mt-6 w-full text-sm">
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k} className="border-t border-slate-200"><td className="py-2 pr-4 font-medium text-slate-600">{k}</td><td>{String(v)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
