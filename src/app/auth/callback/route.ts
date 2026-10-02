import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Email-confirmation link lands here with ?code=...; exchange it for a session cookie.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") ?? "/";
  if (code) await (await supabase()).auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(/^\/(?![/\\])/.test(next) ? next : "/", req.url));
}
