"use server";
import { mailConfigured, sendMail } from "@/lib/mail";

type State = { ok?: boolean; error?: string } | null;

export async function sendContact(_prev: State, fd: FormData): Promise<State> {
  if (String(fd.get("website") ?? "")) return { ok: true }; // honeypot: bots fill the hidden field
  const s = (k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);
  const name = s("name", 100), email = s("email", 200), phone = s("phone", 20), message = s("message", 4000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter your name, a valid email and a message." };
  if (!mailConfigured()) return { error: "Messaging is not set up yet. Please call us instead." };

  const ok = await sendMail({ subject: `Website enquiry from ${name}`, replyTo: email, text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n\n${message}` });
  return ok ? { ok: true } : { error: "Could not send your message. Please try again or call us." };
}
