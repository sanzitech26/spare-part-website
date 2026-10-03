"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCart } from "@/components/cart";
import { FREE_SHIPPING_OVER, shippingFor } from "@/lib/shipping";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold">Your cart</h1>
      {!items.length ? (
        <p>Your cart is empty. <Link href="/products" className="text-accent underline">Browse products</Link></p>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 p-4">
                {i.image ? <img src={i.image} alt="" className="h-20 w-20 rounded object-cover" /> : <div className="h-20 w-20 rounded bg-slate-100" />}
                <div className="flex-1">
                  <Link href={`/products/${encodeURIComponent(i.sku)}`} className="font-medium hover:text-accent">{i.name}</Link>
                  <p className="text-sm text-slate-500">₹{i.price}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="h-7 w-7 rounded border" aria-label="Decrease">−</button>
                    <span className="w-6 text-center">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="h-7 w-7 rounded border" aria-label="Increase">+</button>
                    <button onClick={() => remove(i.id)} className="ml-4 text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
                <p className="font-semibold">₹{i.price * i.qty}</p>
              </li>
            ))}
          </ul>
          <aside className="h-fit space-y-3 rounded-xl border border-slate-200 bg-white p-6 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `₹${shipping}` : "Free"}</span></div>
            {shipping > 0 && <p className="text-xs text-slate-500">Add ₹{FREE_SHIPPING_OVER - subtotal} more for free shipping.</p>}
            <div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>₹{subtotal + shipping}</span></div>
            <Link href="/checkout" className="block rounded-full bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
