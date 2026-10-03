import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Checkout" };

export default function Checkout() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
