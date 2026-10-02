/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = { title: "Blog" };

export default async function Blog() {
  const { data: posts } = await (await supabase())
    .from("posts").select("slug, title, excerpt, cover_url, created_at").eq("published", true).order("created_at", { ascending: false });
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold">Blog</h1>
      {posts?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              {p.cover_url ? <img src={p.cover_url} alt="" className="aspect-video w-full object-cover" /> : <div className="aspect-video bg-slate-100" />}
              <div className="p-4">
                <p className="text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                <h2 className="mt-1 text-lg font-bold">{p.title}</h2>
                {p.excerpt && <p className="mt-1 text-sm text-slate-600">{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : <p className="text-slate-500">No posts yet.</p>}
    </main>
  );
}
