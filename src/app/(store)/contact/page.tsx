import ContactForm from "./ContactForm";

export const metadata = { title: "Contact us" };

export default function Contact() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_300px]">
      <div>
        <h1 className="mb-2 text-3xl font-extrabold">Contact us</h1>
        <p className="mb-6 text-slate-600">Not sure which part fits your bike? Send us your model and year and we will help.</p>
        <ContactForm />
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
