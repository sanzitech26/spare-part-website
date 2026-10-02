/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: p } = await (await supabase())
    .from("posts").select("title, body, cover_url, created_at").eq("slug", slug).eq("published", true).maybeSingle();
  if (!p) notFound();
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-brand">← All posts</Link>
      <h1 className="mt-2 text-4xl font-extrabold">{p.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{new Date(p.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
      {p.cover_url && <img src={p.cover_url} alt="" className="mt-6 w-full rounded-xl" />}
      {/* ponytail: body is plain text, blank line = new paragraph; add markdown only if the client asks for rich formatting */}
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        {p.body.split(/\n{2,}/).map((para: string, i: number) => <p key={i} className="whitespace-pre-line">{para}</p>)}
      </div>
    </article>
  );
}
