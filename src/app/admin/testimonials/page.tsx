import { requireAdmin } from "@/lib/admin";
import { deleteRow, saveRow } from "../content/actions";

const input = "w-full rounded border border-slate-300 px-3 py-2 text-sm";

export default async function AdminTestimonials() {
  const sb = await requireAdmin();
  const { data } = await sb.from("testimonials").select("*").order("id", { ascending: false });
  const save = saveRow.bind(null, "testimonials"), del = deleteRow.bind(null, "testimonials");
  const Fields = ({ t }: { t?: { id: number; name: string; text: string; rating: number; active: boolean } }) => (
    <>
      {t && <input type="hidden" name="id" value={t.id} />}
      <input name="name" required placeholder="Customer name" defaultValue={t?.name} className={input} />
      <textarea name="text" required rows={3} placeholder="What they said" defaultValue={t?.text} className={input} />
      <div className="flex items-center gap-4 text-sm">
        <label>Rating <input name="rating" type="number" min={1} max={5} defaultValue={t?.rating ?? 5} className="w-16 rounded border border-slate-300 px-2 py-1" /></label>
        <label><input type="checkbox" name="active" defaultChecked={t?.active ?? true} /> Visible</label>
        <button className="ml-auto rounded bg-brand px-4 py-1.5 font-semibold text-white hover:bg-brand-dark">Save</button>
      </div>
    </>
  );
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Testimonials</h1>
      <details className="rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-brand">+ Add testimonial</summary>
        <form action={save} className="mt-3 space-y-3">{Fields({})}</form>
      </details>
      {data?.map((t) => (
        <details key={t.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-medium">{t.name} · {"★".repeat(t.rating)} {!t.active && <span className="ml-2 text-xs text-slate-400">(hidden)</span>}</summary>
          <form action={save} className="mt-3 space-y-3">{Fields({ t })}</form>
          <form action={del} className="mt-2"><input type="hidden" name="id" value={t.id} /><button className="text-sm text-red-600 hover:underline">Delete</button></form>
        </details>
      ))}
      {!data?.length && <p className="text-slate-500">No testimonials yet.</p>}
    </div>
  );
}
