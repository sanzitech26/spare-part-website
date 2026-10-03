import { requireAdmin } from "@/lib/admin";
import { deleteRow, saveRow } from "../content/actions";

const input = "w-full rounded border border-slate-300 px-3 py-2 text-sm";
type Post = { id: number; slug: string; title: string; excerpt: string | null; body: string; cover_url: string | null; published: boolean };

export default async function AdminPosts() {
  const sb = await requireAdmin();
  const { data: posts } = await sb.from("posts").select("*").order("created_at", { ascending: false });
  const save = saveRow.bind(null, "posts"), del = deleteRow.bind(null, "posts");
  const Fields = ({ p }: { p?: Post }) => (
    <>
      {p && <input type="hidden" name="id" value={p.id} />}
      <input name="title" required placeholder="Title" defaultValue={p?.title} className={input} />
      <input name="slug" placeholder="URL slug (optional, made from the title)" defaultValue={p?.slug} className={input} />
      <input name="excerpt" placeholder="Short summary shown on the blog list" defaultValue={p?.excerpt ?? ""} className={input} />
      <input name="cover_url" type="url" placeholder="Cover image URL (optional)" defaultValue={p?.cover_url ?? ""} className={input} />
      <textarea name="body" required rows={10} placeholder="Post text. Leave a blank line between paragraphs." defaultValue={p?.body} className={input} />
      <div className="flex items-center gap-4 text-sm">
        <label><input type="checkbox" name="published" defaultChecked={p?.published ?? false} /> Published</label>
        <button className="ml-auto rounded bg-brand px-4 py-1.5 font-semibold text-white hover:bg-brand-dark">Save</button>
      </div>
    </>
  );
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Blog posts</h1>
      <details className="rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-accent">+ New post</summary>
        <form action={save} className="mt-3 space-y-3">{Fields({})}</form>
      </details>
      {posts?.map((p) => (
        <details key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-medium">{p.title} <span className="ml-2 text-xs text-slate-400">{p.published ? "published" : "draft"}</span></summary>
          <form action={save} className="mt-3 space-y-3">{Fields({ p })}</form>
          <form action={del} className="mt-2"><input type="hidden" name="id" value={p.id} /><button className="text-sm text-red-600 hover:underline">Delete</button></form>
        </details>
      ))}
      {!posts?.length && <p className="text-slate-500">No posts yet.</p>}
    </div>
  );
}
