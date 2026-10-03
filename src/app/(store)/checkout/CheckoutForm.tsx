"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useCart } from "@/components/cart";
import { shippingFor } from "@/lib/shipping";
import { placeOrder } from "./actions";

const input = "w-full rounded border border-slate-300 px-3 py-2";

export default function CheckoutForm() {
  const { items } = useCart();
  const [state, action, pending] = useActionState(placeOrder, null);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);

  if (!items.length) return <p>Your cart is empty. <Link href="/products" className="text-accent underline">Browse products</Link></p>;
  return (
    <form action={action} className="grid gap-8 md:grid-cols-[1fr_340px]">
      <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))} />
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">Your details</h2>
        {/* honeypot: hidden from people, filled by bots */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Full name *<input name="name" required className={input} /></label>
          <label className="text-sm">Phone *<input name="phone" type="tel" inputMode="numeric" required maxLength={10} className={input} /></label>
        </div>
        <label className="block text-sm">Email *<input name="email" type="email" required className={input} /></label>
        <h2 className="pt-2 text-xl font-bold">Delivery address</h2>
        <label className="block text-sm">Address line 1 *<input name="line1" required className={input} /></label>
        <label className="block text-sm">Address line 2<input name="line2" className={input} /></label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm">City *<input name="city" required className={input} /></label>
          <label className="text-sm">State *<input name="state" required className={input} /></label>
          <label className="text-sm">Pincode *<input name="pincode" inputMode="numeric" required maxLength={6} className={input} /></label>
        </div>
        <p className="rounded bg-slate-50 p-3 text-sm text-slate-600">Payment: pay on delivery. Online payment options are coming soon.</p>
      </div>
      <aside className="h-fit space-y-3 rounded-xl border border-slate-200 bg-white p-6 text-sm">
        <h2 className="text-xl font-bold">Order summary</h2>
        {items.map((i) => (
          <div key={i.id} className="flex justify-between gap-2"><span>{i.qty} × {i.name}</span><span>₹{i.price * i.qty}</span></div>
        ))}
        <div className="flex justify-between border-t pt-3"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `₹${shipping}` : "Free"}</span></div>
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{subtotal + shipping}</span></div>
        {state?.error && <p className="rounded bg-red-50 p-2 text-red-700">{state.error}</p>}
        <button disabled={pending} className="w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Placing order…" : "Place order"}
        </button>
        <p className="text-xs text-slate-500">Final prices are confirmed when you place the order.</p>
      </aside>
    </form>
  );
}
