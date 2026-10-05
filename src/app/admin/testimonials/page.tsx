import { requireAdmin } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Badge, Card, Icon, PageHeader, btn, btnDanger, field, fieldBase } from "@/components/admin/ui";
import { deleteRow, saveRow } from "../content/actions";

type T = { id: number; name: string; text: string; rating: number; active: boolean };

export default async function AdminTestimonials() {
  const sb = await requireAdmin();
  const { data } = await sb.from("testimonials").select("*").order("id", { ascending: false });
  const save = saveRow.bind(null, "testimonials"), del = deleteRow.bind(null, "testimonials");
  const Fields = ({ t }: { t?: T }) => (
    <>
      {t && <input type="hidden" name="id" value={t.id} />}
      <input name="name" required placeholder="Customer name" defaultValue={t?.name} className={field} />
      <textarea name="text" required rows={3} placeholder="What they said" defaultValue={t?.text} className={field} />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2">Rating <input name="rating" type="number" min={1} max={5} defaultValue={t?.rating ?? 5} className={`${fieldBase} w-20`} /></label>
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={t?.active ?? true} className="h-4 w-4 accent-indigo-600" /> Visible</label>
        <SubmitButton className={`${btn} ml-auto`}>Save</SubmitButton>
      </div>
    </>
  );
  return (
    <div className="max-w-3xl">
      <PageHeader title="Testimonials" subtitle="Customer reviews shown on the public site" />
      <details className="adm-in mb-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-indigo-700"><Icon name="plus" className="h-4 w-4" /> Add testimonial</summary>
        <form action={save} className="mt-4 space-y-3">{Fields({})}</form>
      </details>
      <div className="space-y-3">
        {data?.map((t) => (
          <Card key={t.id} className="adm-in !p-0">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <span className="font-medium text-slate-900">{t.name} <span className="ml-2 text-amber-400">{"★".repeat(t.rating)}</span></span>
                <span className="flex items-center gap-2">{!t.active && <Badge>hidden</Badge>}<span className="text-slate-500 transition group-open:rotate-180">▾</span></span>
              </summary>
              <div className="space-y-3 border-t border-slate-200 p-4">
                <form action={save} className="space-y-3">{Fields({ t })}</form>
                <form action={del}><input type="hidden" name="id" value={t.id} /><button className={btnDanger}>Delete testimonial</button></form>
              </div>
            </details>
          </Card>
        ))}
        {!data?.length && <Card className="py-10 text-center text-sm text-slate-500">No testimonials yet.</Card>}
      </div>
    </div>
  );
}
