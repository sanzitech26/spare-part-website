"use client";
import { useActionState } from "react";
import { sendContact } from "./actions";

const input = "mt-1.5 w-full rounded-xl border border-transparent bg-slate-200/60 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none";

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, null);
  if (state?.ok) return <p className="rounded-3xl bg-green-50 p-8 text-green-800">Thanks! We have received your message and will reply by email soon.</p>;
  return (
    <form action={action} className="space-y-4 rounded-3xl bg-slate-100 p-6">
      {/* honeypot: hidden from people, filled by bots */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium">Name<input name="name" required placeholder="Your full name" className={input} /></label>
        <label className="text-xs font-medium">Email<input name="email" type="email" required placeholder="you@example.com" className={input} /></label>
      </div>
      <label className="block text-xs font-medium">Part wanted / part number<input name="part" placeholder="e.g. front brake pads, MB-001" className={input} /></label>
      <label className="block text-xs font-medium">Message<textarea name="message" required rows={5} placeholder="Tell us your car model, year and VIN and anything else we should know." className={input} /></label>
      {state?.error && <p role="alert" className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
