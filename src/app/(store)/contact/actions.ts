"use server";

type State = { ok?: boolean; error?: string } | null;

// Sends via Resend's HTTP API (no SDK). Needs RESEND_API_KEY and CONTACT_TO_EMAIL; CONTACT_FROM must be a verified sender.
export async function sendContact(_prev: State, fd: FormData): Promise<State> {
  if (String(fd.get("website") ?? "")) return { ok: true }; // honeypot: bots fill the hidden field
  const s = (k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);
  const name = s("name", 100), email = s("email", 200), phone = s("phone", 20), message = s("message", 4000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter your name, a valid email and a message." };

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return { error: "Messaging is not set up yet. Please call us instead." };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "onboarding@resend.dev",
      to: [to],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n\n${message}`, // plain text: no HTML injection
    }),
  });
  return res.ok ? { ok: true } : { error: "Could not send your message. Please try again or call us." };
}
