import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

async function setStatus(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  const status = String(fd.get("status"));
  if (!STATUSES.includes(status)) throw new Error("Bad status");
  const { error } = await sb.from("orders").update({ status }).eq("id", String(fd.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

export default async function Orders() {
  const sb = await requireAdmin();
  const { data: orders } = await sb
    .from("orders")
    .select("id, status, total, address, created_at, order_items(qty, unit_price, products(name))")
    .order("created_at", { ascending: false })
    .limit(100); // ponytail: no pagination until order volume needs it
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <div className="space-y-3">
        {orders?.map((o) => (
          <div key={o.id} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs text-slate-500">{o.id.slice(0, 8)}</span>
                <span className="ml-3 text-slate-500">{new Date(o.created_at).toLocaleString("en-IN")}</span>
              </div>
              <span className="font-bold">₹{o.total}</span>
              <form action={setStatus} className="flex gap-2">
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} className="rounded border border-slate-300 px-2 py-1">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="rounded bg-slate-900 px-3 py-1 text-white hover:bg-brand">Update</button>
              </form>
            </div>
            <ul className="mt-2 text-slate-600">
              {o.order_items?.map((i: { qty: number; unit_price: number; products: { name: string } | { name: string }[] | null }, n: number) => (
                <li key={n}>{i.qty} × {Array.isArray(i.products) ? i.products[0]?.name : i.products?.name} @ ₹{i.unit_price}</li>
              ))}
            </ul>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-500">{typeof o.address === "string" ? o.address : JSON.stringify(o.address, null, 1)}</pre>
          </div>
        ))}
        {!orders?.length && <p className="text-slate-500">No orders yet.</p>}
      </div>
    </>
  );
}
