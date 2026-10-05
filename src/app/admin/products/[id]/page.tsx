/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, serviceDb } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Card, PageHeader, btn, btnGhost, field, labelCls } from "@/components/admin/ui";

const BUCKET = "product-images";

async function save(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  const id = String(fd.get("id"));
  const money = (k: string) => {
    const v = String(fd.get(k) ?? "").trim();
    if (!v) return null; // empty price = "Price coming soon"
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

  // fitment: replace the product's model list with the ticked chips
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

  return (
    <form action={save}>
      <input type="hidden" name="id" value={id} />
      <PageHeader title={p ? "Edit part" : "Add part"} subtitle={p ? `${p.sku}` : "New part for the catalog"}>
        <div className="flex gap-2">
          <Link href="/admin/products" className={btnGhost}>Cancel</Link>
          <SubmitButton className={btn}>Save part</SubmitButton>
        </div>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card className="adm-in space-y-4">
            <h2 className="font-semibold text-slate-900">Details</h2>
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <label className="space-y-1.5"><span className={labelCls}>Part ref / SKU</span><input name="sku" required defaultValue={p?.sku} placeholder="MB-054" className={field} /></label>
              <label className="space-y-1.5"><span className={labelCls}>Name</span><input name="name" required defaultValue={p?.name} className={field} /></label>
            </div>
            <label className="block space-y-1.5"><span className={labelCls}>Description (optional)</span><textarea name="description" rows={3} defaultValue={p?.description ?? ""} className={field} /></label>
          </Card>

          <Card className="adm-in space-y-4">
            <h2 className="font-semibold text-slate-900">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-1.5"><span className={labelCls}>Price (₹)</span><input name="price" type="number" step="0.01" min="0" defaultValue={p?.price ?? ""} placeholder="empty = coming soon" className={field} /></label>
              <label className="space-y-1.5"><span className={labelCls}>MRP (₹, optional)</span><input name="mrp" type="number" step="0.01" min="0" defaultValue={p?.mrp ?? ""} className={field} /></label>
            </div>
            <p className="text-xs text-slate-500">Leave Price empty to show &quot;Price coming soon&quot;. Customers can add a part to the cart as soon as it has a price.</p>
          </Card>

          <Card className="adm-in space-y-4">
            <h2 className="font-semibold text-slate-900">Specifications</h2>
            <label className="block space-y-1.5"><span className={labelCls}>Warranty</span><input name="warranty" defaultValue={p?.warranty ?? ""} placeholder="e.g. 12 months" className={field} /></label>
            <label className="block space-y-1.5">
              <span className={labelCls}>Specs (one per line, e.g. Position: Front)</span>
              <textarea name="specs" rows={6} defaultValue={Object.entries(p?.specs ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n")} className={`${field} font-mono`} />
            </label>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="adm-in space-y-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span><span className="block text-sm font-semibold text-slate-900">Visible in store</span><span className="text-xs text-slate-500">Turn off to hide instead of deleting</span></span>
              <span className="relative inline-flex">
                <input type="checkbox" name="active" defaultChecked={p?.active ?? true} className="peer sr-only" />
                <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-blue-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/50 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
              </span>
            </label>
            <label className="block space-y-1.5">
              <span className={labelCls}>Category</span>
              <select name="category_id" defaultValue={p?.category_id ?? ""} className={field}>
                <option value="">—</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </Card>

          <Card className="adm-in">
            <h2 className="mb-3 font-semibold text-slate-900">Fits these models</h2>
            <div className="flex flex-wrap gap-2">
              {models?.map((m) => (
                <label key={m.id} className="cursor-pointer">
                  <input type="checkbox" name="models" value={m.id} defaultChecked={fits.has(m.id)} className="peer sr-only" />
                  <span className="inline-block rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 transition peer-checked:border-indigo-400 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/50">{m.name}</span>
                </label>
              ))}
              {!models?.length && <span className="text-sm text-slate-500">No models yet. <Link href="/admin/models" className="text-indigo-600 underline">Add models</Link></span>}
            </div>
          </Card>

          <Card className="adm-in">
            <h2 className="mb-3 font-semibold text-slate-900">Images</h2>
            {p?.images?.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                {p.images.map((u: string) => (
                  <label key={u} className="group relative block cursor-pointer overflow-hidden rounded-lg ring-1 ring-slate-200">
                    <img src={u} alt="" className="aspect-square w-full object-cover" />
                    <input type="hidden" name="keep" value={u} />
                    <input type="checkbox" name="remove" value={u} className="peer sr-only" />
                    <span className="absolute inset-0 flex items-center justify-center bg-rose-600/80 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 peer-checked:opacity-100">Remove ✓</span>
                  </label>
                ))}
              </div>
            )}
            <input name="files" type="file" accept="image/*" multiple className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200" />
            <p className="mt-2 text-xs text-slate-500">Click an image to mark it for removal, then save.</p>
          </Card>
        </div>
      </div>
    </form>
  );
}
