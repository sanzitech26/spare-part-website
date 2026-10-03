/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

type SP = { q?: string; category?: string; missing?: string };

// Inline row save: price and MRP may be left empty (= "Price on request").
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
  const stock = Math.floor(Number(fd.get("stock") ?? 0));
  if (!Number.isFinite(stock) || stock < 0) throw new Error("Invalid stock");
  const { error } = await sb.from("products")
    .update({ price: money("price"), mrp: money("mrp"), stock, active: fd.get("active") === "on" })
    .eq("id", Number(fd.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export default async function Products({ searchParams }: { searchParams: Promise<SP> }) {
  const { q, category, missing } = await searchParams;
  const sb = await requireAdmin();
  const { data: categories } = await sb.from("categories").select("id, name, slug").order("sort").order("name");
  const cat = categories?.find((c) => c.slug === category);

  let query = sb.from("products").select("id, sku, name, price, mrp, stock, active, images, category_id").order("sku");
  if (cat) query = query.eq("category_id", cat.id);
  if (missing) query = query.is("price", null);
  const term = q?.replace(/[,()%*\\]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
  const { data: products } = await query;
  const { count: noPrice } = await sb.from("products").select("id", { count: "exact", head: true }).is("price", null);

  const input = "w-24 rounded border border-slate-300 px-2 py-1 text-sm";
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-slate-500">
            {products?.length ?? 0} shown · <Link href="/admin/products?missing=1" className={noPrice ? "font-semibold text-red-600 hover:underline" : "text-green-700"}>{noPrice} without a price</Link>
          </p>
        </div>
        <Link href="/admin/products/new" className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Add product</Link>
      </div>

      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or SKU" className="rounded border border-slate-300 px-3 py-1.5 text-sm" />
        <select name="category" defaultValue={category ?? ""} className="rounded border border-slate-300 px-3 py-1.5 text-sm">
          <option value="">All categories</option>
          {categories?.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="missing" value="1" defaultChecked={!!missing} /> No price only</label>
        <button className="rounded bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white">Filter</button>
        <Link href="/admin/products" className="px-2 py-1.5 text-sm text-slate-500 hover:underline">Reset</Link>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr><th className="p-3">Part</th><th>Price ₹</th><th>MRP ₹</th><th>Stock</th><th>Visible</th><th></th><th></th></tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 align-middle">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />}
                    <div><div className="font-medium">{p.name}</div><div className="text-xs text-slate-500">{p.sku}</div></div>
                  </div>
                </td>
                {/* inputs sit in table cells and attach to the row's form via the form attribute */}
                <td><input form={`f${p.id}`} name="price" type="number" step="0.01" min="0" defaultValue={p.price ?? ""} placeholder="—" className={`${input} ${p.price == null ? "border-red-300 bg-red-50" : ""}`} /></td>
                <td><input form={`f${p.id}`} name="mrp" type="number" step="0.01" min="0" defaultValue={p.mrp ?? ""} placeholder="—" className={input} /></td>
                <td><input form={`f${p.id}`} name="stock" type="number" step="1" min="0" defaultValue={p.stock} className="w-20 rounded border border-slate-300 px-2 py-1 text-sm" /></td>
                <td><input form={`f${p.id}`} type="checkbox" name="active" defaultChecked={p.active} /></td>
                <td>
                  <form id={`f${p.id}`} action={quickSave}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded bg-brand px-3 py-1 text-xs font-semibold text-white hover:bg-brand-dark">Save</button>
                  </form>
                </td>
                <td className="pr-3"><Link href={`/admin/products/${p.id}`} className="text-accent hover:underline">Edit</Link></td>
              </tr>
            ))}
            {!products?.length && <tr><td colSpan={7} className="p-6 text-center text-slate-500">No products match.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
