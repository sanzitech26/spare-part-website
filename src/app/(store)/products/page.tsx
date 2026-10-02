import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

type SP = { q?: string; brand?: string; category?: string };

export default async function Products({ searchParams }: { searchParams: Promise<SP> }) {
  const { q, brand, category } = await searchParams;
  const sb = await supabase();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    sb.from("brands").select("id, name, slug").order("name"),
    sb.from("categories").select("id, name, slug").order("name"),
  ]);
  const b = brands?.find((x) => x.slug === brand);
  const c = categories?.find((x) => x.slug === category);

  let query = sb.from("products").select("id, sku, name, price, mrp, stock, images").eq("active", true).order("id", { ascending: false });
  if (b) query = query.eq("brand_id", b.id);
  if (c) query = query.eq("category_id", c.id);
  // ponytail: ilike scan; switch to the fts column / pg_trgm if the catalog grows past a few thousand rows
  const term = q?.replace(/[,()%*\\]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
  const { data: products } = await query.limit(60);

  const href = (over: Partial<SP>) => {
    const p = new URLSearchParams();
    const next = { q, brand, category, ...over };
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/products?${s}` : "/products";
  };
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${active ? "border-brand bg-brand text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand"}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-1 text-3xl font-extrabold">{b ? `${b.name} parts` : "All products"}</h1>
      {term && <p className="mb-3 text-slate-500">Results for “{term}”</p>}
      <div className="mb-3 flex flex-wrap gap-2">
        <Link href={href({ brand: undefined })} className={chip(!b)}>All brands</Link>
        {brands?.map((x) => <Link key={x.id} href={href({ brand: x.slug })} className={chip(b?.id === x.id)}>{x.name}</Link>)}
      </div>
      {!!categories?.length && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href={href({ category: undefined })} className={chip(!c)}>All categories</Link>
          {categories.map((x) => <Link key={x.id} href={href({ category: x.slug })} className={chip(c?.id === x.id)}>{x.name}</Link>)}
        </div>
      )}
      {products?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No products found.</p>
      )}
    </main>
  );
}
