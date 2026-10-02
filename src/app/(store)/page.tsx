/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

const HERO = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1800&q=70&auto=format&fit=crop";
const perks = ["100% Original Parts", "Free shipping over ₹999", "7-day easy returns", "Secure payments"];

export default async function Home() {
  const sb = await supabase();
  const [{ data: brands }, { data: products }] = await Promise.all([
    sb.from("brands").select("name, slug").order("name"),
    sb.from("products").select("id, sku, name, price, mrp, stock, images").eq("active", true).order("id", { ascending: false }).limit(8),
  ]);
  return (
    <main>
      <section className="relative">
        <img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-400">Genuine two-wheeler parts</p>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">100% original spare parts for your ride.</h1>
          <p className="mt-4 max-w-md text-slate-200">Find the exact part for your bike by brand, model and year.</p>
          <Link href="/products" className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold hover:bg-brand-dark">Shop all parts</Link>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-4 text-center text-sm font-medium text-slate-700 sm:grid-cols-4">
          {perks.map((p) => <div key={p}>{p}</div>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Shop by brand</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {brands?.map((b) => (
            <Link key={b.slug} href={`/products?brand=${b.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 text-center font-semibold text-slate-800 shadow-sm transition hover:border-brand hover:text-brand hover:shadow-md">
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-bold">Latest parts</h2>
          {products?.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          ) : (
            <p className="text-slate-500">Products will appear here once they are added in the admin panel.</p>
          )}
        </div>
      </section>
    </main>
  );
}
