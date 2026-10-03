import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard, { CARD_SELECT, type P } from "@/components/ProductCard";

type SP = { q?: string; category?: string; model?: string };

export const metadata = { title: "All parts" };

export default async function Products({ searchParams }: { searchParams: Promise<SP> }) {
  const { q, category, model } = await searchParams;
  const sb = await supabase();
  const [{ data: categories }, { data: models }] = await Promise.all([
    sb.from("categories").select("id, name, slug").order("sort").order("name"),
    sb.from("models").select("id, name, slug").order("sort").order("name"),
  ]);
  const c = categories?.find((x) => x.slug === category);
  const m = models?.find((x) => x.slug === model);

  let query = sb.from("products").select(CARD_SELECT).eq("active", true).order("id");
  if (c) query = query.eq("category_id", c.id);
  if (m) {
    const { data: fit } = await sb.from("product_fitment").select("product_id").eq("model_id", m.id);
    query = query.in("id", (fit ?? []).map((f) => f.product_id));
  }
  // ponytail: ilike scan; switch to the fts column / pg_trgm if the catalog grows past a few thousand rows
  const term = q?.replace(/[,()%*\\]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
  const { data } = await query.limit(120);
  const products = (data ?? []) as unknown as P[];

  const href = (over: Partial<SP>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, category, model, ...over })) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/products?${s}` : "/products";
  };
  const link = (active: boolean) =>
    `block rounded px-3 py-1.5 text-sm ${active ? "bg-neutral-900 font-semibold text-white" : "text-slate-700 hover:bg-slate-100"}`;
  const filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Category</p>
        <Link href={href({ category: undefined })} className={link(!c)}>All categories</Link>
        {categories?.map((x) => <Link key={x.id} href={href({ category: x.slug })} className={link(c?.id === x.id)}>{x.name}</Link>)}
      </div>
      <div>
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Model</p>
        <Link href={href({ model: undefined })} className={link(!m)}>All models</Link>
        {models?.map((x) => <Link key={x.id} href={href({ model: x.slug })} className={link(m?.id === x.id)}>{x.name}</Link>)}
      </div>
    </div>
  );
  const title = [m?.name, c?.name].filter(Boolean).join(" · ") || "All parts";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        {products.length} {products.length === 1 ? "part" : "parts"}{term && <> matching “{term}”</>}
        {(c || m || term) && <> · <Link href="/products" className="text-accent hover:underline">Clear filters</Link></>}
      </p>
      <details className="mb-6 rounded-xl border border-slate-200 bg-white p-3 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold">Filters</summary>
        <div className="mt-3">{filters}</div>
      </details>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-32">{filters}</div></aside>
        {products.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        ) : (
          <p className="h-fit rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No parts found. <Link href="/contact" className="text-accent underline">Ask us</Link> and we will source it.
          </p>
        )}
      </div>
    </main>
  );
}
