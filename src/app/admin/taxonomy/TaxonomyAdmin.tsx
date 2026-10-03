import { requireAdmin } from "@/lib/admin";
import { deleteTaxon, saveTaxon } from "./actions";

const input = "rounded border border-slate-300 px-3 py-1.5 text-sm";

export default async function TaxonomyAdmin({ table, title, hint }: { table: "categories" | "models"; title: string; hint: string }) {
  const sb = await requireAdmin();
  const { data } = await sb.from(table).select("id, name, sort").order("sort").order("name");
  const save = saveTaxon.bind(null, table), del = deleteTaxon.bind(null, table);
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mb-4 text-sm text-slate-500">{hint}</p>
      <form action={save} className="mb-4 flex gap-2">
        <input name="name" required placeholder="Name" className={`${input} flex-1`} />
        <input name="sort" type="number" placeholder="Order" className={`${input} w-20`} />
        <button className="rounded bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">Add</button>
      </form>
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {data?.map((r) => (
          <li key={r.id} className="flex items-center gap-2 p-3">
            <form action={save} className="flex flex-1 gap-2">
              <input type="hidden" name="id" value={r.id} />
              <input name="name" required defaultValue={r.name} className={`${input} flex-1`} />
              <input name="sort" type="number" defaultValue={r.sort} className={`${input} w-20`} />
              <button className="rounded border border-slate-300 px-3 text-sm hover:bg-slate-50">Save</button>
            </form>
            <form action={del}><input type="hidden" name="id" value={r.id} /><button className="text-sm text-red-600 hover:underline">Delete</button></form>
          </li>
        ))}
        {!data?.length && <li className="p-4 text-slate-500">Nothing yet.</li>}
      </ul>
    </div>
  );
}
