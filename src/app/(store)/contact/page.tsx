import { supabase } from "@/lib/supabase";
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact us" };

export default async function Contact({ searchParams }: { searchParams: Promise<{ part?: string }> }) {
  const { part } = await searchParams;
  // "Enquire" links arrive with ?part=<sku>; look the name up server-side rather than trusting text from the URL.
  const { data: p } = part
    ? await (await supabase()).from("products").select("sku, name").eq("sku", part).eq("active", true).maybeSingle()
    : { data: null };
  const prefill = p ? `Hi, I would like to enquire about: ${p.name} (ref ${p.sku}).\n\nMy car model / year / VIN: ` : "";
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_300px]">
      <div>
        <h1 className="mb-2 text-3xl font-extrabold">Contact us</h1>
        <p className="mb-6 text-slate-600">Tell us your car model, year and VIN and we will confirm the right part, price and availability.</p>
        <ContactForm defaultMessage={prefill} />
      </div>
      <aside className="h-fit space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm">
        <h2 className="text-lg font-bold">Reach us</h2>
        {/* ponytail: placeholder contact details; replace with the client's */}
        <p><b>Phone:</b> +91-XXXXXXXXXX</p>
        <p><b>Hours:</b> Mon–Sat, 10 AM – 7 PM</p>
        <p><b>Email:</b> support@example.com</p>
        <p><b>Address:</b> Your shop address, City, State, PIN</p>
      </aside>
    </main>
  );
}
