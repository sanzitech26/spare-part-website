import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import SubmitButton from "@/components/admin/SubmitButton";
import { Card, PageHeader, field, labelCls } from "@/components/admin/ui";

async function save(fd: FormData) {
  "use server";
  const sb = await requireAdmin();
  const email = String(fd.get("email") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim().slice(0, 30);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address");
  const { error } = await sb.from("site_settings").upsert({ id: 1, email, phone: phone || null });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout"); // header, footer and contact page all show these
}

export default async function Settings() {
  const sb = await requireAdmin();
  const { data } = await sb.from("site_settings").select("email, phone").eq("id", 1).maybeSingle();
  return (
    <>
      <PageHeader title="Contact details" subtitle="Shown to customers in the top bar, footer and contact page." />
      <Card className="max-w-xl">
        <form action={save} className="space-y-4">
          <label className="block space-y-1.5"><span className={labelCls}>Public email</span><input name="email" type="email" required defaultValue={data?.email ?? ""} className={field} /></label>
          <label className="block space-y-1.5"><span className={labelCls}>Public phone number (optional)</span><input name="phone" defaultValue={data?.phone ?? ""} placeholder="e.g. +44 20 7946 0000" className={field} /></label>
          <p className="text-xs text-slate-500">Leave the phone empty to hide it everywhere. Order and enquiry emails are still delivered to the inbox set in the mail settings (MAIL_TO), not to this address.</p>
          <SubmitButton>Save</SubmitButton>
        </form>
      </Card>
    </>
  );
}
