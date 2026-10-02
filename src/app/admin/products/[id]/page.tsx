/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, serviceDb } from "@/lib/admin";

const BUCKET = "product-images";

async function save(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  const id = String(fd.get("id"));
  const num = (k: string) => {
    const n = Number(fd.get(k));
    if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid ${k}`);
    return n;
  };

  // keep existing images minus the ticked ones, then append uploads
  const removed = new Set(fd.getAll("remove").map(String));
  const images = fd.getAll("keep").map(String).filter((u) => !removed.has(u));
  for (const f of fd.getAll("files")) {
    if (!(f instanceof File) || !f.size) continue;
    if (!f.type.startsWith("image/")) throw new Error("Images only");
    const path = `${crypto.randomUUID()}.${f.name.split(".").pop()}`;
    const { error } = await serviceDb().storage.from(BUCKET).upload(path, f, { contentType: f.type });
    if (error) throw new Error(error.message);
    images.push(serviceDb().storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  const row = {
    sku: String(fd.get("sku")).trim(),
    name: String(fd.get("name")).trim(),
    category_id: fd.get("category_id") ? Number(fd.get("category_id")) : null,
    price: num("price"),
    mrp: fd.get("mrp") ? num("mrp") : null,
    stock: Math.floor(num("stock")),
    warranty: String(fd.get("warranty") || "") || null,
    active: fd.get("active") === "on",
    images,
  };
  const { error } = id === "new" ? await sb.from("products").insert(row) : await sb.from("products").update(row).eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/products");
}

export default async function ProductForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await requireAdmin();
  const { data: categories } = await sb.from("categories").select("id, name").order("name");
  const { data: p } = id === "new" ? { data: null } : await sb.from("products").select("*").eq("id", id).single();
  const input = "w-full rounded border border-slate-300 px-3 py-2";
  return (
    <form action={save} className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">{p ? "Edit product" : "Add product"}</h1>
      <input type="hidden" name="id" value={id} />
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">SKU<input name="sku" required defaultValue={p?.sku} className={input} /></label>
        <label className="text-sm">Category
          <select name="category_id" defaultValue={p?.category_id ?? ""} className={input}>
            <option value="">—</option>
            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-sm">Name<input name="name" required defaultValue={p?.name} className={input} /></label>
      <div className="grid grid-cols-3 gap-4">
        <label className="text-sm">Price (₹)<input name="price" type="number" step="0.01" min="0" required defaultValue={p?.price} className={input} /></label>
        <label className="text-sm">MRP (₹)<input name="mrp" type="number" step="0.01" min="0" defaultValue={p?.mrp ?? ""} className={input} /></label>
        <label className="text-sm">Stock<input name="stock" type="number" min="0" step="1" required defaultValue={p?.stock ?? 0} className={input} /></label>
      </div>
      <label className="block text-sm">Warranty<input name="warranty" defaultValue={p?.warranty ?? ""} placeholder="e.g. 3 years" className={input} /></label>
      <div className="text-sm">
        Images
        {p?.images?.length > 0 && (
          <div className="my-2 flex flex-wrap gap-3">
            {p.images.map((u: string) => (
              <label key={u} className="text-center text-xs">
                <img src={u} alt="" className="h-20 w-20 rounded object-cover" />
                <input type="hidden" name="keep" value={u} />
                <input type="checkbox" name="remove" value={u} /> remove
              </label>
            ))}
          </div>
        )}
        <input name="files" type="file" accept="image/*" multiple className="mt-1 block" />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> Visible in store (untick to hide instead of deleting)</label>
      <div className="flex gap-3">
        <button className="rounded bg-brand px-5 py-2 font-semibold text-white hover:bg-brand-dark">Save</button>
        <Link href="/admin/products" className="rounded border border-slate-300 px-5 py-2">Cancel</Link>
      </div>
    </form>
  );
}
