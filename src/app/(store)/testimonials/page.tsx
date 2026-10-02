import { supabase } from "@/lib/supabase";

export const metadata = { title: "Testimonials" };

export default async function Testimonials() {
  const { data } = await (await supabase()).from("testimonials").select("id, name, text, rating").eq("active", true).order("id", { ascending: false });
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold">What our customers say</h1>
      {data?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((t) => (
            <figure key={t.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-orange-500" aria-label={`${t.rating} out of 5 stars`}>{"★".repeat(t.rating)}<span className="text-slate-300">{"★".repeat(5 - t.rating)}</span></div>
              <blockquote className="mt-2 text-slate-700">“{t.text}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      ) : <p className="text-slate-500">No testimonials yet.</p>}
    </main>
  );
}
