import { requireAdmin } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Badge, Card, Icon, PageHeader, btn, btnDanger, field } from "@/components/admin/ui";
import { deleteRow, saveRow } from "../content/actions";

type Post = { id: number; slug: string; title: string; excerpt: string | null; body: string; cover_url: string | null; published: boolean };

export default async function AdminPosts() {
  const sb = await requireAdmin();
  const { data: posts } = await sb.from("posts").select("*").order("created_at", { ascending: false });
  const save = saveRow.bind(null, "posts"), del = deleteRow.bind(null, "posts");
  const Fields = ({ p }: { p?: Post }) => (
    <>
      {p && <input type="hidden" name="id" value={p.id} />}
      <input name="title" required placeholder="Title" defaultValue={p?.title} className={field} />
      <input name="slug" placeholder="URL slug (optional, made from the title)" defaultValue={p?.slug} className={field} />
      <input name="excerpt" placeholder="Short summary shown on the blog list" defaultValue={p?.excerpt ?? ""} className={field} />
      <input name="cover_url" type="url" placeholder="Cover image URL (optional)" defaultValue={p?.cover_url ?? ""} className={field} />
      <textarea name="body" required rows={10} placeholder="Post text. Leave a blank line between paragraphs." defaultValue={p?.body} className={field} />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p?.published ?? false} className="h-4 w-4 accent-indigo-600" /> Published</label>
        <SubmitButton className={`${btn} ml-auto`}>Save</SubmitButton>
      </div>
    </>
  );
  return (
    <div className="max-w-3xl">
      <PageHeader title="Blog" subtitle="Articles shown on the public blog" />
      <details className="adm-in mb-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-indigo-700"><Icon name="plus" className="h-4 w-4" /> New post</summary>
        <form action={save} className="mt-4 space-y-3">{Fields({})}</form>
      </details>
      <div className="space-y-3">
        {posts?.map((p) => (
          <Card key={p.id} className="adm-in !p-0">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <span className="font-medium text-slate-900">{p.title}</span>
                <span className="flex items-center gap-2"><Badge tone={p.published ? "emerald" : "amber"}>{p.published ? "published" : "draft"}</Badge><span className="text-slate-500 transition group-open:rotate-180">▾</span></span>
              </summary>
              <div className="space-y-3 border-t border-slate-200 p-4">
                <form action={save} className="space-y-3">{Fields({ p })}</form>
                <form action={del}><input type="hidden" name="id" value={p.id} /><button className={btnDanger}>Delete post</button></form>
              </div>
            </details>
          </Card>
        ))}
        {!posts?.length && <Card className="py-10 text-center text-sm text-slate-500">No posts yet.</Card>}
      </div>
    </div>
  );
}
