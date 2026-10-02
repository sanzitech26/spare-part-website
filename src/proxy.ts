import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase session cookie on /admin requests and sends logged-out users to /login.
// Role (admin) is enforced in requireAdmin(), not here.
export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach((c) => req.cookies.set(c.name, c.value));
          res = NextResponse.next({ request: req });
          list.forEach((c) => res.cookies.set(c.name, c.value, c.options));
        },
      },
    },
  );
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
