import { requireAdmin } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Badge, Card, Icon, PageHeader, btn, btnDanger, field, fieldBase } from "@/components/admin/ui";
import { deleteRow, saveRow } from "../content/actions";

type Faq = { id: number; question: string; answer: string; sort: number; active: boolean };

export default async function AdminFaqs() {
  const sb = await requireAdmin();
  const { data: faqs } = await sb.from("faqs").select("*").order("sort").order("id");
  const save = saveRow.bind(null, "faqs"), del = deleteRow.bind(null, "faqs");
  const Fields = ({ f }: { f?: Faq }) => (
    <>
      {f && <input type="hidden" name="id" value={f.id} />}
      <input name="question" required placeholder="Question" defaultValue={f?.question} className={field} />
      <textarea name="answer" required rows={3} placeholder="Answer" defaultValue={f?.answer} className={field} />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2">Order <input name="sort" type="number" defaultValue={f?.sort ?? 0} className={`${fieldBase} w-20`} /></label>
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={f?.active ?? true} className="h-4 w-4 accent-indigo-600" /> Visible</label>
        <SubmitButton className={`${btn} ml-auto`}>Save</SubmitButton>
      </div>
    </>
  );
  return (
    <div className="max-w-3xl">
      <PageHeader title="FAQ" subtitle="Questions shown on the public FAQ page" />
      <details className="adm-in group mb-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-indigo-700"><Icon name="plus" className="h-4 w-4" /> Add question</summary>
        <form action={save} className="mt-4 space-y-3">{Fields({})}</form>
      </details>
      <div className="space-y-3">
        {faqs?.map((f) => (
          <Card key={f.id} className="adm-in !p-0">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <span className="font-medium text-slate-900">{f.question}</span>
                <span className="flex items-center gap-2">{!f.active && <Badge>hidden</Badge>}<span className="text-slate-500 transition group-open:rotate-180">▾</span></span>
              </summary>
              <div className="space-y-3 border-t border-slate-200 p-4">
                <form action={save} className="space-y-3">{Fields({ f })}</form>
                <form action={del}><input type="hidden" name="id" value={f.id} /><button className={btnDanger}>Delete question</button></form>
              </div>
            </details>
          </Card>
        ))}
        {!faqs?.length && <Card className="py-10 text-center text-sm text-slate-500">No questions yet.</Card>}
      </div>
    </div>
  );
}
