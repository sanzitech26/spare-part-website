"use server";
import { redirect } from "next/navigation";
import { serviceDb } from "@/lib/admin";
import { sendMail } from "@/lib/mail";
import { FLAT_SHIPPING, FREE_SHIPPING_OVER } from "@/lib/shipping";

// Guest checkout: no account. Prices come from the database inside place_order; only ids and quantities are taken from the client.
export async function placeOrder(_prev: { error: string } | null, fd: FormData): Promise<{ error: string }> {
  if (String(fd.get("website") ?? "")) redirect("/order-placed"); // honeypot: pretend success to bots

  const s = (k: string) => String(fd.get(k) ?? "").trim().slice(0, 200);
  const address = { name: s("name"), phone: s("phone"), email: s("email"), line1: s("line1"), line2: s("line2"), city: s("city"), state: s("state"), pincode: s("pincode") };
  if (!address.name || !address.line1 || !address.city || !address.state) return { error: "Please fill in all required fields." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) return { error: "Enter a valid email address." };
  if (!/^\d{10}$/.test(address.phone)) return { error: "Enter a 10-digit phone number." };
  if (!/^\d{6}$/.test(address.pincode)) return { error: "Enter a 6-digit pincode." };

  let items: { id: number; qty: number }[];
  try {
    items = (JSON.parse(String(fd.get("items") ?? "")) as { id: number; qty: number }[]).map((i) => ({ id: Number(i.id), qty: Number(i.qty) }));
  } catch {
    return { error: "Your cart could not be read." };
  }
  if (!items.length || items.length > 50 || items.some((i) => !Number.isInteger(i.id) || !Number.isInteger(i.qty) || i.qty < 1 || i.qty > 100)) {
    return { error: "Your cart is empty or invalid." };
  }

  const db = serviceDb();
  const { data: id, error } = await db.rpc("place_order", {
    p_user: null, p_items: items, p_address: address, p_free_over: FREE_SHIPPING_OVER, p_flat: FLAT_SHIPPING,
  });
  if (error) return { error: error.message };

  // Email the order to the store. Never fails the order: it is already saved and visible in /admin/orders.
  const { data: order } = await db.from("orders").select("total, shipping, order_items(qty, unit_price, products(sku, name))").eq("id", id).single();
  if (order) {
    const lines = (order.order_items as unknown as { qty: number; unit_price: number; products: { sku: string; name: string } | { sku: string; name: string }[] }[])
      .map((i) => { const p = Array.isArray(i.products) ? i.products[0] : i.products; return `${i.qty} x ${p?.name} (${p?.sku}) @ $${i.unit_price} = $${i.qty * i.unit_price}`; });
    await sendMail({
      subject: `New order #${String(id).slice(0, 8)} from ${address.name}`,
      replyTo: address.email,
      text: [
        `Order ${id}`, "", ...lines, "", `Shipping: $${order.shipping}`, `TOTAL (pay on delivery): $${order.total}`, "",
        `Name: ${address.name}`, `Phone: ${address.phone}`, `Email: ${address.email}`,
        `Address: ${[address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(", ")}`,
      ].join("\n"),
    });
  }
  redirect(`/order-placed?id=${id}`);
}
