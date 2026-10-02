import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

async function signOut() {
  "use server";
  await (await supabase()).auth.signOut();
  redirect("/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 text-sm font-medium">
          <span className="font-extrabold">Admin</span>
          <Link href="/admin/products" className="hover:text-orange-400">Products</Link>
          <Link href="/admin/categories" className="hover:text-orange-400">Categories</Link>
          <Link href="/admin/orders" className="hover:text-orange-400">Orders</Link>
          <Link href="/admin/posts" className="hover:text-orange-400">Blog</Link>
          <Link href="/admin/faqs" className="hover:text-orange-400">FAQ</Link>
          <Link href="/admin/testimonials" className="hover:text-orange-400">Testimonials</Link>
          <Link href="/" className="ml-auto text-slate-300 hover:text-white">View site</Link>
          <form action={signOut}><button className="text-slate-300 hover:text-white">Sign out</button></form>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
