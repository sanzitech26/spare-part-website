"use server";
import { redirect } from "next/navigation";
import { serviceDb } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import { FLAT_SHIPPING, FREE_SHIPPING_OVER } from "@/lib/shipping";

export async function placeOrder(_prev: { error: string } | null, fd: FormData): Promise<{ error: string }> {
  const { data: { user } } = await (await supabase()).auth.getUser();
  if (!user) redirect("/login?next=/checkout");

  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const address = { name: s("name"), phone: s("phone"), line1: s("line1"), line2: s("line2"), city: s("city"), state: s("state"), pincode: s("pincode") };
  if (!address.name || !address.line1 || !address.city || !address.state) return { error: "Please fill in all required fields." };
  if (!/^\d{10}$/.test(address.phone)) return { error: "Enter a 10-digit phone number." };
  if (!/^\d{6}$/.test(address.pincode)) return { error: "Enter a 6-digit pincode." };

  let items: { id: number; qty: number }[];
  try {
    items = (JSON.parse(s("items")) as { id: number; qty: number }[]).map((i) => ({ id: Number(i.id), qty: Number(i.qty) }));
  } catch {
    return { error: "Your cart could not be read." };
  }
  if (!items.length || items.some((i) => !Number.isInteger(i.id) || !Number.isInteger(i.qty))) return { error: "Your cart is empty." };

  // Prices and stock come from the database inside place_order; only ids and quantities are taken from the client.
  const { data, error } = await serviceDb().rpc("place_order", {
    p_user: user.id, p_items: items, p_address: address, p_free_over: FREE_SHIPPING_OVER, p_flat: FLAT_SHIPPING,
  });
  if (error) return { error: error.message };
  redirect(`/order-placed?id=${data}`);
}
