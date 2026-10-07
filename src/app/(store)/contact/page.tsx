/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ContactForm from "./ContactForm";
import { getSettings } from "@/lib/settings";
import { img } from "@/lib/images";

export const metadata = { title: "Contact us" };

const icon = "h-5 w-5";
const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", className: icon, "aria-hidden": true } as const;
const Mail = () => <svg {...svg}><path d="M3 5h18v14H3zM3 7l9 6 9-6" /></svg>;
const Clock = () => <svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
const Pin = () => <svg {...svg}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>;
const Phone = () => <svg {...svg}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>;

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">{icon}</span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <div className="mt-1 space-y-0.5 text-sm text-slate-600">{children}</div>
    </div>
  );
}

export default async function Contact() {
  const contact = await getSettings();
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Get in touch</span>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">Contact Us</h1>
        <p className="max-w-xs text-sm text-slate-600 sm:text-right">Tell us the part you need and your car model, and we will confirm the right part and availability by email.</p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <ContactForm />
        <div className="relative min-h-72 overflow-hidden rounded-3xl bg-neutral-900">
          <img src={img.frontDark} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute right-4 top-4 rounded-full border border-white/70 px-3 py-1 text-xs text-white">UK-based parts specialists</span>
        </div>
      </div>

      <div className={`mt-14 grid gap-10 ${contact.phone ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        <Block icon={<Mail />} title="Write to Us"><a href={`mailto:${contact.email}`} className="hover:text-accent">{contact.email}</a></Block>
        {contact.phone && <Block icon={<Phone />} title="Call Us"><a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-accent">{contact.phone}</a></Block>}
        <Block icon={<Clock />} title="Working Hours"><p>Mon–Sat: 10am–7pm</p><p>Sunday: Closed</p></Block>
        {/* ponytail: placeholder address; replace with the client's */}
        <Block icon={<Pin />} title="Location"><p>Your shop address</p><p>Town, Postcode, United Kingdom</p></Block>
      </div>

      <section className="mt-16 grid items-center gap-8 rounded-3xl bg-slate-100 p-8 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">Start now</span>
          <h2 className="mt-4 text-3xl font-bold leading-tight">Find your <span className="text-slate-500">perfect part</span></h2>
          <p className="mt-3 text-sm text-slate-600">Browse genuine and OEM Mercedes-Benz parts matched to your model, delivered across the UK.</p>
          <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Shop all parts <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src={img.grille} alt="" className="h-48 w-full rounded-2xl object-cover" />
          <img src={img.headlight} alt="" className="h-48 w-full rounded-2xl object-cover" />
        </div>
      </section>
    </main>
  );
}
