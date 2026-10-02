"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

type Table = "faqs" | "testimonials" | "posts";
const TABLES: Table[] = ["faqs", "testimonials", "posts"];
const must = (e: { message: string } | null) => { if (e) throw new Error(e.message); };

// One generic save/delete for the three content tables; each admin page passes its table and the row fields it edits.
export async function saveRow(table: Table, fd: FormData) {
  if (!TABLES.includes(table)) throw new Error("Bad table");
  const sb = await requireAdmin();
  const str = (k: string) => String(fd.get(k) ?? "").trim();
  const on = (k: string) => fd.get(k) === "on";
  const id = str("id");

  let row: Record<string, unknown>;
  if (table === "faqs") row = { question: str("question"), answer: str("answer"), sort: Number(str("sort")) || 0, active: on("active") };
  else if (table === "testimonials") row = { name: str("name"), text: str("text"), rating: Math.min(5, Math.max(1, Number(str("rating")) || 5)), active: on("active") };
  else {
    const slug = (str("slug") || str("title")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    row = { slug, title: str("title"), excerpt: str("excerpt") || null, body: str("body"), cover_url: str("cover_url") || null, published: on("published") };
  }
  const { error } = id ? await sb.from(table).update(row).eq("id", Number(id)) : await sb.from(table).insert(row);
  must(error);
  revalidatePath(`/admin/${table}`);
}

export async function deleteRow(table: Table, fd: FormData) {
  if (!TABLES.includes(table)) throw new Error("Bad table");
  const sb = await requireAdmin();
  const { error } = await sb.from(table).delete().eq("id", Number(fd.get("id")));
  must(error);
  revalidatePath(`/admin/${table}`);
}
