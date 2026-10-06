import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Badge, Card, PageHeader, fieldBase, statusTone } from "@/components/admin/ui";

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

type Addr = { name?: string; email?: string; line1?: string; line2?: string; city?: string; state?: string; pincode?: string };
type Item = { qty: number; unit_price: number; products: { name: string; sku: string } | { name: string; sku: string }[] | null };

export default async function Orders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const sb = await requireAdmin();
  const active = STATUSES.includes(status ?? "") ? status : undefined;

  let query = sb
    .from("orders")
    .select("id, status, total, shipping, address, created_at, order_items(qty, unit_price, products(name, sku))")
    .order("created_at", { ascending: false })
    .limit(100); // ponytail: no pagination until order volume needs it
  if (active) query = query.eq("status", active);
  const [{ data: orders }, { data: all }] = await Promise.all([query, sb.from("orders").select("status").limit(5000)]);
  const counts: Record<string, number> = {};
  for (const o of all ?? []) counts[o.status] = (counts[o.status] ?? 0) + 1;

  const tab = (on: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${on ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25" : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`;

  return (
    <>
      <PageHeader title="Orders" subtitle={`${all?.length ?? 0} total`} />
      <div className="adm-in -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <Link href="/admin/orders" className={tab(!active)}>All <span className="opacity-70">{all?.length ?? 0}</span></Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`${tab(active === s)} capitalize`}>{s} <span className="opacity-70">{counts[s] ?? 0}</span></Link>
        ))}
      </div>

      <div className="space-y-4">
        {orders?.map((o) => {
          const a = (o.address ?? {}) as Addr;
          const items = (o.order_items ?? []) as unknown as Item[];
          return (
            <Card key={o.id} className="adm-in space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                  <span className="font-mono text-xs text-slate-500">#{String(o.id).slice(0, 8)}</span>
                  <span className="text-xs text-slate-500">{new Date(o.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">${Number(o.total).toLocaleString("en-US")}</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</p>
                  <p className="font-medium text-slate-900">{a.name ?? "Guest"}</p>
                  {a.email && <a href={`mailto:${a.email}`} className="text-indigo-600 hover:underline">{a.email}</a>}
                  <p className="mt-2 text-slate-400">{[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ")}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Items</p>
                  <ul className="space-y-1">
                    {items.map((i, n) => {
                      const p = Array.isArray(i.products) ? i.products[0] : i.products;
                      return (
                        <li key={n} className="flex justify-between gap-3 text-slate-700">
                          <span className="min-w-0 truncate">{i.qty} × {p?.name} <span className="text-slate-600">{p?.sku}</span></span>
                          <span className="shrink-0">${(i.qty * Number(i.unit_price)).toLocaleString("en-US")}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-xs text-slate-500">
                    <span>Shipping</span><span>{Number(o.shipping) ? `$${o.shipping}` : "Free"}</span>
                  </p>
                </div>
              </div>

              <form action={setStatus} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={o.id} />
                <span className="text-xs uppercase tracking-wider text-slate-500">Update status</span>
                <select name="status" defaultValue={o.status} className={`${fieldBase} w-40 capitalize`}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <SubmitButton className="inline-flex items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100" pendingText="Updating…">Update</SubmitButton>
              </form>
            </Card>
          );
        })}
        {!orders?.length && (
          <Card className="py-12 text-center text-sm text-slate-500">{active ? `No ${active} orders.` : "No orders yet. They will appear here as customers check out."}</Card>
        )}
      </div>
    </>
  );
}
