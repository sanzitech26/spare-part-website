"use server";
import { mailConfigured, sendMail } from "@/lib/mail";
import { contactEmail } from "@/lib/emailTemplate";

type State = { ok?: boolean; error?: string } | null;

export async function sendContact(_prev: State, fd: FormData): Promise<State> {
  if (String(fd.get("website") ?? "")) return { ok: true }; // honeypot: bots fill the hidden field
  const s = (k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);
  const name = s("name", 100), email = s("email", 200), part = s("part", 200), message = s("message", 4000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter your name, a valid email and a message." };
  if (!mailConfigured()) return { error: "Messaging is not set up yet. Please email us instead." };

  const ok = await sendMail({ ...contactEmail({ name, email, part, message }), replyTo: email });
  return ok ? { ok: true } : { error: "Could not send your message. Please try again or email us." };
}
