import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

async function add(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  const name = String(fd.get("name")).trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const { error } = await sb.from("categories").insert({ name, slug });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

async function remove(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  // products.category_id has no cascade: deleting a used category fails, which is the safe outcome
  const { error } = await sb.from("categories").delete().eq("id", Number(fd.get("id")));
  if (error) throw new Error("Category is in use by products");
  revalidatePath("/admin/categories");
}

export default async function Categories() {
  const sb = await requireAdmin();
  const { data } = await sb.from("categories").select("id, name").order("name");
  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Categories</h1>
      <form action={add} className="mb-4 flex gap-2">
        <input name="name" required placeholder="e.g. Brakes" className="flex-1 rounded border border-slate-300 px-3 py-2" />
        <button className="rounded bg-brand px-4 font-semibold text-white hover:bg-brand-dark">Add</button>
      </form>
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {data?.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-3">
            {c.name}
            <form action={remove}><input type="hidden" name="id" value={c.id} /><button className="text-sm text-red-600 hover:underline">Delete</button></form>
          </li>
        ))}
        {!data?.length && <li className="p-4 text-slate-500">No categories yet.</li>}
      </ul>
    </div>
  );
}
