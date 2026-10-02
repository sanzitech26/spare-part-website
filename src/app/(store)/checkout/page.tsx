import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CheckoutForm from "./CheckoutForm";

export default async function Checkout() {
  const { data: { user } } = await (await supabase()).auth.getUser();
  if (!user) redirect("/login?next=/checkout");
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
