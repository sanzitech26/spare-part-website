import Link from "next/link";
import { more } from "./nav";

export default function Footer() {
  return (
    <footer className="mt-auto bg-black text-sm text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-white">BRAND<span className="font-light text-slate-400">NAME</span></p>
          <p className="mt-2">Genuine and OEM spare parts for Mercedes-Benz. Not affiliated with or endorsed by Mercedes-Benz Group AG.</p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Information</p>
          <ul className="space-y-1">
            {more.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Shop</p>
          <ul className="space-y-1">
            <li><Link href="/products" className="hover:text-white">All parts</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-neutral-800 py-4 text-center">© {new Date().getFullYear()} BRAND NAME. All rights reserved.</p>
    </footer>
  );
}
