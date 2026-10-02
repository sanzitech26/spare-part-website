import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client; reads the session from cookies. Needs NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
export async function supabase() {
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (list) => {
          // ponytail: throws in server components; session refresh middleware added with auth
          try { list.forEach((c) => jar.set(c.name, c.value, c.options)); } catch {}
        },
      },
    },
  );
}
