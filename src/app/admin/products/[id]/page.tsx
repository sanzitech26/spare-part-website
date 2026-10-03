/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, serviceDb } from "@/lib/admin";

const BUCKET = "product-images";

async function save(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  const id = String(fd.get("id"));
  const money = (k: string) => {
    const v = String(fd.get(k) ?? "").trim();
    if (!v) return null; // empty price = "Price on request"
    const n = Number(v);
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
    description: String(fd.get("description") || "").trim() || null,
    price: money("price"),
    mrp: money("mrp"),
    warranty: String(fd.get("warranty") || "") || null,
    // one "Key: Value" per line
    specs: Object.fromEntries(
      String(fd.get("specs") || "")
        .split(/\r?\n/)
        .map((line) => line.split(/:([\s\S]*)/))
        .filter(([k, v]) => k.trim() && v?.trim())
        .map(([k, v]) => [k.trim(), v.trim()]),
    ),
    active: fd.get("active") === "on",
    images,
  };

  let pid = Number(id);
  if (id === "new") {
    const { data: brand } = await sb.from("brands").select("id").eq("slug", "mercedes-benz").maybeSingle();
    const { data, error } = await sb.from("products").insert({ ...row, brand_id: brand?.id ?? null }).select("id").single();
    if (error) throw new Error(error.message);
    pid = data.id;
  } else {
    const { error } = await sb.from("products").update(row).eq("id", pid);
    if (error) throw new Error(error.message);
  }

  // fitment: replace the product's model list with the ticked boxes
  const modelIds = fd.getAll("models").map(Number).filter(Number.isInteger);
  const { error: delErr } = await sb.from("product_fitment").delete().eq("product_id", pid);
  if (delErr) throw new Error(delErr.message);
  if (modelIds.length) {
    const { error } = await sb.from("product_fitment").insert(modelIds.map((model_id) => ({ product_id: pid, model_id })));
    if (error) throw new Error(error.message);
  }
  redirect("/admin/products");
}

export default async function ProductForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await requireAdmin();
  const { data: categories } = await sb.from("categories").select("id, name").order("sort").order("name");
  const { data: models } = await sb.from("models").select("id, name").order("sort").order("name");
  const { data: p } = id === "new" ? { data: null } : await sb.from("products").select("*, product_fitment(model_id)").eq("id", id).single();
  const fits = new Set<number>((p?.product_fitment ?? []).map((f: { model_id: number }) => f.model_id));
  const input = "w-full rounded border border-slate-300 px-3 py-2";
  return (
    <form action={save} className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">{p ? "Edit part" : "Add part"}</h1>
      <input type="hidden" name="id" value={id} />
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">Part ref / SKU<input name="sku" required defaultValue={p?.sku} className={input} /></label>
        <label className="text-sm">Category
          <select name="category_id" defaultValue={p?.category_id ?? ""} className={input}>
            <option value="">—</option>
            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-sm">Name<input name="name" required defaultValue={p?.name} className={input} /></label>
      <label className="block text-sm">Description (optional)
        <textarea name="description" rows={3} defaultValue={p?.description ?? ""} className={input} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">Price (₹)<input name="price" type="number" step="0.01" min="0" defaultValue={p?.price ?? ""} placeholder="empty = coming soon" className={input} /></label>
        <label className="text-sm">MRP (₹)<input name="mrp" type="number" step="0.01" min="0" defaultValue={p?.mrp ?? ""} className={input} /></label>
      </div>
      <p className="-mt-2 text-xs text-slate-500">Leave Price empty to show &quot;Price coming soon&quot;. Customers can add a part to the cart as soon as it has a price.</p>

      <fieldset className="text-sm">
        <legend className="mb-1">Fits these models</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {models?.map((m) => (
            <label key={m.id} className="flex items-center gap-1.5"><input type="checkbox" name="models" value={m.id} defaultChecked={fits.has(m.id)} /> {m.name}</label>
          ))}
          {!models?.length && <span className="text-slate-500">No models yet. <Link href="/admin/models" className="text-accent underline">Add models</Link></span>}
        </div>
      </fieldset>

      <label className="block text-sm">Warranty<input name="warranty" defaultValue={p?.warranty ?? ""} placeholder="e.g. 12 months" className={input} /></label>
      <label className="block text-sm">Specifications (one per line, e.g. Position: Front)
        <textarea name="specs" rows={5} defaultValue={Object.entries(p?.specs ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n")} className={input} />
      </label>
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
