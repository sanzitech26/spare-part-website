import "server-only";

// HTML + plain-text bodies for the emails the admin receives. Every customer-supplied value goes through esc().
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const money = (n: number) => `£${Number(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const site = () => (process.env.SITE_URL || "https://mbspareparts.co.uk").replace(/\/$/, "");

const wrap = (title: string, body: string) => `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1e293b">
<div style="max-width:620px;margin:0 auto;padding:24px 12px">
<div style="background:#171a21;color:#fff;padding:16px 24px;border-radius:12px 12px 0 0;font-size:18px;font-weight:bold">MBSpareParts<span style="font-weight:normal;color:#94a3b8">.co.uk</span></div>
<div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:0">
<h1 style="margin:0 0 16px;font-size:20px">${title}</h1>${body}</div></div></body></html>`;

const row = (k: string, v: string) => `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0">${v}</td></tr>`;

export type OrderMail = {
  id: string; name: string; email: string; address: string;
  items: { sku: string; name: string; qty: number; price: number }[]; shipping: number; total: number;
};

export function orderEmail(o: OrderMail) {
  const ref = o.id.slice(0, 8);
  const lines = o.items.map((i) => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">${esc(i.name)}<br><span style="color:#64748b;font-size:12px">${esc(i.sku)}</span></td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${money(i.price)}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${money(i.price * i.qty)}</td></tr>`).join("");
  const html = wrap(`New order #${esc(ref)}`, `
<p style="margin:0 0 16px;color:#475569">A customer placed an order. Payment is on delivery. Reply to this email to contact them.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px;margin-bottom:20px">${row("Customer", esc(o.name))}${row("Email", `<a href="mailto:${esc(o.email)}">${esc(o.email)}</a>`)}${row("Deliver to", esc(o.address))}</table>
<table style="border-collapse:collapse;width:100%;font-size:14px"><tr style="background:#f1f5f9;text-align:left"><th style="padding:8px">Part</th><th style="padding:8px;text-align:center">Qty</th><th style="padding:8px;text-align:right">Price</th><th style="padding:8px;text-align:right">Line total</th></tr>${lines}
<tr><td colspan="3" style="padding:8px;text-align:right;color:#64748b">Shipping</td><td style="padding:8px;text-align:right">${o.shipping ? money(o.shipping) : "Free"}</td></tr>
<tr><td colspan="3" style="padding:8px;text-align:right;font-weight:bold">Total to collect</td><td style="padding:8px;text-align:right;font-weight:bold;font-size:16px">${money(o.total)}</td></tr></table>
<p style="margin:24px 0 0"><a href="${site()}/admin/orders" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:14px">Open in admin</a></p>`);
  const text = [
    `NEW ORDER #${ref}`, "(Payment on delivery. Reply to this email to contact the customer.)", "",
    `Customer:   ${o.name}`, `Email:      ${o.email}`, `Deliver to: ${o.address}`, "", "ITEMS",
    ...o.items.map((i) => `- ${i.qty} x ${i.name} (${i.sku}) @ ${money(i.price)} = ${money(i.price * i.qty)}`), "",
    `Shipping: ${o.shipping ? money(o.shipping) : "Free"}`, `TOTAL TO COLLECT: ${money(o.total)}`, "", `Admin: ${site()}/admin/orders`,
  ].join("\n");
  return { subject: `New order #${ref} · ${money(o.total)} · ${o.name}`, html, text };
}

export function contactEmail(c: { name: string; email: string; part?: string; message: string }) {
  const html = wrap("New website enquiry", `
<table style="border-collapse:collapse;font-size:14px;margin-bottom:16px">${row("From", esc(c.name))}${row("Email", `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`)}${c.part ? row("Part wanted", esc(c.part)) : ""}</table>
<div style="background:#f8fafc;border-left:4px solid #4f46e5;padding:12px 16px;white-space:pre-wrap;font-size:14px;line-height:1.5">${esc(c.message)}</div>
<p style="margin:16px 0 0;color:#64748b;font-size:12px">Just hit Reply: your answer goes straight to the customer.</p>`);
  const text = `NEW WEBSITE ENQUIRY\n(Just hit Reply to answer the customer.)\n\nFrom:  ${c.name}\nEmail: ${c.email}\n${c.part ? `Part:  ${c.part}\n` : ""}\nMessage:\n${c.message}`;
  return { subject: `Website enquiry from ${c.name}`, html, text };
}
