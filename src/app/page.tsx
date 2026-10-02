/* eslint-disable @next/next/no-img-element */
// ponytail: placeholder data + Unsplash photos; swap for supabase() queries / real product images later
const img = (id: string, w = 600) => `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;
const HERO = img("photo-1558981806-ec527fa84c39", 1800);

const brands = ["Hero", "Bajaj", "Honda", "TVS", "Yamaha", "Royal Enfield", "KTM", "Suzuki", "Mahindra"];
const products = [
  { name: "Front Brake Pad Set", price: 349, mrp: 450, photo: "photo-1568772585407-9361f9bf3a87" },
  { name: "Chain Sprocket Kit", price: 1299, mrp: 1650, photo: "photo-1486262715619-67b85e0b08d3" },
  { name: "Workshop Tool Kit", price: 899, mrp: 1100, photo: "photo-1530046339160-ce3e530c7d2f" },
  { name: "Engine Oil 10W-30 (1L)", price: 520, mrp: 600, photo: "photo-1558618666-fcd25c85cd64" },
];
const perks = ["100% Original Parts", "Free shipping over ₹999", "7-day easy returns", "Secure payments"];

const slug = (s: string) => s.toLowerCase().replace(/ /g, "-");

export default function Home() {
  return (
    <>
      <div className="bg-slate-900 py-1.5 text-center text-xs text-slate-300">
        Live support: +91-XXXXXXXXXX · Mon–Sat 10 AM – 7 PM
      </div>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <a href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
            BRAND<span className="text-brand">NAME</span>
          </a>
          <form action="/search" className="flex-1">
            <input
              name="q"
              placeholder="Search parts, SKU, model…"
              className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </form>
          <a href="/login" className="text-sm font-medium text-slate-700 hover:text-brand">Login</a>
          <a href="/cart" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Cart</a>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 pb-3 text-sm font-medium text-slate-600">
          {brands.map((b) => (
            <a key={b} href={`/brand/${slug(b)}`} className="whitespace-nowrap hover:text-brand">{b}</a>
          ))}
        </nav>
      </header>

      <main>
        <section className="relative">
          <img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-400">Genuine two-wheeler parts</p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">100% original spare parts for your ride.</h1>
            <p className="mt-4 max-w-md text-slate-200">Find the exact part for your bike by brand, model and year.</p>
            <a href="#brands" className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold hover:bg-brand-dark">Shop by brand</a>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-4 text-center text-sm font-medium text-slate-700 sm:grid-cols-4">
            {perks.map((p) => <div key={p}>{p}</div>)}
          </div>
        </section>

        <section id="brands" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-bold">Shop by brand</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {brands.map((b) => (
              <a key={b} href={`/brand/${slug(b)}`} className="rounded-xl border border-slate-200 bg-white p-5 text-center font-semibold text-slate-800 shadow-sm transition hover:border-brand hover:text-brand hover:shadow-md">
                {b}
              </a>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-6 text-2xl font-bold">Featured parts</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {products.map((p) => (
                <div key={p.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <img src={img(p.photo)} alt={p.name} className="aspect-square w-full object-cover" />
                  <div className="p-3">
                    <div className="text-sm font-medium text-slate-800">{p.name}</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-slate-900">₹{p.price}</span>
                      <s className="text-xs text-slate-400">₹{p.mrp}</s>
                      <span className="text-xs font-semibold text-green-600">{Math.round((1 - p.price / p.mrp) * 100)}% off</span>
                    </div>
                    <button className="mt-3 w-full rounded-full bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-brand">Add to cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-8 text-center text-sm text-slate-400">© BRAND NAME. All rights reserved.</footer>
    </>
  );
}
