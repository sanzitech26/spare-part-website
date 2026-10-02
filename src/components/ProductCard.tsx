/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AddToCart } from "./cart";

export type P = { id: number; sku: string; name: string; price: number; mrp: number | null; stock: number; images: string[] | null };

export const discount = (p: { price: number; mrp: number | null }) =>
  p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;

export default function ProductCard({ p }: { p: P }) {
  const off = discount(p);
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/products/${encodeURIComponent(p.sku)}`}>
        {p.images?.[0]
          ? <img src={p.images[0]} alt={p.name} className="aspect-square w-full object-cover" />
          : <div className="flex aspect-square w-full items-center justify-center bg-slate-100 text-sm text-slate-400">No image</div>}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${encodeURIComponent(p.sku)}`} className="text-sm font-medium text-slate-800 hover:text-brand">{p.name}</Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">₹{p.price}</span>
          {off > 0 && <><s className="text-xs text-slate-400">₹{p.mrp}</s><span className="text-xs font-semibold text-green-600">{off}% off</span></>}
        </div>
        <div className="mt-auto pt-3">
          {p.stock > 0
            ? <AddToCart className="w-full" product={{ id: p.id, sku: p.sku, name: p.name, price: p.price, image: p.images?.[0] }} />
            : <p className="py-2 text-center text-sm font-semibold text-red-600">Out of stock</p>}
        </div>
      </div>
    </div>
  );
}
