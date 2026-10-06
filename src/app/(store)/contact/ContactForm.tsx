"use client";
import { useActionState } from "react";
import { sendContact } from "./actions";

const input = "w-full rounded border border-slate-300 px-3 py-2";

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, null);
  if (state?.ok) return <p className="rounded-xl bg-green-50 p-6 text-green-800">Thanks! We have received your message and will reply soon.</p>;
  return (
    <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      {/* honeypot: hidden from people, filled by bots */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Name *<input name="name" required className={input} /></label>
        <label className="text-sm">Email *<input name="email" type="email" required className={input} /></label>
      </div>
      <label className="block text-sm">Message *<textarea name="message" required rows={6} className={input} /></label>
      {state?.error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
