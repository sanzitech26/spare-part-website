/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { img } from "@/lib/images";
import ProductCard, { CARD_SELECT, type P } from "@/components/ProductCard";

// Photo tiles for the visual categories; slugs match the seeded categories.
const featured = [
  { slug: "headlights", label: "Headlights", src: img.headlight },
  { slug: "tail-lights", label: "Tail Lights", src: img.taillight },
  { slug: "grilles", label: "Grilles", src: img.grille },
  { slug: "interior", label: "Interior", src: img.interior },
];

const trust = [
  ["Genuine & OEM", "Sourced parts, clearly labelled"],
  ["Fitment help", "We confirm the part fits your car"],
  ["Pan-India delivery", "Packed securely, tracked shipping"],
  ["Easy returns", "7 days on unused parts"],
];

export default async function Home() {
  const sb = await supabase();
  const [{ data: categories }, { data: models }, { data: products }] = await Promise.all([
    sb.from("categories").select("name, slug, products(count)").order("sort").order("name"),
    sb.from("models").select("name, slug").order("sort").order("name"),
    sb.from("products").select(CARD_SELECT).eq("active", true).order("id", { ascending: false }).limit(8),
  ]);

  return (
    <main>
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <img src={img.hero} alt="Grey Mercedes-AMG GT parked on tarmac" fetchPriority="high" className="absolute inset-y-0 right-0 h-full w-full object-cover object-[70%_center] opacity-60 sm:w-4/5 sm:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/20 sm:via-neutral-950/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-32">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Genuine &amp; OEM · Mercedes-Benz</p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] sm:text-6xl">The right part for your Mercedes.</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">Engines, electronics, lighting, bodywork and wheels for A-Class to Sprinter, matched to your model.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-white px-7 py-3 font-semibold text-neutral-900 hover:bg-slate-200">Browse all parts</Link>
            <Link href="/contact" className="rounded-full border border-slate-500 px-7 py-3 font-semibold text-white hover:border-white">Ask about fitment</Link>
          </div>
          <div className="mt-10">
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">Shop by model</p>
            <div className="flex flex-wrap gap-2">
              {models?.map((m) => (
                <Link key={m.slug} href={`/products?model=${m.slug}`} className="rounded-full border border-neutral-700 bg-neutral-900/60 px-4 py-1.5 text-sm text-slate-200 backdrop-blur hover:border-slate-300 hover:text-white">
                  {m.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-silver">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 lg:grid-cols-4">
          {trust.map(([t, s]) => (
            <div key={t}><p className="font-semibold text-slate-900">{t}</p><p className="text-sm text-slate-600">{s}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="mb-6 text-2xl font-bold">Popular categories</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {featured.map((f) => (
            <Link key={f.slug} href={`/products?category=${f.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-neutral-900">
              <img src={f.src} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white">{f.label} <span className="inline-block transition group-hover:translate-x-1">→</span></p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">All categories</h2>
          <Link href="/products" className="text-sm font-medium text-accent hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories?.map((c) => {
            const n = (c.products as unknown as { count: number }[])?.[0]?.count ?? 0;
            return (
              <Link key={c.slug} href={`/products?category=${c.slug}`} className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-900 hover:shadow-md">
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="mt-1 text-sm text-slate-500">{n} {n === 1 ? "part" : "parts"}</p>
                <p className="mt-3 text-sm font-medium text-accent opacity-0 transition group-hover:opacity-100">View parts →</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-silver py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-bold">Featured parts</h2>
          {products?.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{(products as unknown as P[]).map((p) => <ProductCard key={p.id} p={p} />)}</div>
          ) : (
            <p className="text-slate-500">Parts will appear here once they are added in the admin panel.</p>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-neutral-900 py-20 text-center text-white">
        <img src={img.emblem} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 to-neutral-950/40" />
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold">Can&apos;t find your part?</h2>
          <p className="mt-2 text-slate-300">Send us your model, year and VIN and we will find the exact part for you.</p>
          <Link href="/contact" className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-semibold text-neutral-900 hover:bg-slate-200">Contact us</Link>
        </div>
      </section>
    </main>
  );
}
