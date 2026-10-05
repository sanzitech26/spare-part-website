import { requireAdmin } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Card, PageHeader, btn, btnDanger, field, fieldBase } from "@/components/admin/ui";
import { deleteTaxon, saveTaxon } from "./actions";

export default async function TaxonomyAdmin({ table, title, hint }: { table: "categories" | "models"; title: string; hint: string }) {
  const sb = await requireAdmin();
  const { data } = await sb.from(table).select("id, name, sort").order("sort").order("name");
  const save = saveTaxon.bind(null, table), del = deleteTaxon.bind(null, table);
  return (
    <div className="max-w-2xl">
      <PageHeader title={title} subtitle={hint} />
      <Card className="adm-in mb-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Add new</p>
        <form action={save} className="flex flex-wrap gap-2">
          <input name="name" required placeholder="Name" className={`${field} min-w-0 flex-1`} />
          <input name="sort" type="number" placeholder="Order" aria-label="Order" className={`${fieldBase} w-24`} />
          <SubmitButton className={btn} pendingText="Adding…">Add</SubmitButton>
        </form>
      </Card>
      <div className="adm-in overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-200">
          {data?.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-2 p-3">
              <form action={save} className="flex min-w-0 flex-1 gap-2">
                <input type="hidden" name="id" value={r.id} />
                <input name="name" required defaultValue={r.name} aria-label="Name" className={`${field} min-w-0 flex-1`} />
                <input name="sort" type="number" defaultValue={r.sort} aria-label="Order" className={`${fieldBase} w-20`} />
                <SubmitButton className="rounded-lg border border-slate-300 bg-slate-100 px-3 text-sm text-slate-700 transition hover:bg-slate-100" pendingText="…">Save</SubmitButton>
              </form>
              <form action={del}><input type="hidden" name="id" value={r.id} /><button className={btnDanger}>Delete</button></form>
            </li>
          ))}
          {!data?.length && <li className="p-8 text-center text-sm text-slate-500">Nothing yet.</li>}
        </ul>
      </div>
    </div>
  );
}
