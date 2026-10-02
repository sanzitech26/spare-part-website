// Wrapper for text pages (About, policies, blog posts). Styles child h2/p/ul without a typography plugin.
export default function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold">{title}</h1>
      <div className="space-y-4 leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_a]:text-brand [&_a]:underline">
        {children}
      </div>
    </article>
  );
}
