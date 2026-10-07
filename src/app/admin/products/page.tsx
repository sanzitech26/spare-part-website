/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Badge, Card, Icon, PageHeader, ProgressBar, btn, btnGhost, field } from "@/components/admin/ui";

type SP = { q?: string; category?: string; missing?: string };

// Inline row save: price and MRP may be left empty (= "Price coming soon").
async function quickSave(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  const money = (k: string) => {
    const v = String(fd.get(k) ?? "").trim();
    if (!v) return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid ${k}`);
    return n;
  };
  const { error } = await sb.from("products")
    .update({ price: money("price"), mrp: money("mrp"), active: fd.get("active") === "on" })
    .eq("id", Number(fd.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export default async function Products({ searchParams }: { searchParams: Promise<SP> }) {
  const { q, category, missing } = await searchParams;
  const sb = await requireAdmin();
  const { data: categories } = await sb.from("categories").select("id, name, slug").order("sort").order("name");
  const cat = categories?.find((c) => c.slug === category);

  let query = sb.from("products").select("id, sku, name, price, mrp, active, images, category_id").order("sku");
  if (cat) query = query.eq("category_id", cat.id);
  if (missing) query = query.is("price", null);
  const term = q?.replace(/[,()%*\\]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
  const { data: products } = await query;
  const [{ count: noPrice }, { count: total }] = await Promise.all([
    sb.from("products").select("id", { count: "exact", head: true }).is("price", null),
    sb.from("products").select("id", { count: "exact", head: true }),
  ]);
  const priced = (total ?? 0) - (noPrice ?? 0);
  const catName = new Map(categories?.map((c) => [c.id, c.name]));

  const cell = "rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
  return (
    <>
      <PageHeader title="Products" subtitle={`${products?.length ?? 0} shown of ${total ?? 0}`}>
        <Link href="/admin/products/new" className={btn}><Icon name="plus" className="h-4 w-4" /> Add part</Link>
      </PageHeader>

      <Card className="adm-in mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-slate-700"><b className="text-slate-900">{priced}</b> of {total} parts priced</span>
          <Link href="/admin/products?missing=1" className={noPrice ? "font-semibold text-rose-600 hover:underline" : "text-emerald-600"}>{noPrice ? `${noPrice} still need a price` : "All priced"}</Link>
        </div>
        <div className="mt-3"><ProgressBar value={priced} max={total ?? 0} /></div>
      </Card>

      <form className="adm-in mb-4 flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or SKU" className={`${field} w-full sm:w-64`} />
        <select name="category" defaultValue={category ?? ""} className={`${field} w-full sm:w-56`}>
          <option value="">All categories</option>
          {categories?.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 px-1 text-sm text-slate-700"><input type="checkbox" name="missing" value="1" defaultChecked={!!missing} className="h-4 w-4 accent-indigo-600" /> No price only</label>
        <button className={btnGhost}>Filter</button>
        <Link href="/admin/products" className="px-2 text-sm text-slate-500 hover:text-slate-700">Reset</Link>
      </form>

      <div className="adm-in overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px_110px_70px_44px] items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 md:grid">
          <span>Part</span><span>Price £</span><span>MRP £</span><span>Visible</span><span></span><span></span>
        </div>
        <ul className="divide-y divide-slate-200">
          {products?.map((p) => (
            <li key={p.id} className="grid grid-cols-2 items-center gap-x-3 gap-y-2 px-4 py-3 transition hover:bg-slate-50 md:grid-cols-[minmax(0,1fr)_110px_110px_110px_70px_44px]">
              <div className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                {p.images?.[0]
                  ? <img src={p.images[0]} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-slate-200" />
                  : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200"><Icon name="box" className="h-5 w-5" /></span>}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{p.name}</p>
                  <p className="truncate text-xs text-slate-500">{p.sku}{p.category_id && catName.get(p.category_id) ? ` · ${catName.get(p.category_id)}` : ""}</p>
                </div>
              </div>
              {/* inputs attach to this row's form through the form attribute */}
              <label className="block">
                <span className="mb-1 block text-[11px] uppercase tracking-wider text-slate-500 md:hidden">Price £</span>
                <input form={`f${p.id}`} name="price" type="number" step="0.01" min="0" defaultValue={p.price ?? ""} placeholder="—" aria-label="Price" className={`${cell} w-full ${p.price == null ? "border-rose-500/50 bg-rose-500/10 shadow-sm" : ""}`} />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] uppercase tracking-wider text-slate-500 md:hidden">MRP £</span>
                <input form={`f${p.id}`} name="mrp" type="number" step="0.01" min="0" defaultValue={p.mrp ?? ""} placeholder="—" aria-label="MRP" className={`${cell} w-full`} />
              </label>
              <div className="col-span-2 flex items-center gap-3 md:contents">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input form={`f${p.id}`} type="checkbox" name="active" defaultChecked={p.active} className="h-4 w-4 accent-indigo-600" />
                  <Badge tone={p.active ? "emerald" : "slate"}>{p.active ? "Live" : "Hidden"}</Badge>
                </label>
                <form id={`f${p.id}`} action={quickSave} className="ml-auto md:ml-0">
                  <input type="hidden" name="id" value={p.id} />
                  <SubmitButton className={`${btn} px-3 py-1.5 text-xs`} pendingText="…">Save</SubmitButton>
                </form>
                <Link href={`/admin/products/${p.id}`} className="text-sm text-indigo-600 hover:underline">Edit</Link>
              </div>
            </li>
          ))}
          {!products?.length && <li className="p-10 text-center text-sm text-slate-500">No products match.</li>}
        </ul>
      </div>
    </>
  );
}
