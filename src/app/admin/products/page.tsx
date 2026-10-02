/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function Products() {
  const sb = await requireAdmin();
  const { data: products } = await sb.from("products").select("id, sku, name, price, stock, active, images").order("id", { ascending: false });
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Add product</Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr><th className="p-3">Image</th><th>SKU</th><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="p-3">{p.images?.[0] && <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />}</td>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td className={p.stock === 0 ? "font-semibold text-red-600" : ""}>{p.stock}</td>
                <td>{p.active ? "Live" : "Hidden"}</td>
                <td><Link href={`/admin/products/${p.id}`} className="text-brand hover:underline">Edit</Link></td>
              </tr>
            ))}
            {!products?.length && <tr><td colSpan={7} className="p-6 text-center text-slate-500">No products yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
