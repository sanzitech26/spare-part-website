import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { Badge, Card, Icon, PageHeader, ProgressBar, StatCard, btn, btnGhost, statusTone } from "@/components/admin/ui";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function Dashboard() {
  const sb = await requireAdmin();
  const count = (q: PromiseLike<{ count: number | null }>) => Promise.resolve(q).then((r) => r.count ?? 0);
  const head = { count: "exact" as const, head: true };

  const [total, live, noPrice, orders, pending, { data: valueRows }, { data: recent }] = await Promise.all([
    count(sb.from("products").select("id", head)),
    count(sb.from("products").select("id", head).eq("active", true)),
    count(sb.from("products").select("id", head).is("price", null)),
    count(sb.from("orders").select("id", head)),
    count(sb.from("orders").select("id", head).eq("status", "pending")),
    sb.from("orders").select("total").neq("status", "cancelled").limit(2000),
    sb.from("orders").select("id, status, total, address, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const value = (valueRows ?? []).reduce((n, r) => n + Number(r.total), 0);
  const priced = total - noPrice;

  return (
    <>
      <PageHeader title="Dashboard" subtitle={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}>
        <Link href="/admin/products/new" className={btn}><Icon name="plus" className="h-4 w-4" /> Add part</Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Live parts" value={live} hint={`${total} in catalog`} icon="box" tone="cyan" href="/admin/products" />
        <StatCard label="Without a price" value={noPrice} hint={noPrice ? "Set prices to enable ordering" : "All parts priced"} icon="alert" tone={noPrice ? "rose" : "emerald"} href="/admin/products?missing=1" />
        <StatCard label="Orders" value={orders} hint={`${pending} pending`} icon="cart" tone="violet" href="/admin/orders" />
        <StatCard label="Order value" value={money(value)} hint="Excludes cancelled" icon="coin" tone="amber" href="/admin/orders" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="adm-in lg:col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Pricing progress</h2>
              <p className="text-sm text-slate-400">{priced} of {total} parts have a price</p>
            </div>
            <p className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">{total ? Math.round((priced / total) * 100) : 0}%</p>
          </div>
          <div className="mt-4"><ProgressBar value={priced} max={total} /></div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/admin/products?missing=1" className={btn}>Set prices</Link>
            <Link href="/admin/products" className={btnGhost}>All parts</Link>
            <Link href="/admin/categories" className={btnGhost}>Categories</Link>
          </div>
        </Card>

        <Card className="adm-in">
          <h2 className="mb-3 font-semibold text-slate-900">Quick actions</h2>
          <div className="grid gap-2 text-sm">
            {[
              ["/admin/products/new", "Add a new part", "plus"],
              ["/admin/orders?status=pending", "Review pending orders", "cart"],
              ["/admin/posts", "Write a blog post", "pen"],
              ["/admin/faqs", "Edit FAQ", "help"],
            ].map(([href, label, icon]) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700 transition hover:border-indigo-300 hover:bg-slate-100">
                <Icon name={icon} className="h-4 w-4 text-indigo-600" /> {label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="adm-in mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-indigo-600 hover:underline">View all</Link>
        </div>
        {recent?.length ? (
          <ul className="divide-y divide-slate-200">
            {recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{(o.address as { name?: string })?.name ?? "Guest"}</p>
                  <p className="text-xs text-slate-500">#{String(o.id).slice(0, 8)} · {new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
                <div className="flex items-center gap-3"><Badge tone={statusTone[o.status]}>{o.status}</Badge><span className="font-semibold text-slate-900">{money(Number(o.total))}</span></div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">No orders yet. They will appear here as customers check out.</p>
        )}
      </Card>
    </>
  );
}
