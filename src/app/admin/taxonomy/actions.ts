"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

type Table = "categories" | "models";

// Shared add / rename / reorder / delete for categories and car models.
export async function saveTaxon(table: Table, fd: FormData) {
  if (table !== "categories" && table !== "models") throw new Error("Bad table");
  const sb = await requireAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");
  const sort = Math.floor(Number(fd.get("sort") ?? 0)) || 0;
  const id = String(fd.get("id") ?? "");

  if (id) {
    const { error } = await sb.from(table).update({ name, sort }).eq("id", Number(id));
    if (error) throw new Error(error.message);
  } else {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let row: Record<string, unknown> = { name, slug, sort };
    if (table === "models") {
      const { data: brand } = await sb.from("brands").select("id").eq("slug", "mercedes-benz").maybeSingle();
      row = { ...row, brand_id: brand?.id ?? null };
    }
    const { error } = await sb.from(table).insert(row);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/admin/${table}`);
}

export async function deleteTaxon(table: Table, fd: FormData) {
  if (table !== "categories" && table !== "models") throw new Error("Bad table");
  const sb = await requireAdmin();
  // categories in use are blocked by the foreign key (products keep their category); model deletes also remove its fitment rows.
  const { error } = await sb.from(table).delete().eq("id", Number(fd.get("id")));
  if (error) throw new Error(table === "categories" ? "This category still has products. Move them first." : error.message);
  revalidatePath(`/admin/${table}`);
}
