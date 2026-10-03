import { requireAdmin } from "@/lib/admin";
import { deleteRow, saveRow } from "../content/actions";

const input = "w-full rounded border border-slate-300 px-3 py-2 text-sm";

export default async function AdminFaqs() {
  const sb = await requireAdmin();
  const { data: faqs } = await sb.from("faqs").select("*").order("sort").order("id");
  const save = saveRow.bind(null, "faqs"), del = deleteRow.bind(null, "faqs");
  const Fields = ({ f }: { f?: { id: number; question: string; answer: string; sort: number; active: boolean } }) => (
    <>
      {f && <input type="hidden" name="id" value={f.id} />}
      <input name="question" required placeholder="Question" defaultValue={f?.question} className={input} />
      <textarea name="answer" required rows={3} placeholder="Answer" defaultValue={f?.answer} className={input} />
      <div className="flex items-center gap-4 text-sm">
        <label>Order <input name="sort" type="number" defaultValue={f?.sort ?? 0} className="w-20 rounded border border-slate-300 px-2 py-1" /></label>
        <label><input type="checkbox" name="active" defaultChecked={f?.active ?? true} /> Visible</label>
        <button className="ml-auto rounded bg-brand px-4 py-1.5 font-semibold text-white hover:bg-brand-dark">Save</button>
      </div>
    </>
  );
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">FAQ</h1>
      <details className="rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-accent">+ Add question</summary>
        <form action={save} className="mt-3 space-y-3">{Fields({})}</form>
      </details>
      {faqs?.map((f) => (
        <details key={f.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-medium">{f.question} {!f.active && <span className="ml-2 text-xs text-slate-400">(hidden)</span>}</summary>
          <form action={save} className="mt-3 space-y-3">{Fields({ f })}</form>
          <form action={del} className="mt-2"><input type="hidden" name="id" value={f.id} /><button className="text-sm text-red-600 hover:underline">Delete</button></form>
        </details>
      ))}
      {!faqs?.length && <p className="text-slate-500">No questions yet.</p>}
    </div>
  );
}
