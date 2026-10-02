import Link from "next/link";
import ClearCart from "./ClearCart";

export default async function OrderPlaced({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <ClearCart />
      <h1 className="text-3xl font-extrabold">Thank you! Your order is placed.</h1>
      {id && <p className="mt-2 font-mono text-sm text-slate-500">Order #{id.slice(0, 8)}</p>}
      <p className="mt-4 text-slate-600">We will contact you to confirm delivery. Payment is collected on delivery.</p>
      <Link href="/products" className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">Continue shopping</Link>
    </main>
  );
}
