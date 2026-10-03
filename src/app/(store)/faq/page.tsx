import { supabase } from "@/lib/supabase";

export const metadata = { title: "FAQ" };

export default async function Faq() {
  const { data: faqs } = await (await supabase()).from("faqs").select("id, question, answer").eq("active", true).order("sort").order("id");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold">Frequently asked questions</h1>
      {faqs?.length ? (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {faqs.map((f) => (
            <details key={f.id} className="group p-4">
              <summary className="cursor-pointer list-none font-semibold marker:content-none">
                <span className="mr-2 text-accent group-open:hidden">+</span><span className="mr-2 hidden text-accent group-open:inline">−</span>{f.question}
              </summary>
              <p className="mt-2 whitespace-pre-line pl-5 text-slate-600">{f.answer}</p>
            </details>
          ))}
        </div>
      ) : <p className="text-slate-500">No questions yet.</p>}
    </main>
  );
}
