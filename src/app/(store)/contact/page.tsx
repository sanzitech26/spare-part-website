import ContactForm from "./ContactForm";

export const metadata = { title: "Contact us" };

export default function Contact() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_300px]">
      <div>
        <h1 className="mb-2 text-3xl font-extrabold">Contact us</h1>
        <p className="mb-6 text-slate-600">Tell us your car model, year and VIN and we will confirm the right part and availability.</p>
        <ContactForm />
      </div>
      <aside className="h-fit space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm">
        <h2 className="text-lg font-bold">Reach us</h2>
        {/* ponytail: placeholder contact details; replace with the client's */}
        <p><b>Phone:</b> +91-XXXXXXXXXX</p>
        <p><b>Hours:</b> Mon–Sat, 10 AM – 7 PM</p>
        <p><b>Email:</b> support@mbspareparts.co.uk</p>
        <p><b>Address:</b> Your shop address, City, State, PIN</p>
      </aside>
    </main>
  );
}
